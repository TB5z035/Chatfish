'''
Test suite for meeting
'''
import datetime, json, hashlib
from django.test import Client, TestCase
from apis.models import User, UserMeta, Chat, ChatMeta, Message, OfflineMessage, OfflineRequest
from config.local_settings import TEST_PWD
from config.local_settings import WRONG_PWD

TEST_USER = 'test'
TEST_EMAIL = 'test@admin.email'
TEST_NICKNAME = 'test_nick'

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
        self.client = Client(enforce_csrf_checks = False)
        User.objects.create(name = TEST_USER, pwd = TEST_PWD, email = TEST_EMAIL, nickname = TEST_NICKNAME)
        self.uid1 = User.objects.get(name = TEST_USER).uid

    def post_test(self, client, data):
        data = json.dumps(data)
        text_bytes = (data + ' post from ChatFish Server').encode('utf-8')
        sha3_512 = hashlib.sha3_512(text_bytes)
        key = sha3_512.hexdigest()
        return client.post('/api/post_data/', data = data, HTTP_DATA_KEY = key, content_type = 'application/json')

class BasePostTest(PostTest):
    '''
    TestCase for Base Post request
    '''
    
    def setUp(self):
        super().setUp()

    def test_wrong_post(self):
        data = {
            'type': 'TEST'
        }
        data = json.dumps(data)
        text_bytes = (data + ' this is wrong').encode('utf-8')
        sha3_512 = hashlib.sha3_512(text_bytes)
        key = sha3_512.hexdigest()
        response = self.client.post('/api/post_data/', data = data, HTTP_DATA_KEY = key, content_type = 'application/json')
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 399)
        self.assertEqual(res_json.get('message'), 'Wrong data key!')

    def test_post_without_type(self):
        data = {
            'wrong_type': 'TEST'
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 399)
        self.assertEqual(res_json.get('message'), 'No type info!')

    def test_post_success(self):
        data = {
            'type': 'TEST'
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'successful testing.')

    def test_response_success(self):
        data = {
            'type': 'RESPONSE'
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Got the response!')

    def test_others(self):
        data = {
            'type': 'OTHERS'
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 404)
        self.assertEqual(res_json.get('message'), 'undefined API.')

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
                'password': WRONG_PWD
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
                'password': TEST_PWD,
                'email': TEST_EMAIL,
                'nickname': TEST_NICKNAME
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
                'password': TEST_PWD,
                'email': TEST_EMAIL,
                'nickname': TEST_NICKNAME
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
        self.cid1 = Chat.objects.create(name = PRIVATE_CHAT, ctype = 0).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid2))
        Message.objects.create(uid = self.uid1, cid = self.cid1, mtype = 'normal', content = TEST_CONTENT)
        self.cid2 = Chat.objects.create(name = GROUP_CHAT, ctype = 1).cid
        ChatMeta.objects.create(cid = self.cid2, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid2, meta_name = MEMBER, meta_value = str(self.uid2))
        Message.objects.create(uid = self.uid1, cid = self.cid2, mtype = 'normal', content = TEST_CONTENT)

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
        self.assertEqual(len(res_json.get('message_list')), 2)

    def test_require_friend_list_fail(self):
        data = {
            'type': 'REQUIRE_FRIEND_LIST',
            'uid': 0
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 400)
        self.assertEqual(res_json.get('message'), 'fetch failed.')

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
        self.assertEqual(len(res_json.get('message_list')), 2)

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

    def test_private_message_upload_something_wrong(self):
        data = {
            'type': 'MESSAGE_UPLOAD',
            'is_group': 0,
            'mtype': 'this is too long...',
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

    def test_group_message_upload_success(self):
        data = {
            'type': 'MESSAGE_UPLOAD',
            'is_group': 1,
            'uid': self.uid1,
            'content': TEST_UPLOAD,
            'userName': TEST_USER,
            'friend_name': self.cid2
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully uploaded.')

    def test_group_message_upload_fail(self):
        data = {
            'type': 'MESSAGE_UPLOAD',
            'is_group': 1,
            'mtype': 'this is too long...',
            'uid': self.uid1,
            'content': TEST_UPLOAD,
            'userName': TEST_USER,
            'friend_name': self.cid2
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
        self.uid3 = User.objects.create(name = TEST_NEW_FRIEND_USER, pwd = TEST_PWD, email = TEST_NEW_EMAIL).uid
        OfflineRequest.objects.create(name = TEST_NICKNAME + '@' + TEST_USER, ruid = self.uid3, suid = self.uid1, req_type = 0)
        self.uid4 = User.objects.create(name = TEST_NEW_FRIEND_USER + '_a', pwd = TEST_PWD, email = TEST_NEW_EMAIL).uid
        
    def test_add_friend_success(self):
        data = {
            'type': 'ADD_NEW_FRIEND',
            'uid': self.uid1,
            'friend_name': TEST_NEW_FRIEND_USER + '_a'
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
    
    def test_add_friend_multi(self):
        data = {
            'type': 'ADD_NEW_FRIEND',
            'uid': self.uid1,
            'friend_name': TEST_NEW_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 400)
        self.assertEqual(res_json.get('message'), 'You hava requested before!')

    def test_agree_new_friend_success(self):
        data = {
            'type': 'AGREE_ADD_NEW_FRIEND',
            'uid': self.uid3,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully requested!')

    def test_agree_new_friend_none(self):
        data = {
            'type': 'AGREE_ADD_NEW_FRIEND',
            'uid': self.uid3,
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
            'uid': self.uid3,
            'friend_name': TEST_NEW_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'Cannot add yourself as friend!')

    def test_agree_new_friend_same(self):
        data = {
            'type': 'AGREE_ADD_NEW_FRIEND',
            'uid': self.uid2,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'They are already friends!')

    def test_agree_new_friend_without_request(self):
        data = {
            'type': 'AGREE_ADD_NEW_FRIEND',
            'uid': self.uid4,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'No such request!')

    def test_disagree_new_friend_success(self):
        data = {
            'type': 'DISAGREE_ADD_NEW_FRIEND',
            'uid': self.uid3,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully requested!')

    def test_disagree_new_friend_none(self):
        data = {
            'type': 'DISAGREE_ADD_NEW_FRIEND',
            'uid': self.uid3,
            'friend_name': 'NotExist'
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'Invalid token or username or friend name!')

    def test_disagree_new_friend_same(self):
        data = {
            'type': 'DISAGREE_ADD_NEW_FRIEND',
            'uid': self.uid2,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'They are already friends!')

    def test_disagree_new_friend_self(self):
        data = {
            'type': 'DISAGREE_ADD_NEW_FRIEND',
            'uid': self.uid3,
            'friend_name': TEST_NEW_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'Cannot deny yourself as friend!')

    def test_disagree_new_friend_without_request(self):
        data = {
            'type': 'DISAGREE_ADD_NEW_FRIEND',
            'uid': self.uid4,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'Invalid token or username or friend name!')
    
    def test_delete_friend_success(self):
        data = {
            'type': 'DELETE_FRIEND',
            'uid': self.uid1,
            'friend_name': TEST_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successful requested')
    
    def test_delete_friend_fail(self):
        data = {
            'type': 'DELETE_FRIEND',
            'uid': self.uid1,
            'friend_name': TEST_NEW_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'Invalid token or username or friend name')

class AddGroupTest(PostTest):
    '''
    TestCase for Add Group post request
    '''

    def setUp(self):
        super().setUp()
        self.uid2 = User.objects.create(name = TEST_FRIEND_USER, pwd = TEST_PWD, email = TEST_EMAIL).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid2))
        UserMeta.objects.create(uid = self.uid2, meta_name = FRIEND, meta_value = str(self.uid1))
        self.cid1 = Chat.objects.create(name = PRIVATE_CHAT, ctype = 0).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid2))
        self.uid3 = User.objects.create(name = TEST_NEW_FRIEND_USER, pwd = TEST_PWD, email = TEST_NEW_EMAIL).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid3))
        UserMeta.objects.create(uid = self.uid3, meta_name = FRIEND, meta_value = str(self.uid1))
        self.cid2 = Chat.objects.create(name = PRIVATE_CHAT, ctype = 0).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid3))
        self.cid3 = Chat.objects.create(name = GROUP_CHAT, ctype = 1).cid
        ChatMeta.objects.create(cid = self.cid3, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid3, meta_name = MEMBER, meta_value = str(self.uid2))
        OfflineRequest.objects.create(name = GROUP_CHAT + '@' + str(self.cid3), ruid = self.uid3, suid = self.uid1, req_type = 1)
        self.uid4 = User.objects.create(name = TEST_NEW_FRIEND_USER + '_a', pwd = TEST_PWD, email = TEST_EMAIL).uid

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

    def test_add_group_without_friendlist(self):
        data = {
            'type': 'ADD_GROUP',
            'is_init': 1,
            'group_name': self.cid3,
            'uid': self.uid1
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'No friend list available!')

    def test_add_group_without_is_init(self):
        data = {
            'type': 'ADD_GROUP',
            'group_name': self.cid3,
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
        self.assertEqual(res_json.get('message'), 'Invalid request for add group.')

    def test_add_group_after_init(self):
        data = {
            'type': 'ADD_GROUP',
            'is_init': 1,
            'group_name': self.cid3,
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
            'group_name': self.cid3,
            'uid': self.uid3,
            'username': TEST_NEW_FRIEND_USER,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully requested!')

    def test_agree_add_group_without_request(self):
        data = {
            'type': 'AGREE_ADD_GROUP',
            'group_name': self.cid3,
            'uid': self.uid4,
            'username': TEST_NEW_FRIEND_USER + '_a',
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'No such request!')

    def test_agree_add_group_fail(self):
        data = {
            'type': 'AGREE_ADD_GROUP',
            'group_name': 'NotExist',
            'uid': self.uid3,
            'username': TEST_NEW_FRIEND_USER,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'No group with this name!')

    def test_disagree_add_group_success(self):
        data = {
            'type': 'DISAGREE_ADD_GROUP',
            'group_name': self.cid3,
            'uid': self.uid3,
            'username': TEST_NEW_FRIEND_USER,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully requested!')

    def test_disagree_add_group_fail(self):
        data = {
            'type': 'DISAGREE_ADD_GROUP',
            'group_name': 'NotExist',
            'uid': self.uid3,
            'username': TEST_NEW_FRIEND_USER,
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'No group with this name!')

    def test_disagree_add_group_without_request(self):
        data = {
            'type': 'DISAGREE_ADD_GROUP',
            'group_name': self.cid3,
            'uid': self.uid4,
            'username': TEST_NEW_FRIEND_USER + '_a',
            'friend_name': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'No such request!')

    def test_leave_group_success(self):
        data = {
            'type': 'LEAVE_GROUP',
            'group_name': self.cid3,
            'uid': self.uid1
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successful requested')

    def test_leave_group_fail(self):
        data = {
            'type': 'LEAVE_GROUP',
            'group_name': self.cid3,
            'uid': self.uid3
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 405)
        self.assertEqual(res_json.get('message'), 'Failed')

class FetchGroupMemberTest(PostTest):
    '''
    TestCase for Fetch Group Member post request
    '''

    def setUp(self):
        super().setUp()
        self.uid2 = User.objects.create(name = TEST_FRIEND_USER, pwd = TEST_PWD, email = TEST_EMAIL).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid2))
        UserMeta.objects.create(uid = self.uid2, meta_name = FRIEND, meta_value = str(self.uid1))
        self.cid1 = Chat.objects.create(name = PRIVATE_CHAT, ctype = 0).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid2))
        self.uid3 = User.objects.create(name = TEST_NEW_FRIEND_USER, pwd = TEST_PWD, email = TEST_NEW_EMAIL).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid3))
        UserMeta.objects.create(uid = self.uid3, meta_name = FRIEND, meta_value = str(self.uid1))
        self.cid2 = Chat.objects.create(name = PRIVATE_CHAT, ctype = 0).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid3))
        self.cid3 = Chat.objects.create(name = GROUP_CHAT, ctype = 1).cid
        ChatMeta.objects.create(cid = self.cid3, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid3, meta_name = MEMBER, meta_value = str(self.uid2))

    def test_fetch_group_member_success(self):
        data = {
            'type': 'FETCH_GROUP_MEMBER',
            'group_name': self.cid3,
            'username': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully requested.')
        self.assertEqual(len(res_json.get('group_member')), 2)

    def test_fetch_group_member_fail(self):
        data = {
            'type': 'FETCH_GROUP_MEMBER',
            'group_name': 0,
            'username': TEST_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 400)
        self.assertEqual(res_json.get('message'), 'Fetch failed.')

class ChatEnterTest(PostTest):
    '''
    TestCase for Chat Enter post request
    '''

    def setUp(self):
        super().setUp()
        self.uid2 = User.objects.create(name = TEST_FRIEND_USER, pwd = TEST_PWD, email = TEST_EMAIL).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid2))
        UserMeta.objects.create(uid = self.uid2, meta_name = FRIEND, meta_value = str(self.uid1))
        self.cid1 = Chat.objects.create(name = PRIVATE_CHAT, ctype = 0).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid2))
        self.uid3 = User.objects.create(name = TEST_NEW_FRIEND_USER, pwd = TEST_PWD, email = TEST_NEW_EMAIL).uid
        self.cid2 = Chat.objects.create(name = GROUP_CHAT, ctype = 1).cid
        ChatMeta.objects.create(cid = self.cid2, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid2, meta_name = MEMBER, meta_value = str(self.uid2))

    def test_chat_enter_private_success(self):
        data = {
            'type': 'CHAT_ENTER',
            'is_group': 0,
            'uid': self.uid1,
            'friend_name': TEST_FRIEND_USER
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully delete offline messages.')

    def test_chat_enter_group_success(self):
        data = {
            'type': 'CHAT_ENTER',
            'is_group': 1,
            'uid': self.uid1,
            'group_name': self.cid2
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)
        self.assertEqual(res_json.get('message'), 'Successfully delete offline messages.')

class ChatFetchTest(PostTest):
    '''
    TestCase for Chat Fetch post request
    '''

    def setUp(self):
        super().setUp()
        self.uid2 = User.objects.create(name = TEST_FRIEND_USER, pwd = TEST_PWD, email = TEST_EMAIL).uid
        UserMeta.objects.create(uid = self.uid1, meta_name = FRIEND, meta_value = str(self.uid2))
        UserMeta.objects.create(uid = self.uid2, meta_name = FRIEND, meta_value = str(self.uid1))
        self.cid1 = Chat.objects.create(name = PRIVATE_CHAT, ctype = 0).cid
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid1, meta_name = MEMBER, meta_value = str(self.uid2))
        self.uid3 = User.objects.create(name = TEST_NEW_FRIEND_USER, pwd = TEST_PWD, email = TEST_NEW_EMAIL).uid
        self.cid2 = Chat.objects.create(name = GROUP_CHAT, ctype = 1).cid
        ChatMeta.objects.create(cid = self.cid2, meta_name = MEMBER, meta_value = str(self.uid1))
        ChatMeta.objects.create(cid = self.cid2, meta_name = MEMBER, meta_value = str(self.uid2))

    def test_chat_fetch_private_success(self):
        data = {
            'type': 'CHAT_FETCH',
            'is_group': 0,
            'uid': self.uid1,
            'friend_name': TEST_FRIEND_USER,
            'page': 0
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)

    def test_chat_fetch_group_success(self):
        data = {
            'type': 'CHAT_FETCH',
            'is_group': 1,
            'uid': self.uid1,
            'friend_name': self.cid2,
            'page': 0
        }
        response = self.post_test(self.client, data)
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.content)
        self.assertEqual(res_json.get('state'), 200)