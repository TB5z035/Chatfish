const http = require('http')
const connect = require('connect')
const { createProxyMiddleware } = require('http-proxy-middleware')
const crypto = require('crypto')
const encoder = new TextEncoder('utf8')

const ws_options = {
    target: 'http://localhost:8801',
    ws: true,
    //changeOrigin: true
}

const django_options = {
    target: 'http://localhost:8000',
    //changeOrigin: true
}

const ws_filter = function(pathname, req) {
    return pathname.match('^/ws')
}

const django_filter = function(pathname, req) {
    return !pathname.match('^/ws')
}

const django_proxy = createProxyMiddleware(django_filter, django_options)
const ws_proxy = createProxyMiddleware(ws_filter, ws_options)

const app = connect()
app.use(django_proxy)
app.use(ws_proxy)

const server = http.createServer(app).listen(80)
server.on('upgrade', ws_proxy.upgrade)

const request_server = http.createServer()
request_server.on('request', function(request, response) {
    if (request.method == 'POST') {
        var body = ''

        request.on('data', function(data) {
            body += data
        })

        request.on('end', function() {
            var sha1 = crypto.createHash('sha1')
            var text = encoder.encode(body + ' post from ChatFish Server')
            var key = sha1.update(text).digest('hex')
            response.writeHead(200, {
                'Content-Type': 'application/json'
            })
            if (key == request.headers['data-key']) {
                ret = {
                    'status': 'success'
                }
            }
            else {
                ret = {
                    'status': 'error'
                }
            }
            response.end(JSON.stringify(ret))
            console.log("Receive post request from Django:")
            console.log(body)
        })
    } else {
        response.writeHead(403)
        response.end()
    }
})

request_server.listen(3000)

require('./websocket_server.js').init_server()

const django_request = require('./django_request')
