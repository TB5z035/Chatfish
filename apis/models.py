from django.db import models
from django.forms import ModelForm

# Create your models here.
class User(models.Model):
    uid = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 12, unique = True)
    pwd = models.CharField(max_length = 50)
    email = models.EmailField(blank = True)
    nickname = models.CharField(max_length = 12, blank = True)

class UserMeta(models.Model):
    '''
    meta_name:
        friend
        chat
        ...
    '''
    id = models.AutoField(primary_key = True)
    uid = models.IntegerField(blank = False)
    meta_name = models.CharField(max_length = 15)
    meta_value = models.TextField()

class Message(models.Model):
    '''
    mtype:
        normal: normal msg.
        ...
    '''
    mid = models.BigAutoField(primary_key = True)
    cid = models.BigIntegerField(blank = False, default = 0)
    uid = models.IntegerField(blank = False, default = 0)
    mtype = models.CharField(max_length = 15, default = 'normal')
    time = models.DateTimeField(auto_now_add = True)
    content = models.TextField(blank = False)

class Chat(models.Model):
    '''
    ctype:
        0: one to one
        1: chat group
    '''
    cid = models.BigAutoField(primary_key = True)
    ctype = models.BooleanField(blank = False, default = 0)
    name = models.CharField(max_length = 20)

class ChatMeta(models.Model):
    '''
    meta_name: 
        member
        ...
    '''
    id = models.BigAutoField(primary_key = True)
    cid = models.BigIntegerField(blank = False)
    meta_name = models.CharField(max_length = 15)
    meta_value = models.TextField()

class OfflineRequest(models.Model):
    id = models.BigAutoField(primary_key = True)
    ruid = models.IntegerField(blank = False, default = 0)
    suid = models.IntegerField(blank = False, default = 0)
    name = models.CharField(max_length = 20)
    req_type = models.IntegerField(blank = False, default = 0)

class OfflineMessage(models.Model):
    id = models.BigAutoField(primary_key = True)
    ruid = models.IntegerField(blank = False, default = 0)
    mid = models.IntegerField(blank = False, default = 0)
    cid = models.IntegerField(blank = False, default = 0)

def test_func():
    '''
    Wait to complete for testing
    '''

def judge_friend(uid1, uid2):
    try:
        UserMeta.objects.get(meta_name = 'friend', uid = uid1, meta_value = str(uid2))
        return True
    except Exception:
        return False

def judge_member(uid, cid):
    try:
        ChatMeta.objects.get(meta_name = 'member', cid = cid, meta_value = str(uid))
        return True
    except Exception:
        return False

def fetch_offline_message(data, by = 'cid'):
    if by == 'cid':
        offline_messages = OfflineMessage.objects.filter(ruid = data.get('uid'), cid = data.get('cid')).values('mid')
        mids = [ msg['mid'] for msg in offline_messages ]
        msgs = [ Message.objects.filter(mid = mid).values('mtype', 'uid', 'time', 'content')[0] for mid in mids ]
        ret = [ {
            'mtype': msg['mtype'],
            'time': msg['content'],
            'from' : find_name_by_uid(msg['uid']).get('name'),
            'content': msg['content']
        } for msg in msgs ]
    else :
        ret = []
    return ret

def fetch_chat_type(cid):
    '''
    Wait to complete for fetching chat type
    '''
    pass

def fetch_group_member_info(data):
    try:
        cid = find_cid_by_name(data.get('group_name')).get('cid')
        uid_list = fetch_chat_member(cid)
        group_member = [ fetch_user_info_by_uid(uid).get('userInfo') for uid in uid_list ]
        print(group_member)
        ret = {
            'state': 200,
            'message': 'Successfully requested.',
            'group_name': data.get('group_name'),
            'group_member': group_member
        }
    except:
        ret = {
            'state': 400,
            'message': 'Fetch failed.'
        }
    return ret

def fetch_chat_member(cid):
    chat_members = ChatMeta.objects.filter(meta_name = 'member', cid = cid).values('meta_value')
    ret = [ int(chat_member['meta_value']) for chat_member in  chat_members ] # invert to integer id.
    return ret

def fetch_chat_message(cid, number = 20, page = -1):
    msgs = Message.objects.filter(cid = cid).values('mtype', 'uid', 'time', 'content')
    message_list = [ { 
        'mtype': msg['mtype'],
        'time': msg['time'],
        'from': find_name_by_uid(msg['uid']).get('name'),
        'content': msg['content'],
        'userInfo': fetch_user_info_by_uid(msg['uid']).get('userInfo')
    } for msg in msgs ]
    if number == -1 or page == -1 :
        return {
            'state': 200,
            'message_list': message_list,
            'bottom': 1
        }
    elif len(msgs) > number * page :
        return {
            'state': 200,
            'message_list': message_list[ -1 * number * page : -1 * number * (page - 1) ],
            'bottom': 0
        }
    else :
        return {
            'state': 200,
            'message_list': message_list[: -1 * number * (page - 1) ],
            'bottom': 1
        }

