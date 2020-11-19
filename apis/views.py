from django.http import HttpResponse, JsonResponse
from .models import *
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token as csrf_get_token
import requests
import hashlib
import json
from config.local_settings import SALT
from .sha import get_key
# Create your views here.

@require_http_methods(["GET"])
def get_data(request):
    data = {
        'type': 'test',
        'data': 'This is a test from django.'
    }
    print('Receive get request from nodejs.')
    return JsonResponse(data, safe = False)

@require_http_methods(["GET"])
def get_token(request):
    data = {
        'token': csrf_get_token(request)
    }
    print('Receive get token request from nodejs.')
    return JsonResponse(data, safe = False)

def login_verify(data):
    try:
        user = User.objects.get(name = data['username'])
        if user.pwd == data['password']:
            ret = {
                'id': user.uid,
                'state': 200,
                'message': 'Successfully verified!'
            }
        else:
            ret = {
                'state': 401,
                'message': 'Invalid password!'
            }
    except Exception:
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
        new_user = User(name = data['username'], pwd = data['password'], email = data['email'], nickname = data['nickname'])
    except Exception:
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
    except Exception:
        ret = {
            'state': 403,
            'message': 'Reduplicated user name.'
        }
    return ret

def modify_user_info(uid, data):
    try:
        user = User.objects.get(uid = uid)
        if data.get('password') != user.pwd:
            return {
                'state': 405,
                'message': 'Wrong password!'
            }
        if 'nickname' in data:
            user.nickname = data.get('nickname')
        if 'email' in data:
            user.email = data.get('email')
        if 'new_password' in data:
            user.pwd = data.get('new_password')
        user.save()
        ret = {
            'state': 200,
            'message': 'Successfully modified.'
        }
    except Exception:
        ret = {
            'state': 405,
            'message': 'Unknown user!'
        }
    return ret

def insert_user_to_chat(uid, cid):
    insert_chat_meta(cid = cid, meta_name = 'member', meta_val = uid)

def init_private_message(data):
    try:
        new_msg = Message(cid = data.get('cid'), \
                        uid = data.get('uid'), \
                        mtype = data.get('mtype'), \
                        content = data.get('content'))
        new_msg.full_clean()
        new_msg.save()

        new_offline_msg = OfflineMessage(fuid = data.get('uid'), \
                                         ruid = find_uid_by_name(data.get('friend_name')).get('uid'), \
                                         mid = new_msg.mid, \
                                         cid = data.get('cid'))
        new_offline_msg.full_clean()
        new_offline_msg.save()

        ret = {
            'state': 200,
            'uid': data.get('uid'),
            'cid': data.get('cid'),
            'mid': new_msg.mid
        }
        post_to_nodejs({
            'state': 200,
            'type': 'MESSAGE_NOTIFY',
            'id': new_msg.mid,
            'content': data.get('content'),
            'mtype': data.get('mtype'),
            'username': data.get('friend_name'),
            'friend_name': data.get('username'),
            'userInfo': fetch_user_info_by_uid(data.get('uid')).get('userInfo'),
            'uid': find_uid_by_name(data.get('friend_name')).get('uid')
        })
    except Exception:
        ret = {
            'state': 403,
            'message': 'Something wrong in private message initialization.'
        }
    return ret

def init_group_message(data):
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
        members = fetch_chat_member(data.get('cid'))
        for member in members:
            if member != data.get('uid') or data.get('mtype') == 'gInit' or data.get('mtype') == 'gWelcome':
                new_offline_msg = OfflineMessage(fuid = data.get('uid'), \
                                                 ruid = member, \
                                                 mid = new_msg.mid, \
                                                 cid = data.get('cid'))
                new_offline_msg.full_clean()
                new_offline_msg.save()

                post_to_nodejs({
                    'state': 200,
                    'type': 'MESSAGE_NOTIFY',
                    'id': new_msg.mid,
                    'is_group': 1,
                    'content': data.get('content'),
                    'mtype': data.get('mtype'),
                    'username': data.get('cid'),
                    'friend_name': data.get('username'),
                    'userInfo': fetch_user_info_by_uid(data.get('uid')).get('userInfo'),
                    'uid': member
                })
    except Exception:
        ret = {
            'state': 403,
            'message': 'Something wrong in group message initialization.'
        }
    return ret

