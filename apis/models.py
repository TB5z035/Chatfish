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

def FetchFriend(uid, number = -1):
    if number == -1:
        friends = UserMeta.objects.filter(meta_name = 'friend', uid = uid)
    ret = [ int(friend.meta_value) for friend in friends ] # invert to integer id.
    return ret

def FetchOfflineMessage(ruid):
    OfflineMsgs = OfflineMessage.objects.filter(ruid = ruid)
    ret = [ Offline_Msg.mid for Offline_Msg in Offline_Msgs ]
    return ret

def FetchChatMember(cid):
    ChatMembers = ChatMeta.objects.filter(meta_name = 'member', cid = cid)
    ret = [ int(ChatMember.meta_value) for ChatMember in  ChatMembers ] # invert to integer id.
    return ret

def FetchChatMessage(cid, number = 20):
    msgs = Message.objects.filter(cid = cid)
    ret = [ msg.mid for msg in msgs ]
    return ret
