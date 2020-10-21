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
        post_to_nodejs({
            'state': 200,
            'type': 'MESSAGE_NOTIFY',
            'content': data.get('content'),
            'username': data.get('friend_name'),
            'friend_name': data.get('username'),
            'uid': FindUidByName(data.get('friend_name')).get('uid')
        })
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
    try:
        new_meta = UserMeta(uid = uid, meta_name = meta_name, meta_value = meta_val)
        new_meta.full_clean()
        new_meta.save()
        ret = {
            'status': 1,
            'uid': uid,
            'meta_name': meta_name,
            'meta_value': meta_val
        }
    except:
        ret ={
            'status': 0
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

def add_friend(data):
    name_ret = FindUidByName(data.get('friend_name'))
    if name_ret['find'] == 0 :
        ret = {
            'state': 405,
            'message': 'Invalid token or username or friend name!'
        }
    else :
        ret = {
            'state': 200,
            'message': 'Successfully requested!'
        }
        post_to_nodejs({
            'state': 200,
            'type': 'NEW_ADD_FRIEND',
            'content': 'Add friend request sent.',
            'uid': name_ret.get('uid'),
            'username': data.get('friend_name'),
            'friend_name': FindNameByUid(data.get('uid')).get('name')
        })
    return ret

def accept_friend_request(data):
    name_ret = FindUidByName(data.get('friend_name'))
    if name_ret['find'] == 0 :
        ret = {
            'state': 405,
            'message': 'Invalid token or username or friend name!'
        }
    else :
        # set up the chat.
        init_chat(
            {
                'ctype': 0,
                'name': 'private chat',
                'users': [ data.get('uid'), name_ret.get('uid') ]
            }
        )
        s1 = insert_user_meta(data.get('uid'), 'friend', name_ret.get('uid')).get('status')
        s2 = insert_user_meta(name_ret.get('uid'), 'friend', data.get('uid')).get('status')
        if s1 == 1 and s2 == 1 :
            ret = {
                'state': 200,
                'message': 'Successfully requested!'
            }
            post_to_nodejs({
                'state': 200,
                'type': 'AGREE_ADD_FRIEND',
                'content': 'Add friend request agreed.',
                'uid': name_ret.get('uid'),
                'username': data.get('friend_name'),
                'friend_name': FindNameByUid(data.get('uid')).get('name')
            })
        else :
            ret ={
                'state': 405,
                'message': 'Invalid token or username or friend name!'
            }
    print('accept friend request.')
    print(ret)
    return ret

def message_upload(data):
    try:
        ruid = User.objects.filter(name = data.get('friend_name'))[0].uid
        chats = [ meta.cid for meta in ChatMeta.objects.filter(meta_name = 'member', meta_value = str(data.get('uid')))]
        rchats = [ meta.cid for meta in ChatMeta.objects.filter(meta_name = 'member', meta_value = str(ruid))]
        this_cid = [ cid for cid in chats if cid in rchats and Chat.objects.filter(cid = cid)[0].ctype == 0 ][0]
        init_message({
            'cid': this_cid,
            'uid': data.get('uid'),
            'mtype': 'normal',
            'content': data.get('content'),
            'username': data.get('userName'),
            'friend_name': data.get('friend_name')
        })
        ret = {
            'state': 200,
            'message': 'Successfully uploaded.'
        }
    except:
        ret = {
            'state': 400,
            'message': 'Upload failed.'
        }
    return ret

def response_handle(data):
    '''
    response_type: NOTIFY_ADD_NEW_FRIEND, NOTIFY_DELETE_FRIEND, NOTIFY_CREATE_NEW_GROUP, NOTIFY_ADD_NEW_GROUP, NOTIFY_LEAVE_GROUP
    uid
    friend_name
    '''
    ret = {
        'state': 200,
        'message': 'Got the response!'
    }
    return ret

@require_http_methods(["POST"])
@csrf_exempt
def post_data(request):
    body = request.body.decode('utf-8')
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
            elif data['type'] == 'ALL_MESSAGE':
                ret = FetchAllMessage(data)
            elif data['type'] == 'MESSAGE_UPLOAD':
                ret = message_upload(data)
            elif data['type'] == 'REQUIRE_FRIEND_LIST':
                ret = FetchFriends(data.get('uid'))
            elif data['type'] == 'ADD_NEW_FRIEND':
                ret = add_friend(data) # may need improvement
            elif data['type'] == 'AGREE_ADD_NEW_FRIEND':
                ret = accept_friend_request(data) # may need improvement
            elif data['type'] == 'RESPONSE':
                ret = response_handle(data)
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
                ret = {
                    'state': 200,
                    'message': 'successful testing.'
                }
            else:
                '''
                other apis.
                '''
                ret = {
                    'state': 404,
                    'message': 'undefined API.'
                }
        except Exception as e:
            print("Exception happened.")
            print(str(e))
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
        'Content-Type': 'application/json;charset=utf8',
        'Data-Key': key
    }
    r = requests.post('http://localhost:3000', json = data, headers = headers)
    ret = r.text
    return JsonResponse(json.loads(ret))
