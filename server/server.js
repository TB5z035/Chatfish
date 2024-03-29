const http = require('http')
const URL = require('url')
const connect = require('connect')
const { createProxyMiddleware } = require('http-proxy-middleware')
const jsSHA = require('jssha')
const random = require('string-random')

const ws_server = require('./websocket_server')
var manager = require('./connection-manager.js').instance()

manager.clear()

const ws_options = {
    target: 'http://localhost:8801',
    ws: true,
    //changeOrigin: true
}

const django_options = {
    target: 'http://localhost:8000',
    //changeOrigin: true
}

const login_register_options = {
    target: 'http://localhost:3000',
    //changeOrigin: true
}

const ws_filter = function(pathname) {
    return pathname.match('^/ws')
}

const django_filter = function(pathname, req) {
    return !pathname.match('^/ws') && req.method === 'GET'
}

const login_register_filter = function(pathname, req) {
    var params = URL.parse(req.url, true).query
    return 'action' in params && req.method === 'POST'
}

const django_proxy = createProxyMiddleware(django_filter, django_options)
const ws_proxy = createProxyMiddleware(ws_filter, ws_options)
const login_register_proxy = createProxyMiddleware(login_register_filter, login_register_options)

const app = connect()
app.use(django_proxy)
app.use(ws_proxy)
app.use(login_register_proxy)

const server = http.createServer(app).listen(80)
server.on('upgrade', ws_proxy.upgrade)

const request_to_django = require('./django_request')

var try_json = function(data) {
    try {
        var ret = JSON.parse(data)
        return ret
    }
    catch (e) {
        console.log('error json: ' + e)
        return {}
    }
}

var login_request = function(request, response, body) {
    var json_data = try_json(body)
    var data = {
        type: 'LOGIN_VERIFY',
        user_info: json_data
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        if (res.state === 200) {
            do {
                res.token = random(32)
            }
            while (manager.find_by_token(res.token) !== undefined)
            console.log(res)
            if (manager.find(res.id) !== undefined)
                manager.close(res.id)
            manager.add_user(res.id, res.token, json_data.username)
            // manager.close(res.id)
            delete res.id
        }
        console.log(res)
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var register_request = function(request, response, body) {
    var json_data = try_json(body)
    var data = {
        type: 'REGISTER_IN',
        user_info: json_data
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        console.log(res)
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var modify_user_info_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'MODIFY_USER_INFO',
        uid: user.id,
        password: json_data.password
    }
    if ('nickname' in json_data)
        data.nickname = json_data.nickname
    if ('email' in json_data)
        data.email = json_data.email
    if ('new_password' in json_data)
        data.new_password = json_data.new_password
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var require_friend_list_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'REQUIRE_FRIEND_LIST',
        uid: user.id
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var fetch_group_member_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'FETCH_GROUP_MEMBER',
        uid: user.id,
        username: json_data.username,
        group_name: json_data.group_name
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var chat_enter_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    console.log(json_data)
    if ( json_data.hasOwnProperty('is_group') && json_data.is_group == 1 ) {
        if (json_data.hasOwnProperty('id')) {
            var data = {
                type: 'CHAT_ENTER',
                uid: user.id,
                is_group: 1,
                id: json_data.id,
                group_name: json_data.group_name
            }
        }
        else {
            var data = {
                type: 'CHAT_ENTER',
                uid: user.id,
                is_group: 1,
                group_name: json_data.group_name
            }
        }
    }
    else {
        if (json_data.hasOwnProperty('id')) {
            var data = {
                type: 'CHAT_ENTER',
                uid: user.id,
                id: json_data.id,
                friend_name: json_data.friend_name
            }
        }
        else {
            var data = {
                type: 'CHAT_ENTER',
                uid: user.id,
                friend_name: json_data.friend_name
            }
        }
    }

    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var chat_fetch_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    if ( json_data.hasOwnProperty('is_group') && json_data.is_group == 1 ) {
        var data = {
            type: 'CHAT_FETCH',
            uid: user.id,
            is_group: 1,
            group_name: json_data.group_name,
            page: json_data.page
        }
    }
    else {
        var data = {
            type: 'CHAT_FETCH',
            uid: user.id,
            friend_name: json_data.friend_name,
            page: json_data.page
        }
    }

    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var delete_friend_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'DELETE_FRIEND',
        uid: user.id,
        username: json_data.username,
        friend_name: json_data.friend_name
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var add_friend_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'ADD_NEW_FRIEND',
        uid: user.id,
        friend_name: json_data.friend_name
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var agree_add_friend_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'AGREE_ADD_NEW_FRIEND',
        uid: user.id,
        friend_name: json_data.friend_name
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var disagree_add_friend_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'DISAGREE_ADD_NEW_FRIEND',
        uid: user.id,
        friend_name: json_data.friend_name
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var leave_group_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }

    console.log('Receive add group request!')
    console.log(json_data)
    
    var data = {
        type: 'LEAVE_GROUP',
        uid: user.id,
        username: json_data.username,
        group_name: json_data.group_name
    }
    
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var add_group_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }

    console.log('Receive add group request!')
    console.log(json_data)
    
    var data = {
        type: 'ADD_GROUP',
        uid: user.id,
        is_init: json_data.type,
        friend_list: json_data.friend_list,
        group_name: json_data.group_name
    }
    
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var agree_add_group_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'AGREE_ADD_GROUP',
        uid: user.id,
        group_name: json_data.group_name,
        friend_name: json_data.friend_name
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var disagree_add_group_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'DISAGREE_ADD_GROUP',
        uid: user.id,
        group_name: json_data.group_name,
        friend_name: json_data.friend_name
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var message_upload_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.userName) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'MESSAGE_UPLOAD',
        mtype: json_data.mtype,
        is_group: json_data.is_group,
        userName: json_data.userName,
        friend_name: json_data.friend_name,
        content: json_data.content
    }

    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var recall_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    if ( json_data.hasOwnProperty('is_group') && json_data.is_group === 1 ) {
        var data = {
            type: 'RECALL',
            is_group: 1,
            uid: user.id,
            id: json_data.id,
            group_name: json_data.group_name,
            username: json_data.username
        }
    }
    else {
        var data = {
            type: 'RECALL',
            is_group: 0,
            uid: user.id,
            id: json_data.id,
            friend_name: json_data.friend_name,
            username: json_data.username
        }
    }

    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var response_request = function(request, response, body) {
    var json_data = try_json(body)
    var user = manager.find_by_token(ws_server.get_token(request.headers.cookie, request.url))
    if (user === undefined || user === null || user.username !== json_data.username) {
        response.writeHead(403)
        response.end()
        return
    }
    var data = {
        type: 'RESPONSE',
        response_type: json_data.type,
        uid: user.id,
        friend_name: json_data.friend_name
    }
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json;charset=utf8',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var django_request = function(request, response, body) {
    const shaObj = new jsSHA("SHA3-512", "TEXT", { encoding: "UTF8" })
    shaObj.update(body + ' post from ChatFish Server')
    var key = shaObj.getHash("HEX")
    response.writeHead(200, {
        'Content-Type': 'application/json;charset=utf8'
    })
    var ret = {}
    if (key == request.headers['data-key']) {
        var data = JSON.parse(body)
        var ws = manager.get_ws(data.uid)
        delete data.uid
        if (ws) {
            ws.send(JSON.stringify(data))
            ret = {
                'status': 'success',
                'message': 'Successfully post!'
            }
        }
        else {
            ret = {
                'status': 'failed',
                'message': 'No connection available!'
            }
        }
    }
    else {
        ret = {
            'status': 'error',
            'message': 'Data key is wrong!'
        }
    }
    response.end(JSON.stringify(ret))
    console.log("Receive post request from Django:")
    console.log(body)
}

