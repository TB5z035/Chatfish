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

def Test():
    pass

def JudgeFriend(uid1, uid2):
    try:
        friend = UserMeta.objects.get(meta_name = 'friend', uid = uid1, meta_value = str(uid2))
        return True
    except:
        return False

def JudgeMember(uid, cid):
    try:
        member = ChatMeta.objects.get(meta_name = 'member', cid = cid, meta_value = str(uid))
        return True
    except:
        return False

def FetchFriends(uid, number = -1): #depreciated api
    try:
        chats = ChatMeta.objects.filter(meta_name = 'member', meta_value = str(uid)).values('cid')
        cid_list = [ chat['cid'] for chat in chats ]
        # user can be multiple if delete [0]
        message_list = [ {
            'user': [ User.objects.get(uid = member).name for member in FetchChatMember(cid) if member != uid ][0],
            'message_list': FetchChatMessage(cid)
        } for cid in cid_list ]

        ret = {
            'state': 200,
            'message': 'All message required successfully.',
            'message_list': message_list
        }
    except:
        ret = {
            'state': 400,
            'message': 'Failed in fetching friend.'
        }
    print('fetching friend.')
    print(ret)
    return ret

def FetchOfflineMessage(ruid):
    Off_lineMsgs = OfflineMessage.objects.filter(ruid = ruid).values('mid')
    ret = [ Offline_Msg['mid'] for Offline_Msg in Offline_Msgs ]
    return ret

def FetchChatType(cid):
    pass

def FetchChatMember(cid):
    ChatMembers = ChatMeta.objects.filter(meta_name = 'member', cid = cid).values('meta_value')
    ret = [ int(ChatMember['meta_value']) for ChatMember in  ChatMembers ] # invert to integer id.
    return ret

def FetchChatMessage(cid, number = 20):
    msgs = Message.objects.filter(cid = cid).values('mtype', 'uid', 'time', 'content')
    ret = [ { 'type': msg['mtype'], 'time': msg['time'], 'from': FindNameByUid(msg['uid']).get('name'), 'content': msg['content'] } for msg in msgs ]
    return ret

def FetchAllMessage(uid, number = -1):
    try:
        chats_info = ChatMeta.objects.filter(meta_name = 'member', meta_value = str(uid)).values('cid')
        cid_list = [ chat_info['cid'] for chat_info in chats_info ]
        chats = [ Chat.objects.get(cid = cid) for cid in cid_list ]
        print(chats)
        # user can be multiple if delete [0]
        message_list = [{
            'isGroup': int(chat.ctype),
            'user': chat.name if chat.ctype else [ User.objects.get(uid = member).name for member in FetchChatMember(chat.cid) if member != uid ][0],
            'message_list': FetchChatMessage(chat.cid)
        } for chat in chats ]
        ret = {
            'state': 200,
            'message': 'All message required successfully.',
            'message_list': message_list
        }
    except:
        ret = {
            'state': 400,
            'message': 'Failed in fetching all message.'
        }
    print('fetch all message.')
    print(ret)
    return ret

def FindUidByName(name):
    try:
        user = User.objects.get(name = name)
        ret = {
            'find': 1,
            'uid': user.uid
        }
    except:
        ret = {
            'find': 0
        }
    return ret

def FindNameByUid(uid):
    try:
        user = User.objects.get(uid = uid)
        ret = {
            'find': 1,
            'name': user.name
        }
    except:
        ret = {
            'find': 0
        }
    return ret

def FindCidByName(name):
    try:
        chat = Chat.objects.get(name = name)
        ret = {
            'find': 1,
            'cid': chat.cid
        }
    except:
        ret = {
            'find': 0
        }
    return ret

def FindNameByCid(cid):
    try:
        chat = Chat.objects.get(cid = cid)
        ret = {
            'find': 1,
            'name': chat.name
        }
    except:
        ret = {
            'find': 0
        }
    return ret