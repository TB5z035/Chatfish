'''
Test suite for meeting
'''
import datetime, json, hashlib
from django.test import Client, TestCase
from apis.models import User, UserMeta, Chat, ChatMeta, Message, OfflineMessage

TEST_USER = 'test'
TEST_PWD = '0c7c4f7e4b9f49ba6d09bf00d5b62a3950f13b3c'
TEST_EMAIL = 'test@admin.email'

FRIEND = 'friend'
MEMBER = 'member'

TEST_FRIEND_USER = 'friend'
TEST_EMAIL = 'friend@admin.email'

TEST_NEW_FRIEND_USER = 'new_friend'
TEST_NEW_EMAIL = 'new_friend@admin.email'

TEST_CONTENT = 'Test content'
TEST_UPLOAD = 'Test upload!'
PRIVATE_CHAT = 'private chat'
GROUP_CHAT = 'test group'
GROUP_NEW_CHAT = 'test new group'

INVALID_USER = 'Invalid token or username or friend name!'

class GetTest(TestCase):
    '''
    TestCase for Get request
    '''

    def setUp(self):
        super(GetTest, self).setUp()
        self.client = Client(enforce_csrf_checks = True)

    def test_get(self):
        response = self.client.get('/api/get_data/')
        self.assertEqual(response.status_code, 200)

class PostTest(TestCase):
    '''
    TestCase for Post request
    '''

    def setUp(self):
        super(PostTest, self).setUp()
        self.client = Client(enforce_csrf_checks = True)
        User.objects.create(name = TEST_USER, pwd = TEST_PWD, email = TEST_EMAIL)
        self.uid1 = User.objects.get(name = TEST_USER).uid

    def post_test(self, client, data):
        data = json.dumps(data)
        text_bytes = (data + ' post from ChatFish Server').encode('utf-8')
        sha1 = hashlib.sha1(text_bytes)
        key = sha1.hexdigest()
        return client.post('/api/post_data/', data = data, HTTP_DATA_KEY = key, content_type = 'application/json')

class WrongPostTest(PostTest):
    '''
    TestCase for Wrong Post request
    '''
    
    def setUp(self):
        super().setUp()

    def test_wrong_post(self):
        data = {
            'type': 'TEST'
        }
        data = json.dumps(data)
        text_bytes = (data + ' this is wrong').encode('utf-8')
        sha1 = hashlib.sha1(text_bytes)
        key = sha1.hexdigest()
        response = self.client.post('/api/post_data/', data = data, HTTP_DATA_KEY = key, content_type = 'application/json')
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 399)
        self.assertEqual(res_json.get('message'), 'Wrong data key!')

class LoginTest(PostTest):
    '''
    TestCase for Login post request
    '''
    
    def setUp(self):
        super().setUp()

    def test_login_success(self):
        data = {
            'type': 'LOGIN_VERIFY',
            'user_info': {
                'username': TEST_USER,
                'password': TEST_PWD
            }
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('id'), self.uid1)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully verified!')

    def test_login_wrong_pwd(self):
        data = {
            'type': 'LOGIN_VERIFY',
            'user_info': {
                'username': TEST_USER,
                'password': 'this is wrong'
            }
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 401)
        self.assertEqual(res_json.get('message'), 'Invalid password!')

    def test_login_wrong_username(self):
        data = {
            'type': 'LOGIN_VERIFY',
            'user_info': {
                'username': 'test_wrong',
                'password': TEST_PWD
            }
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 400)
        self.assertEqual(res_json.get('message'), 'Invalid username!')