var handle_post_request = function(request, response) {
    var body = ""
    request.on('data', function(data) {
        body += data
    })

    request.on('end', function() {
        var pathname = request.url

        var params = URL.parse(pathname, true).query

        if ('action' in params) {
            if (params.action === 'login')
                login_request(request, response, body)
            else if (params.action === 'register')
                register_request(request, response, body)
            else if (params.action === 'modify_user_info')
                modify_user_info_request(request, response, body)
            else if (params.action === 'require_friend_list')
                require_friend_list_request(request, response, body)
            else if (params.action === 'fetch_group_member')
                fetch_group_member_request(request, response, body)
            else if (params.action === 'chat_enter')
                chat_enter_request(request, response, body)
            else if (params.action === 'chat_fetch')
                chat_fetch_request(request, response, body)
            else if (params.action === 'delete_friend')
                delete_friend_request(request, response, body)
            else if (params.action === 'add_friend')
                add_friend_request(request, response, body)
            else if (params.action === 'agree_add_friend')
                agree_add_friend_request(request, response, body)
            else if (params.action === 'disagree_add_friend')
                disagree_add_friend_request(request, response, body)
            else if (params.action === 'leave_group')
                leave_group_request(request, response, body)
            else if (params.action === 'add_group')
                add_group_request(request, response, body)
            else if (params.action === 'agree_add_group')
                agree_add_group_request(request, response, body)
            else if (params.action === 'disagree_add_group')
                disagree_add_group_request(request, response, body)
            else if (params.action === 'message_upload')
                message_upload_request(request, response, body)
            else if (params.action === 'recall')
                recall_request(request, response, body)
            else if (params.action === 'response')
                response_request(request, response, body)
        }
        else
            django_request(request, response, body)
    })
}

const request_server = http.createServer()
request_server.on('request', function(request, response) {
    if (request.method == 'POST') {
        if (global.csrf_token === undefined) {
            request_to_django.get('/api/get_token/').then(function(data) {
                global.csrf_token = data.token
                handle_post_request(request, response)
            })
        } else {
            handle_post_request(request, response)
        }
    } else {
        response.writeHead(403)
        response.end()
    }
})

request_server.listen(3000)

ws_server.init_server()