def insert_offline_request(data):
    try:
        pre_req = OfflineRequest.objects.filter(ruid = data.get('ruid'), suid = data.get('suid'), name = data.get('name'), req_type = data.get('req_type'))
        if len(pre_req) > 0 :
            ret = {
                'state': 403,
                'message': 'Request already existed.'
            }
            return ret
        new_offl_req = OfflineRequest(ruid = data.get('ruid'), suid = data.get('suid'), name = data.get('name'), req_type = data.get('req_type'))
        new_offl_req.full_clean()
        new_offl_req.save()
        ret = {
            'state': 200,
            'uid': data.get('ruid'),
            'id': new_offl_req.id
        }
    except Exception:
        ret = {
            'state': 403,
            'message': 'Something wrong in offline message insertion.'
        }
    return ret

def del_offline_request(data):
    try:
        pre_req = OfflineRequest.objects.get(ruid = data.get('ruid'), suid = data.get('suid'), name = data.get('name'), req_type = data.get('req_type'))
        pre_req.delete()
        ret = {
            'state': 200,
            'message': 'Successfully delete a request.'
        }
    except Exception:
        ret = {
            'state': 403,
            'message': 'Something wrong in offline request deletion.'
        }
    return ret

def insert_offline_message(data):
    try:
        new_offl_msg = OfflineMessage(ruid = data.get('ruid'), mid = data.get('mid'), cid = data.get('cid'))
        new_offl_msg.full_clean()
        new_offl_msg.save()
        ret = {
            'state': 200,
            'uid': data.get('ruid'),
            'id': new_offl_msg.id
        }
    except Exception:
        ret = {
            'state': 403,
            'message': 'Something wrong in offline message insertion.'
        }
    return ret

def del_offline_message(data, by = 'cid'):
    try:
        print(data)
        if by == 'cid':
            if data.get('id') == -1:
                off_msgs = OfflineMessage.objects.filter(ruid = data.get('uid'), cid = data.get('cid'))
                for off_msg in off_msgs:
                    post_to_nodejs({
                        'state': 200,
                        'type': 'READSTATE_NOTIFY',
                        'is_group': data.get('is_group'),
                        'username': find_name_by_uid(off_msg.fuid).get('name'),
                        'group_name': data.get('cid'),
                        'friend_name': find_name_by_uid(data.get('uid')).get('name'),
                        'id': off_msg.mid,
                        'userInfo': fetch_user_info_by_uid(off_msg.fuid).get('userInfo'),
                        'uid':off_msg.fuid
                    })
                    off_msg.delete()
            else :
                off_msgs = OfflineMessage.objects.filter(ruid = data.get('uid'), cid = data.get('cid')).values('mid')
                mids = [ off_msg.get('mid') for off_msg in off_msgs ]
                print(mids)
                for mid in mids:
                    if mid > data.get('id'):
                        continue
                    else :
                        off_msg = OfflineMessage.objects.get(ruid = data.get('uid'), mid = mid)
                        post_to_nodejs({
                            'state': 200,
                            'type': 'READSTATE_NOTIFY',
                            'is_group': data.get('is_group'),
                            'username': find_name_by_uid(off_msg.fuid).get('name'),
                            'group_name': data.get('cid'),
                            'friend_name': find_name_by_uid(data.get('uid')).get('name'),
                            'id': off_msg.mid,
                            'userInfo': fetch_user_info_by_uid(off_msg.fuid).get('userInfo'),
                            'uid':off_msg.fuid
                        })
                        off_msg.delete()
            
        elif by == 'uid':
            cid_list1 = ChatMeta.objects.filter(meta_name = 'member', meta_value = str(data.get('uid'))).values('cid')
            cid_list2 = ChatMeta.objects.filter(meta_name = 'member', meta_value = str(data.get('fuid'))).values('cid')
            cid = [ cid.get('cid') for cid in cid_list1 if cid in cid_list2 and Chat.objects.get(cid = cid.get('cid')).ctype == 0 ][0]
            OfflineMessage.objects.filter(ruid = data.get('uid'), cid = cid).delete()
        ret = {
            'state': 200,
            'message': 'Successfully delete offline messages.'
        }
    except Exception:
        ret = {
            'state': 403,
            'message': 'Something wrong in offline message deletion.'
        }
    return ret

