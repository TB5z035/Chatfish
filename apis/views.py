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
                'state': 200,
                'meesage': 'Successfully varified!'
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
    {id: user_id, password: user_password}
    '''
    new_user = User(name = data['username'], pwd = data['password'])
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
            'message': 'Register failed!'
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
            'status': 'success',
            'message': 'Successfuly post!'
        }
        try:
            data = json.loads(body)
            if 'type' not in data:
                raise Exception("No type info!")
            if data['type'] == 'LOGIN_VARIFY':
                ret = login_varify(data.get('user_info'))
            elif data['type'] == 'REGISTER_IN':
                ret = register_in(data.get('user_info'))
        except Exception as e:
            ret = {
                'status': 'error',
                'message': str(e)
            }
    else:
        ret = {
            'status': 'error',
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