def fetch_all_message(uid, number = -1):
    try:
        chats_info = ChatMeta.objects.filter(meta_name = 'member', meta_value = str(uid)).values('cid')
        cid_list = [ chat_info['cid'] for chat_info in chats_info ]
        chats = [ Chat.objects.get(cid = cid) for cid in cid_list ]
        print(chats)
        # user can be multiple if delete [0]
        message_list = [{
            'isGroup': int(chat.ctype),
            'userInfo': {
                'username': chat.cid,
                'nickname': chat.name
            } if chat.ctype else [ fetch_user_info_by_uid(member).get('userInfo') for member in fetch_chat_member(chat.cid) if member != uid ][0],
            'user': chat.cid if chat.ctype else [ User.objects.get(uid = member).name for member in fetch_chat_member(chat.cid) if member != uid ][0],
            'userMap': fetch_user_map_by_cid(chat.cid) if chat.ctype else None,
            'message_list': fetch_chat_message(cid = chat.cid).get('message_list'),
            'offline_message_list': fetch_offline_message({
                'uid': uid,
                'cid': chat.cid
            })
        } for chat in chats ]
        ret = {
            'state': 200,
            'message': 'All message required successfully.',
            'message_list': message_list
        }
    except Exception:
        ret = {
            'state': 400,
            'message': 'Failed in fetching all message.'
        }
    print('fetch all message.')
    print(ret)
    return ret

def fetch_all_offline_request(uid):
    try:
        requests = OfflineRequest.objects.filter(ruid = uid)
        request_list = [{
            'isGroup': request.req_type,
            'user': request.name,
            'friend_name': User.objects.get(uid = request.suid).nickname 
        } for request in requests ]
        ret = {
            'state': 200,
            'message': 'All requests required successfully.',
            'request_list': request_list
        }
    except Exception:
        ret = {
            'state': 400,
            'message': 'Failed in fetching all requests.'
        }
    print('fetch all requests.')
    print(ret)
    return ret

def fetch_user_info_by_uid(uid):
    try:
        user = User.objects.get(uid = uid)
        ret = {
            'find': 1,
            'userInfo': {
                'username': user.name,
                'nickname': user.nickname if user.nickname != "" else user.name,
                'email': user.email
            }
        }
    except Exception:
        ret = {
            'find': 0
        }
    return ret

def fetch_user_map_by_cid(cid):
    users = ChatMeta.objects.filter(cid = cid, meta_name = 'member').values('meta_value')
    ret = {}
    for user in users:
        uid = int(user['meta_value'])
        user_info = fetch_user_info_by_uid(uid).get('userInfo')
        ret[user_info.get('username')] = {
            'nickname': user_info.get('nickname'),
            'email': user_info.get('email')
        }
    return ret

def find_uid_by_name(name):
    try:
        user = User.objects.get(name = name)
        ret = {
            'find': 1,
            'uid': user.uid
        }
    except Exception:
        ret = {
            'find': 0
        }
    return ret

def find_name_by_uid(uid):
    try:
        user = User.objects.get(uid = uid)
        ret = {
            'find': 1,
            'name': user.name
        }
    except Exception:
        ret = {
            'find': 0
        }
    return ret

def find_cid_by_user(ruid, username = None, uid = None):
    try:
        if username is None and uid is None :
            ret = {
                'find': 0
            }
            return ret
        elif not uid is None:
            pass
        else :
            uid = find_uid_by_name(username).get('uid')
        cid_list1 = [ chatmeta.cid for chatmeta in ChatMeta.objects.filter(meta_name = 'member', meta_value = str(ruid)) \
                        if Chat.objects.get(cid = chatmeta.cid).ctype == 0 ]
        cid_list2 = [ chatmeta.cid for chatmeta in ChatMeta.objects.filter(meta_name = 'member', meta_value = str(uid)) \
                        if Chat.objects.get(cid = chatmeta.cid).ctype == 0 ]
        cid = [ cid for cid in cid_list1 if cid in cid_list2 ][0]
        ret = {
            'find': 1,
            'cid': cid
        }
    except Exception:
        ret = {
            'find': 0
        }
    return ret

def find_cid_by_name(name):
    try:
        chat = Chat.objects.get(name = name)
        ret = {
            'find': 1,
            'cid': chat.cid
        }
    except Exception:
        ret = {
            'find': 0
        }
    return ret

def find_name_by_cid(cid):
    try:
        chat = Chat.objects.get(cid = cid)
        ret = {
            'find': 1,
            'name': chat.name
        }
    except Exception:
        ret = {
            'find': 0
        }
    return ret