from django.db import models
from django.forms import ModelForm

# Create your models here.
class User(models.Model):
    uid = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 12, unique = True)
    pwd = models.CharField(max_length = 50)
    email = models.EmailField(blank = True)

class UserMeta(models.Model):
    id = models.AutoField(primary_key = True)
    uid = models.IntegerField(blank = False)
    meta_name = models.CharField(max_length = 15)
    meta_value = models.TextField()

class Message(models.Model):
    mid = models.BigAutoField(primary_key = True)
    cid = models.BigIntegerField(blank = False, default = 0)
    uid = models.IntegerField(blank = False, default = 0)
    mtype = models.CharField(max_length = 15, default = 'normal')
    time = models.DateTimeField(auto_now_add = True)
    content = models.TextField(blank = False)

class Chat(models.Model):
    cid = models.BigAutoField(primary_key = True)
    ctype = models.BooleanField(blank = False, default = 0)
    name = models.CharField(max_length = 20)

class ChatMeta(models.Model):
    id = models.BigAutoField(primary_key = True)
    cid = models.BigIntegerField(blank = False)
    meta_name = models.CharField(max_length = 15)
    meta_value = models.TextField()