def insert_user_meta(uid, meta_name, meta_val):
    try:
        if uid <= 0:
            raise Exception("No such user!")
        new_meta = UserMeta(uid = uid, meta_name = meta_name, meta_value = meta_val)
        new_meta.full_clean()
        new_meta.save()
        ret = {
            'status': 1,
            'uid': uid,
            'meta_name': meta_name,
            'meta_value': meta_val
        }
    except Exception:
        ret = {
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

def init_private_chat(data):
    try:
        new_chat = Chat(ctype = 0, name = data.get('name'))
        new_chat.full_clean()
        new_chat.save()
        insert_user_to_chat(data.get('user1'), new_chat.cid)
        insert_user_to_chat(data.get('user2'), new_chat.cid)
        ret = {
            'state': 200,
            'message': 'Successfully init private chat.',
            'cid': new_chat.cid,
            'user1': data.get('user1'),
            'user2': data.get('user2')
        }
    except Exception:
        print('Something wrong in chat initialization.')
        ret = {
            'state': 403,
            'message': 'Something wrong in private chat initialization.'
        }
    return ret

def init_group_chat(data): # one man group
    try:
        # check if all in the list are the users' friends.
        for friend in data.get('friend_list'):
            if not judge_friend(data.get('user'), find_uid_by_name(friend).get('uid')):
                print('not friend.')
                return {
                    'state': 403,
                    'message': 'Someone not friend.'
                }

        new_chat = Chat(ctype = 1, name = data.get('name'))
        new_chat.full_clean()
        new_chat.save()
        insert_user_to_chat(data.get('user'), new_chat.cid)
        ret = {
            'state': 200,
            'message': 'Successfully init group chat.',
            'userInfo': {
                'username': new_chat.cid,
                'nickname': new_chat.name
            }
        }

        username = find_name_by_uid(data.get('user')).get('name')
        content = username + "发起群聊，并邀请"

        user = User.objects.get(uid = data.get('user'))

        for friend in data.get('friend_list'):
            # add to offline
            uid = find_uid_by_name(friend).get('uid')
            content = content + friend + "，"
            print('content:')
            print(content)

            insert_offline_request({
                'ruid': uid,
                'suid': data.get('user'),
                'name': data.get('name') + '@' + str(new_chat.cid),
                'req_type': 1
            })

            post_to_nodejs({
                'state': 200,
                'type': 'NEW_ADD_GROUP',
                'content': 'Add friend to group request sent.',
                'uid': uid,
                'username': friend,
                'group_name': data.get('name') + '@' + str(new_chat.cid),
                'friend_name': user.nickname + '@' + user.name
            })
            print({
                'state': 200,
                'type': 'NEW_ADD_GROUP',
                'content': 'Add friend to group request sent.',
                'uid': uid,
                'username': friend,
                'group_name': data.get('name') + '@' + str(new_chat.cid),
                'friend_name': user.nickname + '@' + user.name
            })
        print('info above')
        content = content[:-1] + "加入群聊"

        print(
            {
                'is_group': 1,
                'mtype': 'gInit',
                'cid': new_chat.cid,
                'uid': data.get('user'),
                'content': content,
                'userName': username
            }
        )

        message_upload(
            data = {
                'is_group': 1,
                'mtype': 'gInit',
                'friend_name': new_chat.cid,
                'uid': data.get('user'),
                'content': content,
                'userName': username
            }
        )

    except Exception:
        print('Something wrong in group chat initialization.')
        ret = {
            'state': 403,
            'message': 'Something wrong in chat initialization.'
        }
    return ret

def delete_friend(data):
    try:
        fuid = find_uid_by_name(data.get('friend_name')).get('uid')
        cid = find_cid_by_user(ruid = fuid, uid = data.get('uid')).get('cid')
        Chat.objects.get(cid = cid)
        UserMeta.objects.filter(uid = data.get('uid'), meta_name = 'friend', meta_value = str(fuid)).delete()
        UserMeta.objects.filter(uid = fuid, meta_name = 'friend', meta_value = str(data.get('uid'))).delete()
        ChatMeta.objects.filter(cid = cid).delete()
        Chat.objects.filter(cid = cid).delete()
        ret = {
            'state': 200,
            'message': 'Successful requested'
        }
    except Exception:
        ret = {
            'state': 405,
            'message': 'Invalid token or username or friend name'
        }
    return ret

def add_friend(data):
    uid_ret = find_uid_by_name(data.get('friend_name'))
    if uid_ret.get('find') == 0 :
        ret = {
            'state': 405,
            'message': 'Invalid token or username or friend name!'
        }
    elif data.get('uid') == uid_ret.get('uid'):
        ret = {
            'state': 400,
            'message': 'Cannot add yourself as friend!'
        }
    elif judge_friend(data.get('uid'), uid_ret.get('uid')):
        ret = {
            'state': 400,
            'message': 'They are already friends!' 
        }
    else :
        ret = {
            'state': 200,
            'message': 'Successfully requested!'
        }

        # add to offline

        user = User.objects.get(uid = data.get('uid'))

        s = insert_offline_request({
            'ruid': uid_ret.get('uid'),
            'suid': data.get('uid'),
            'name': user.nickname + '@' + user.name,
            'req_type': 0
        })

        if s.get('state') != 200:
            return {
                'state': 400,
                'message': 'You hava requested before!'
            }

        post_to_nodejs({
            'state': 200,
            'type': 'NEW_ADD_FRIEND',
            'content': 'Add friend request sent.',
            'uid': uid_ret.get('uid'),
            'username': data.get('friend_name'),
            'friend_name': user.nickname + '@' + user.name
        })
    return ret

def accept_friend_request(data):
    uid_ret = find_uid_by_name(data.get('friend_name'))
    if uid_ret.get('find') == 0 :
        ret = {
            'state': 405,
            'message': 'Invalid token or username or friend name!'
        }
    else :
        if judge_friend(data.get('uid'), uid_ret.get('uid')):
            ret = {
                'state': 405,
                'message': 'They are already friends!' 
            }
            return ret
        elif data.get('uid') == uid_ret.get('uid'):
            ret = {
                'state': 405,
                'message': 'Cannot add yourself as friend!'
            }
            return ret

        # delete the offline request
        user = User.objects.get(uid = uid_ret.get('uid'))

        s = del_offline_request({
            'ruid': data.get('uid'),
            'suid': uid_ret.get('uid'),
            'name': user.nickname + '@' + user.name,
            'req_type': 0
        })

        if s.get('state') != 200:
            return {
                'state': 405,
                'message': 'No such request!'
            }

        # set up the chat.
        init_private_chat(
            {
                'name': 'private chat',
                'user1': data.get('uid'),
                'user2': uid_ret.get('uid')
            }
        )
        s1 = insert_user_meta(data.get('uid'), 'friend', uid_ret.get('uid')).get('status')
        s2 = insert_user_meta(uid_ret.get('uid'), 'friend', data.get('uid')).get('status')
        if s1 == 1 and s2 == 1 :
            ret = {
                'state': 200,
                'message': 'Successfully requested!',
                'userInfo': fetch_user_info_by_uid(find_uid_by_name(data.get('friend_name')).get('uid')).get('userInfo')
            }
            post_to_nodejs({
                'state': 200,
                'type': 'AGREE_ADD_FRIEND',
                'content': 'Add friend request agreed.',
                'uid': uid_ret.get('uid'),
                'username': data.get('friend_name'),
                'friend_name': find_name_by_uid(data.get('uid')).get('name'),
                'userInfo': fetch_user_info_by_uid(data.get('uid')).get('userInfo')
            })
        else :
            ret = {
                'state': 405,
                'message': 'Invalid token or username or friend name!'
            }
    print('accept friend request.')
    print(ret)
    return ret

def deny_friend_request(data):
    uid_ret = find_uid_by_name(data.get('friend_name'))
    if uid_ret.get('find') == 0 :
        ret = {
            'state': 405,
            'message': 'Invalid token or username or friend name!'
        }
    else :
        if judge_friend(data.get('uid'), uid_ret.get('uid')):
            ret = {
                'state': 405,
                'message': 'They are already friends!' 
            }
            return ret
        elif data.get('uid') == uid_ret.get('uid'):
            ret = {
                'state': 405,
                'message': 'Cannot deny yourself as friend!'
            }
            return ret
        
        # delete the offline request.
        user = User.objects.get(uid = uid_ret.get('uid'))

        s = del_offline_request({
            'ruid': data.get('uid'),
            'suid': uid_ret.get('uid'),
            'name': user.nickname + '@' + user.name,
            'req_type': 0
        })

        if s.get('state') == 200 :
            ret = {
                'state': 200,
                'message': 'Successfully requested!'
            }

            post_to_nodejs({
                'state': 200,
                'type': 'DISAGREE_ADD_FRIEND',
                'content': 'Add friend request denied.',
                'uid': uid_ret.get('uid'),
                'username': data.get('friend_name'),
                'friend_name': find_name_by_uid(data.get('uid')).get('name')
            })
        else :
            ret = {
                'state': 405,
                'message': 'Invalid token or username or friend name!'
            }
    print('deny friend request.')
    print(ret)
    return ret

def leave_group(data):
    try:
        cid = data.get('group_name')
        ChatMeta.objects.get(cid = cid, meta_name = 'member', meta_value = str(data.get('uid'))).delete()
        ret = {
            'state': 200,
            'message': 'Successful requested'
        }
    except Exception:
        ret = {
            'state': 405,
            'message': 'Failed'
        }
    return ret

def add_users_to_chat(data, cid):
    if 'friend_list' not in data:
        ret = {
            'state': 405,
            'message': 'No friend list available!'
        }
        return ret
    
    user = User.objects.get(uid = data.get('uid'))
    chat = Chat.objects.get(cid = cid)
    for friend in data.get('friend_list'):
        uid_ret = find_uid_by_name(friend)
        if uid_ret.get('find') == 0:
            continue
        elif not judge_friend(data.get('uid'), uid_ret.get('uid')): # check friends' relation.
            continue
        elif judge_member(uid_ret.get('uid'), cid):
            continue
        else :

            # add offline request

            insert_offline_request({
                'ruid': uid_ret.get('uid'),
                'suid': data.get('uid'),
                'name': chat.name + '@' + str(cid),
                'req_type': 1
            })

            post_to_nodejs({
                'state': 200,
                'type': 'NEW_ADD_GROUP',
                'content': 'Add friend to group request sent.',
                'uid': uid_ret.get('uid'),
                'username': friend,
                'group_name': chat.name + '@' + str(cid),
                'friend_name': user.nickname + '@' + user.name
            })

    ret = {
        'state': 200,
        'message': 'Successfully requested!'
    }
    return ret

def accept_add_to_chat_request(data):
    try:
        cid = data.get('group_name')
        chat = Chat.objects.get(cid = cid)
    except Exception:
        return {
            'state': 405,
            'message': 'No group with this name!'
        }
    if judge_member(data.get('uid'), cid) :
        # judge if in the group.
        ret = {
            'state': 405,
            'message': 'Already in this group!'
        }
    else :
        ret = {
            'state': 200,
            'message': 'Successfully requested!',
            'userInfo': {
                'username': cid,
                'nickname': chat.name
            }
        }

        # delete the offline request.

        print({
            'ruid': data.get('uid'),
            'suid': find_uid_by_name(data.get('friend_name')).get('uid'),
            'name': chat.name + '@' + str(cid),
            'req_type': 1
        })

        s = del_offline_request({
            'ruid': data.get('uid'),
            'suid': find_uid_by_name(data.get('friend_name')).get('uid'),
            'name': chat.name + '@' + str(cid),
            'req_type': 1
        })

        print(s)

        if s.get('state') != 200:
            return {
                'state': 405,
                'message': 'No such request!'
            }

        insert_user_to_chat(data.get('uid'), cid)
        
        print({
                'is_group': 1,
                'mtype': 'gWelcome',
                'cid': cid,
                'uid': data.get('uid'),
                'content': data.get('friend_name') + "邀请" + find_name_by_uid(data.get('uid')).get('name') + "加入群聊",
                'userName': find_name_by_uid(data.get('uid')).get('name')
            })

        message_upload(
            data = {
                'is_group': 1,
                'mtype': 'gWelcome',
                'friend_name': cid,
                'uid': data.get('uid'),
                'content': data.get('friend_name') + "邀请" + find_name_by_uid(data.get('uid')).get('name') + "加入群聊",
                'userName': find_name_by_uid(data.get('uid')).get('name')
            }
        )
        
        # post_to_nodejs({
        #     'state': 200,
        #     'type': 'AGREE_ADD_GROUP',
        #     'content': 'Add GROUP request agreed.',
        #     'uid': find_uid_by_name(data.get('friend_name')).get('uid'),
        #     'username': data.get('friend_name'),
        #     'friend_name': data.get('username')
        # })
    return ret

def deny_add_to_chat_request(data):
    try:
        cid = data.get('group_name')
        chat = Chat.objects.get(cid = cid)
    except Exception:
        return {
            'state': 405,
            'message': 'No group with this name!'
        }
    if judge_member(data.get('uid'), cid) :
        # judge if in the group.
        ret = {
            'state': 405,
            'message': 'Already in this group!'
        }
    else :
        ret = {
            'state': 200,
            'message': 'Successfully requested!'
        }

        # delete the offline request.

        print({
            'ruid': data.get('uid'),
            'suid': find_uid_by_name(data.get('friend_name')).get('uid'),
            'name': chat.name + '@' + str(cid),
            'req_type': 1
        })

        s = del_offline_request({
            'ruid': data.get('uid'),
            'suid': find_uid_by_name(data.get('friend_name')).get('uid'),
            'name': chat.name + '@' + str(cid),
            'req_type': 1
        })

        print(s)

        if s.get('state') != 200:
            return {
                'state': 405,
                'message': 'No such request!'
            }

        # post_to_nodejs({
        #     'state': 200,
        #     'type': 'AGREE_ADD_GROUP',
        #     'content': 'Add GROUP request agreed.',
        #     'uid': find_uid_by_name(data.get('friend_name')).get('uid'),
        #     'username': data.get('friend_name'),
        #     'friend_name': data.get('username')
        # })
    return ret

def message_upload(data):
    try:
        if 'is_group' in data and data.get('is_group') == 1:
            '''
            For group message
            '''
            mid = init_group_message({
                'cid': data.get('friend_name'),
                'uid': data.get('uid'),
                'mtype': data.get('mtype') if 'mtype' in data else 'normal',
                'content': data.get('content'),
                'username': data.get('userName')
            }).get('mid')
        else:
            '''
            For private message
            '''
            ruid = User.objects.get(name = data.get('friend_name')).uid
            chats = [ meta['cid'] for meta in ChatMeta.objects.filter(meta_name = 'member', meta_value = str(data.get('uid'))).values('cid')]
            rchats = [ meta['cid'] for meta in ChatMeta.objects.filter(meta_name = 'member', meta_value = str(ruid)).values('cid')]
            this_cid = [ cid for cid in chats if cid in rchats and Chat.objects.get(cid = cid).ctype == 0 ][0]
            mid = init_private_message({
                'cid': this_cid,
                'uid': data.get('uid'),
                'mtype': data.get('mtype') if 'mtype' in data else 'normal',
                'content': data.get('content'),
                'username': data.get('userName'),
                'friend_name': data.get('friend_name')
            }).get('mid')
        ret = {
            'state': 200,
            'message': 'Successfully uploaded.',
            'id': mid
        }
    except Exception:
        ret = {
            'state': 400,
            'message': 'Upload failed.'
        }
    return ret

def recall_message(data):
    try:
        if 'is_group' in data and data.get('is_group') == 1:
            cid = data.get('group_name')
        else :
            cid = find_cid_by_user(ruid = data.get('uid'), username = data.get('friend_name')).get('cid')

        message = Message.objects.get(mid = data.get('id'))
        message.content = ''
        message.save()

        new_hidden_msg = HiddenMessage(mid = data.get('id'), cid = cid)
        new_hidden_msg.full_clean()
        new_hidden_msg.save()

        # add recall notify
        if 'is_group' in data and data.get('is_group') == 1:
            members = fetch_chat_member(cid =cid)
            for member in members:
                post_to_nodejs({
                    'state': 200,
                    'type': 'RECALL_NOTIFY',
                    'is_group': 1,
                    'id': data.get('id'),
                    'username': find_name_by_uid(member).get('name'),
                    'friend_name': data.get('username'),
                    'group_name': cid,
                    'userInfo': fetch_user_info_by_uid(data.get('uid')).get('userInfo'),
                    'uid': member
                })
        else :
            post_to_nodejs({
                'state': 200,
                'type': 'RECALL_NOTIFY',
                'is_group': 0,
                'id': data.get('id'),
                'username': data.get('friend_name'),
                'friend_name': data.get('username'),
                'userInfo': fetch_user_info_by_uid(data.get('uid')).get('userInfo'),
                'uid': find_uid_by_name(data.get('friend_name')).get('uid')
            })

        ret = {
            'state': 200,
            'message': 'Successfully recalled.'
        }
    except Exception as e:
        ret = {
            'state': 405,
            'message': 'Something wrong during recalling: ' + str(e)
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
def post_data(request):
    body = request.body.decode('utf-8')
    ret = {}
    print('Receive post request from nodejs: ')
    print(body)
    if (get_key(body) == request.META.get('HTTP_DATA_KEY')):
        ret = {
            'state': 200,
            'message': 'Successfuly post!'
        }
        try:
            print('Try to json.loads...')
            data = json.loads(body)
            print('Json loading completed.')
            print(data)
            print('Json print ended.')
            if 'type' not in data:
                raise Exception("No type info!")
            if data['type'] == 'LOGIN_VERIFY':
                ret = login_verify(data.get('user_info'))
            elif data['type'] == 'REGISTER_IN':
                ret = register_in(data.get('user_info'))
            elif data['type'] == 'MODIFY_USER_INFO':
                ret = modify_user_info(uid = data.get('uid'), data = data)
            elif data['type'] == 'ALL_MESSAGE':
                ret = fetch_all_message(data.get('uid'))
            elif data['type'] == 'MESSAGE_UPLOAD':
                if 'uid' not in data:
                    data['uid'] = find_uid_by_name(data.get('userName')).get('uid')
                ret = message_upload(data)
            elif data['type'] == 'REQUIRE_FRIEND_LIST':
                message_list_ret = fetch_all_message(data.get('uid'))
                request_list_ret = fetch_all_offline_request(data.get('uid'))
                if message_list_ret.get('state') == 200 and request_list_ret.get('state') == 200 :
                    ret = {
                        'state': 200,
                        'message': 'Successfully fetched.',
                        'userInfo': fetch_user_info_by_uid(data.get('uid')).get('userInfo'),
                        'message_list': message_list_ret.get('message_list'),
                        'request_list': request_list_ret.get('request_list')
                    }
                else :
                    ret = {
                        'state': 400,
                        'message': 'fetch failed.'
                    }
            elif data['type'] == 'FETCH_GROUP_MEMBER':
                ret = fetch_group_member_info(data)
                print(ret)
            elif data['type'] == 'DELETE_FRIEND':
                ret = delete_friend(data)
            elif data['type'] == 'ADD_NEW_FRIEND':
                ret = add_friend(data)
            elif data['type'] == 'AGREE_ADD_NEW_FRIEND':
                ret = accept_friend_request(data)
            elif data['type'] == 'DISAGREE_ADD_NEW_FRIEND':
                ret = deny_friend_request(data)
            elif data['type'] == 'LEAVE_GROUP':
                ret = leave_group(data)
            elif data['type'] == 'ADD_GROUP':
                if data.get('is_init') == 0:
                    # init a chat
                    ret = init_group_chat({
                        'name': data.get('group_name'),
                        'user': data.get('uid'),
                        'friend_list': data.get('friend_list')
                    })
                elif data.get('is_init') == 1:
                    # add user to chat
                    cid = data.get('group_name')
                    ret = add_users_to_chat(data, cid)
                else :
                    ret = {
                        'state': 403,
                        'message': 'Invalid request for add group.'
                    }
            elif data['type'] == 'AGREE_ADD_GROUP':
                ret = accept_add_to_chat_request(data)
            elif data['type'] == 'DISAGREE_ADD_GROUP':
                ret = deny_add_to_chat_request(data)
            elif data['type'] == 'CHAT_ENTER':
                if 'is_group' in data and data.get('is_group') == 1:
                    ret = del_offline_message(
                        data = {
                            'is_group': 1,
                            'uid': data.get('uid'),
                            'cid': data.get('group_name'),
                            'id': data.get('id') if 'id' in data else -1
                        }
                    )
                else :
                    ret = del_offline_message(
                        data = {
                            'is_group': 0,
                            'uid': data.get('uid'),
                            'cid': find_cid_by_user(ruid = data.get('uid'), username = data.get('friend_name')).get('cid'),
                            'id': data.get('id') if 'id' in data else -1
                        }
                    )
                print(ret)
            elif data['type'] == 'CHAT_FETCH':
                if 'is_group' in data and data.get('is_group') == 1:
                    if 'page' in data:
                        ret = fetch_chat_message(cid = data.get('group_name'), page = data.get('page'))
                    else :
                        ret = fetch_chat_message(cid = data.get('group_name'), page = -1)
                else :
                    if 'page' in data:
                        ret = fetch_chat_message(cid = find_cid_by_user(ruid = data.get('uid'), username = data.get('friend_name')).get('cid'), page = data.get('page'))
                    else :
                        ret = fetch_chat_message(cid = find_cid_by_user(ruid = data.get('uid'), username = data.get('friend_name')).get('cid'), page = -1)
            elif data['type'] == 'RECALL':
                ret = recall_message(data)
            elif data['type'] == 'RESPONSE':
                ret = response_handle(data)
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
    return JsonResponse(ret, safe = False)

def post_to_nodejs(data):
    key = get_key(json.dumps(data))
    headers = {
        'Content-Type': 'application/json;charset=utf8',
        'Data-Key': key
    }
    try:
        r = requests.post('http://localhost:3000', json = data, headers = headers)
        ret = r.text
        return JsonResponse(json.loads(ret))
    except Exception as e:
        return {
            'state': 404,
            'message': str(e)
        }
