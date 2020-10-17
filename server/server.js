const http = require('http')
const connect = require('connect')
const { createProxyMiddleware } = require('http-proxy-middleware')
const crypto = require('crypto')
const encoder = new TextEncoder('utf8')
const random = require('string-random')

var manager = require('./connection-manager.js').instance()

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

const ws_filter = function(pathname, req) {
    return pathname.match('^/ws')
}

const django_filter = function(pathname, req) {
    return !pathname.match('^/ws') && req.method === 'GET'
}

const login_register_filter = function(pathname, req) {
    return (pathname.match('^/login$') || pathname.match('^/register$')) && req.method === 'POST'
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

var login_request = function(request, response, body) {
    var data = {
        type: 'LOGIN_VERIFY',
        user_info: JSON.parse(body)
    }
    console.log(body)
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
        if (res.state === 200) {
            do {
                res.token = random(32)
            } while(manager.find_by_token(res.token) !== undefined)
            console.log(res)
            manager.add_user(res.id, res.token)
            manager.close_ws(res.id)
            delete res.id
        }
        console.log(res)
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    })
}

var register_request = function(request, response, body) {
    var data = {
        type: 'REGISTER_IN',
        user_info: JSON.parse(body)
    }
    console.log(body)
    request_to_django.post('/api/post_data/', data, function(res) {
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
        console.log(res)
        response.end(JSON.stringify(res))
    }, function(e) {
        console.log('error post_data: ' + e)
    } )
}

var django_request = function(request, response, body) {
    var sha1 = crypto.createHash('sha1')
    var text = encoder.encode(body + ' post from ChatFish Server')
    var key = sha1.update(text).digest('hex')
    response.writeHead(200, {
        'Content-Type': 'application/json'
    })
    if (key == request.headers['data-key']) {
        ret = {
            'status': 'success',
            'message': 'Successfully post!'
        }
        var data = JSON.parse(body)
        var ws = manager.get_ws(data.uid)
        delete data.uid
        if (ws) {
            ws.send(JSON.stringify(data))
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

const request_server = http.createServer()
request_server.on('request', function(request, response) {
    if (request.method == 'POST') {
        var body = ''
    
        request.on('data', function(data) {
            body += data
        })

        request.on('end', function() {
            var pathname = request.url
        
            if (pathname.match('^/login$'))
                login_request(request, response, body)
            else if (pathname.match('^/register$'))
                register_request(request, response, body)
            else
                django_request(request, response, body)
        })
    } else {
        response.writeHead(403)
        response.end()
    }
})

request_server.listen(3000)

require('./websocket_server').init_server()