class RegisterTest(PostTest):
    '''
    TestCase for Register post request
    '''
    
    def setUp(self):
        super().setUp()
    
    def test_register_in_success(self):
        data = {
            'type': 'REGISTER_IN',
            'user_info': {
                'username': 'test_new',
                'password': TEST_PWD
            }
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully registered!')

    def test_register_in_same_username(self):
        data = {
            'type': 'REGISTER_IN',
            'user_info': {
                'username': TEST_USER,
                'password': TEST_PWD
            }
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 403)
        self.assertEqual(res_json.get('message'), 'Reduplicated user name.')

    def test_register_in_wrong_data(self):
        data = {
            'type': 'REGISTER_IN',
            'user_info': {
                'username': 'test_new'
            }
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 403)
        self.assertEqual(res_json.get('message'), 'Invalid register info.')

class RequireFriendListTest(PostTest):
    '''
    TestCase for Require Friend List post request
    '''
    
    def setUp(self):
        super().setUp()
        User.objects.create(name = TEST_FRIEND_USER, pwd = TEST_PWD, email = TEST_EMAIL)
        self.uid2 = User.objects.get(name = TEST_FRIEND_USER).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid2))
        UserMeta.objects.create(uid = self.uid2, meta_name = FRIEND, meta_value = str(self.uid1))
        Chat.objects.create(name = PRIVATE_CHAT, ctype = 0)
        self.cid1 = Chat.objects.get(name = PRIVATE_CHAT).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid2))
        Message.objects.create(uid = self.uid1, cid = self.cid1, mtype = 'normal', content = TEST_CONTENT)

    def test_require_friend_list(self):
        data = {
            'type': 'REQUIRE_FRIEND_LIST',
            'uid': self.uid1
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully fetched.')
        self.assertEqual(len(res_json.get('message_list')), 1)
        self.assertEqual(res_json.get('message_list')[0].get('isGroup'), 0)
        self.assertEqual(res_json.get('message_list')[0].get('user'), TEST_FRIEND_USER)
        self.assertEqual(len(res_json.get('message_list')[0].get('message_list')), 1)
        self.assertEqual(res_json.get('message_list')[0].get('message_list')[0].get('mtype'), 'normal')
        self.assertEqual(res_json.get('message_list')[0].get('message_list')[0].get('from'), TEST_USER)
        self.assertEqual(res_json.get('message_list')[0].get('message_list')[0].get('content'), TEST_CONTENT)

    def test_all_message(self):
        data = {
            'type': 'ALL_MESSAGE',
            'uid': self.uid1
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'All message required successfully.')
        self.assertEqual(len(res_json.get('message_list')), 1)
        self.assertEqual(res_json.get('message_list')[0].get('isGroup'), 0)
        self.assertEqual(res_json.get('message_list')[0].get('user'), TEST_FRIEND_USER)
        self.assertEqual(len(res_json.get('message_list')[0].get('message_list')), 1)
        self.assertEqual(res_json.get('message_list')[0].get('message_list')[0].get('mtype'), 'normal')
        self.assertEqual(res_json.get('message_list')[0].get('message_list')[0].get('from'), TEST_USER)
        self.assertEqual(res_json.get('message_list')[0].get('message_list')[0].get('content'), TEST_CONTENT)

class MessageUploadTest(PostTest):
    '''
    TestCase for Message Upload post request
    '''
    
    def setUp(self):
        super().setUp()
        User.objects.create(name = TEST_FRIEND_USER, pwd = TEST_PWD, email = TEST_EMAIL)
        self.uid2 = User.objects.get(name = TEST_FRIEND_USER).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid2))
        UserMeta.objects.create(uid = self.uid2, meta_name = FRIEND, meta_value = str(self.uid1))
        Chat.objects.create(name = PRIVATE_CHAT, ctype = 0)
        self.cid1 = Chat.objects.get(name = PRIVATE_CHAT).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid2))
        Chat.objects.create(name = GROUP_CHAT, ctype = 1)
        self.cid2 = Chat.objects.get(name = GROUP_CHAT).cid
        ChatMeta.objects.create(cid = self.cid2, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid2, meta_name = MEMBER, meta_value = str(self.uid2))
    
    def test_private_message_upload_success(self):
        data = {
            'type': 'MESSAGE_UPLOAD',
            'is_group': 0,
            'uid': self.uid1,
            'content': TEST_UPLOAD,
            'userName': TEST_USER,
            'friend_name': TEST_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully uploaded.')

    def test_private_message_upload_fail(self):
        data = {
            'type': 'MESSAGE_UPLOAD',
            'is_group': 0,
            'uid': self.uid1,
            'content': TEST_UPLOAD,
            'userName': TEST_USER,
            'friend_name': 'NotFriend'
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 400)
        self.assertEqual(res_json.get('message'), 'Upload failed.')

    def test_group_message_upload_success(self):
        data = {
            'type': 'MESSAGE_UPLOAD',
            'is_group': 1,
            'uid': self.uid1,
            'content': TEST_UPLOAD,
            'userName': TEST_USER,
            'friend_name': GROUP_CHAT
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully uploaded.')

class AddFriendTest(PostTest):
    '''
    TestCase for Add Friend post request
    '''

    def setUp(self):
        super().setUp()
        User.objects.create(name = TEST_FRIEND_USER, pwd = TEST_PWD, email = TEST_EMAIL)
        self.uid2 = User.objects.get(name = TEST_FRIEND_USER).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid2))
        UserMeta.objects.create(uid = self.uid2, meta_name = FRIEND, meta_value = str(self.uid1))
        Chat.objects.create(name = PRIVATE_CHAT, ctype = 0)
        self.cid1 = Chat.objects.get(name = PRIVATE_CHAT).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid2))
        User.objects.create(name = TEST_NEW_FRIEND_USER, pwd = TEST_PWD, email = TEST_NEW_EMAIL)
        
    def test_add_friend_success(self):
        data = {
            'type': 'ADD_NEW_FRIEND',
            'uid': self.uid1,
            'friend_name': TEST_NEW_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully requested!')
    
    def test_add_friend_none(self):
        data = {
            'type': 'ADD_NEW_FRIEND',
            'uid': self.uid1,
            'friend_name': 'NotExist'
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), INVALID_USER)
    
    def test_add_friend_self(self):
        data = {
            'type': 'ADD_NEW_FRIEND',
            'uid': self.uid1,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 400)
        self.assertEqual(res_json.get('message'), 'Cannot add yourself as friend!')
    
    def test_add_friend_same(self):
        data = {
            'type': 'ADD_NEW_FRIEND',
            'uid': self.uid1,
            'friend_name': TEST_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 400)
        self.assertEqual(res_json.get('message'), 'They are already friends!')

    def test_agree_new_friend_success(self):
        data = {
            'type': 'AGREE_ADD_NEW_FRIEND',
            'uid': self.uid1,
            'friend_name': TEST_NEW_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully requested!')

    def test_agree_new_friend_none(self):
        data = {
            'type': 'AGREE_ADD_NEW_FRIEND',
            'uid': self.uid1,
            'friend_name': 'NotExist'
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), INVALID_USER)

    def test_agree_new_friend_self(self):
        data = {
            'type': 'AGREE_ADD_NEW_FRIEND',
            'uid': self.uid1,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'Cannot add yourself as friend!')

    def test_agree_new_friend_same(self):
        data = {
            'type': 'AGREE_ADD_NEW_FRIEND',
            'uid': self.uid1,
            'friend_name': TEST_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'They are already friends!')

    def test_agree_new_friend_fail(self):
        data = {
            'type': 'AGREE_ADD_NEW_FRIEND',
            'uid': 0,
            'friend_name': TEST_NEW_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), INVALID_USER)

