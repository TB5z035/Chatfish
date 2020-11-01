from django.db import models
from django.forms import ModelForm

# Create your models here.
class User(models.Model):
    uid = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 12, unique = True)
    pwd = models.CharField(max_length = 50)
    email = models.EmailField(blank = True)

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

class OfflineMessage(models.Model):
    id = models.BigAutoField(primary_key = True)
    ruid = models.IntegerField(blank = False, default = 0)
    mid = models.IntegerField(blank = False, default = 0)

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

def fetch_friends(uid, number = -1): #depreciated api
    try:
        chats = ChatMeta.objects.filter(meta_name = 'member', meta_value = str(uid)).values('cid')
        cid_list = [ chat['cid'] for chat in chats ]
        # user can be multiple if delete [0]
        message_list = [ {
            'user': [ User.objects.get(uid = member).name for member in fetch_chat_member(cid) if member != uid ][0],
            'message_list': fetch_chat_message(cid)
        } for cid in cid_list ]

        ret = {
            'state': 200,
            'message': 'All message required successfully.',
            'message_list': message_list
        }
    except Exception:
        ret = {
            'state': 400,
            'message': 'Failed in fetching friend.'
        }
    print('fetching friend.')
    print(ret)
    return ret

def fetch_offline_message(ruid):
    offline_messages = OfflineMessage.objects.filter(ruid = ruid).values('mid')
    ret = [ offline_message['mid'] for offline_message in offline_messages ]
    return ret

def fetch_chat_type(cid):
    '''
    Wait to complete for fetching chat type
    '''

def fetch_chat_member(cid):
    chat_members = ChatMeta.objects.filter(meta_name = 'member', cid = cid).values('meta_value')
    ret = [ int(chat_member['meta_value']) for chat_member in  chat_members ] # invert to integer id.
    return ret

def fetch_chat_message(cid, number = 20):
    msgs = Message.objects.filter(cid = cid).values('mtype', 'uid', 'time', 'content')
    ret = [ { 'type': msg['mtype'], 'time': msg['time'], 'from': find_name_by_uid(msg['uid']).get('name'), 'content': msg['content'] } for msg in msgs ]
    return ret

def fetch_all_message(uid, number = -1):
    try:
        chats_info = ChatMeta.objects.filter(meta_name = 'member', meta_value = str(uid)).values('cid')
        cid_list = [ chat_info['cid'] for chat_info in chats_info ]
        chats = [ Chat.objects.get(cid = cid) for cid in cid_list ]
        print(chats)
        # user can be multiple if delete [0]
        message_list = [{
            'isGroup': int(chat.ctype),
            'user': chat.name if chat.ctype else [ User.objects.get(uid = member).name for member in fetch_chat_member(chat.cid) if member != uid ][0],
            'message_list': fetch_chat_message(chat.cid)
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