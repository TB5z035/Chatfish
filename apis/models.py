from django.db import models
from django.forms import ModelForm

# Create your models here.
class User(models.Model):
    uid = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 20)
    pwd = models.CharField(max_length = 50)
    friends = models.TextField(blank = True)

class Message(models.Model):
    mid = models.AutoField(primary_key = True)
    user = models.TextField()
    time = models.DateTimeField(auto_now_add = True)
    content = models.TextField()
    chat_id = models.IntegerField()

class Chat(models.Model):
    cid = models.AutoField(primary_key = True)
    kind = models.BooleanField()
    name = models.CharField(max_length = 20)
    users = models.TextField()
    messages = models.TextField()

def Init_user(name, pwd):
    New_user = User(name = name, pwd = pwd)
    New_user.full_clean()
    New_user.save()

def Insert_msg_to_chat(chat_id, msg_id):
    pass

def Init_msg(user, content, chat_id):
    New_msg = Message(user = user, content = content, chat_id = chat_id)
    New_msg.full_clean()
    New_msg.save()
    Insert_msg_to_chat(chat_id, New_msg.mid)

def Init_chat(users):
    pass