class AddGroupTest(PostTest):
    '''
    TestCase for Add Group post request
    '''

    def setUp(self):
        super().setUp()
        User.objects.create(name = TEST_FRIEND_USER, pwd = TEST_PWD, email = TEST_EMAIL)
        self.uid2 = User.objects.get(name = TEST_FRIEND_USER).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid2))
        UserMeta.objects.create(uid = self.uid2, meta_name = FRIEND, meta_value = str(self.uid1))
        self.cid1 = Chat.objects.create(name = PRIVATE_CHAT, ctype = 0).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid2))
        User.objects.create(name = TEST_NEW_FRIEND_USER, pwd = TEST_PWD, email = TEST_NEW_EMAIL)
        self.uid3 = User.objects.get(name = TEST_NEW_FRIEND_USER).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid3))
        UserMeta.objects.create(uid = self.uid3, meta_name = FRIEND, meta_value = str(self.uid1))
        self.cid2 = Chat.objects.create(name = PRIVATE_CHAT, ctype = 0).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid3))
        self.cid3 = Chat.objects.create(name = GROUP_CHAT, ctype = 1).cid
        ChatMeta.objects.create(cid = self.cid3, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid3, meta_name = MEMBER, meta_value = str(self.uid2))

    def test_add_group_success(self):
        data = {
            'type': 'ADD_GROUP',
            'is_init': 0,
            'group_name': GROUP_NEW_CHAT,
            'uid': self.uid1,
            'friend_list': [
                TEST_FRIEND_USER,
                TEST_NEW_FRIEND_USER
            ]
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully init group chat.')

    def test_add_group_not_friend(self):
        data = {
            'type': 'ADD_GROUP',
            'is_init': 0,
            'group_name': GROUP_NEW_CHAT,
            'uid': self.uid1,
            'friend_list': [
                TEST_FRIEND_USER,
                'NotExist'
            ]
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 403)
        self.assertEqual(res_json.get('message'), 'Someone not friend.')

    def test_add_group_invalid(self):
        data = {
            'type': 'ADD_GROUP',
            'group_name': PRIVATE_CHAT,
            'uid': self.uid1,
            'friend_list': [
                TEST_FRIEND_USER,
                TEST_NEW_FRIEND_USER
            ]
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 403)
        self.assertEqual(res_json.get('message'), 'Group name invalid.')

    def test_add_group_without_friendlist(self):
        data = {
            'type': 'ADD_GROUP',
            'is_init': 1,
            'group_name': GROUP_CHAT,
            'uid': self.uid1
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'No friend list available!')

    def test_add_group_after_init(self):
        data = {
            'type': 'ADD_GROUP',
            'is_init': 1,
            'group_name': GROUP_CHAT,
            'uid': self.uid1,
            'friend_list': [
                TEST_FRIEND_USER,
                TEST_NEW_FRIEND_USER
            ]
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully requested!')

    def test_agree_add_group_success(self):
        data = {
            'type': 'AGREE_ADD_GROUP',
            'group_name': GROUP_CHAT,
            'uid': self.uid3,
            'username': TEST_NEW_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully requested!')

    def test_agree_add_group_fail(self):
        data = {
            'type': 'AGREE_ADD_GROUP',
            'group_name': 'NotExist',
            'uid': self.uid3,
            'username': TEST_NEW_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'No group with this name!')
        