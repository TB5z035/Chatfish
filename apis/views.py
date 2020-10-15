from django.http import HttpResponse, JsonResponse
# from . import models
from .models import *
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import requests
import hashlib
import json
# Create your views here.

@require_http_methods(["GET"])
def get_data(request):
    data = {
        'type': 'test',
        'data': 'This is a test from django.'
    }
    print('Receive get request from nodejs.')
    return JsonResponse(data, safe = False)

def login_varify(data):
    user = User.objects.filter(name = data['username'])
    if user.count() == 1:
        if user[0].pwd == data['password']:
            ret = {
                'id': user[0].uid,
                'state': 200,
                'meesage': 'Successfully verified!'
            }
        else:
            ret = {
                'state': 401,
                'message': 'Invalid password!'
            }
    else:
        ret = {
            'state': 400,
            'message': 'Invalid username!'
        }
    return ret

def register_in(data):
    '''
    {username: user_name, password: user_password}
    '''
    try:
        new_user = User(name = data['username'], pwd = data['password'])
    except:
        ret = {
            'state': 403,
            'message': 'Invalid register info.'
        }
        return ret

    try:
        new_user.full_clean()
        new_user.save()
        ret = {
            'state': 200,
            'message': 'Successfully registered!'
        }
    except:
        ret = {
            'state': 403,
            'message': 'Reduplicated user name.'
        }
    return ret

def init_chat(data):
    '''
    key:
        ctype
        name
        users
    '''
    try:
        new_chat = Chat(ctype = data.get('ctype'), name = data.get('name'))
        new_chat.full_clean()
        new_chat.save()
        for uid in data.get('users'):
            insert_user_to_chat(uid, new_chat.cid)
        ret = {
            'state': 200,
            'cid': data.get('uid'),
            'users': data.get('users')
        }
    except:
        ret = {
            'state': 403,
            'message': 'Something wrong in chat initialization.'
        }
    return ret


def insert_user_to_chat(data):
    try:
        ret = insert_chat_meta(cid = data.get('cid'), meta_name = 'member', meta_val = data.get('uid'))
    except:
        ret = {
            'state': 403,
            'message': 'Something wrong in insertion to chat.'
        }
    return ret

def insert_user_to_chat(uid, cid):
    insert_chat_meta(cid = cid, meta_name = 'member', meta_val = uid)

def init_message(data):
    try:
        new_msg = Message(cid = data.get('cid'), \
                        uid = data.get('uid'), \
                        mtype = data.get('mtype'), \
                        content = data.get('content'))
        new_msg.full_clean()
        new_msg.save()
        ret = {
            'state': 200,
            'uid': data.get('uid'),
            'cid': data.get('cid'),
            'mid': new_msg.mid
        }
    except:
        ret = {
            'state': 403,
            'message': 'Something wrong in message initialization.'
        }
    return ret


def insert_offline_message(data):
    try:
        new_offl_msg = OfflineMessage(ruid = data.get('ruid'), mid = data.get('mid'))
        new_offl_msg.full_clean()
        new_offl_msg.save()
        ret = {
            'state': 200,
            'uid': data.get('ruid'),
            'id': new_offl_msg.id,
            'mid': data.get('mid')
        }
    except:
        ret = {
            'state': 403,
            'message': 'Something wrong in offline message insertion.'
        }
    return ret

def insert_user_meta(uid, meta_name, meta_val):
    new_meta = UserMeta(uid = uid, meta_name = meta_name, meta_value = meta_val)
    new_meta.full_clean()
    new_meta.save()
    ret = {
        'state': 200,
        'uid': uid,
        'meta_name': meta_name,
        'meta_value': meta_val
    }
    return ret

def insert_chat_meta(cid, meta_name, meta_val):
    new_meta = ChatMeta(cid = cid, meta_name = meta_name, meta_value = meta_val)
    new_meta.full_clean()
    new_meta.save()
    ret = {
        'state': 200,
        'cid': cid,
        'meta_name': meta_name,
        'meta_value': meta_val
    }
    return ret

@require_http_methods(["POST"])
@csrf_exempt
def post_data(request):
    body = request.body.decode()
    sha1 = hashlib.sha1((body + ' post from ChatFish Server').encode('utf-8'))
    ret = {}
    if (sha1.hexdigest() == request.META.get('HTTP_DATA_KEY')):
        ret = {
            'state': 200,
            'message': 'Successfuly post!'
        }
        try:
            data = json.loads(body)
            if 'type' not in data:
                raise Exception("No type info!")
            if data['type'] == 'LOGIN_VERIFY':
                ret = login_varify(data.get('user_info'))
            elif data['type'] == 'REGISTER_IN':
                ret = register_in(data.get('user_info'))
            elif data['type'] == 'REQUIRE_FRIEND_LIST':
                ret = FetchFriend(data.get('uid'))
            elif data['type'] == 'ADD_NEW_FRIEND':
                ret = insert_user_meta(data)
            elif data['type'] == 'CREATE_NEW_GROUP':
                ret = init_chat(data)
            elif data['type'] == 'ADD_NEW_GROUP':
                ret = insert_user_to_chat(data)
            elif data['type'] == 'LEAVE_GROUP':
                ret = {
                    'state': 399,
                    'message': 'Unrealized API.'
                }
            elif data['type'] == 'DELETE_FRIEND':
                ret = {
                    'state': 399,
                    'message': 'Unrealized API.'
                }
            elif data['type'] == 'TEST': # 本地测试接口正确性
                print('successful testing.')
            else:
                '''
                other apis.
                '''
                pass
        except Exception as e:
            ret = {
                'state': 399,
                'message': str(e)
            }
    else:
        ret = {
            'state': 399,
            'message': 'Wrong data key!'
        }
    print('Receive post request from nodejs: ')
    print(body)
    return JsonResponse(ret, safe = False)

def post_to_nodejs(data):
    text_bytes = (json.dumps(data) + ' post from ChatFish Server').encode('utf-8')
    sha1 = hashlib.sha1(text_bytes)
    key = sha1.hexdigest()
    headers = {
        'Content-Type': 'application/json',
        'Data-Key': key
    }
    r = requests.post('http://localhost:3000', json = data, headers = headers)
    ret = r.text
    return JsonResponse(json.loads(ret))

'''
接的时候一定会有uid字段
发给server信息
回头post要带个uid
'''