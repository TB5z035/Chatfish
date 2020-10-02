var ws = require("nodejs-websocket")

var ws_server = ws.createServer(function (conn) {
    conn.on("text", function (message) {
        var data = JSON.parse(message)
        switch(data.type) {
            case "Friend_List":
                pass
            case "NEW_MESSAGE_Update":
                pass
            case "ADD_NEW_FRIEND":
                pass
            case "ADD_NEW_GROUP":
                pass
            case "DELETE_FRIEND":
                pass
            case "LEAVE_GROUP":
                pass
        }
        console.log("text", data)
    })
    conn.on("close", function (code, reason) {
        console.log("close()")
    })
}).listen(8801, function() {
    console.log('listening')
})

const http = require('http')
const connect = require('connect')
const { createProxyMiddleware } = require('http-proxy-middleware')

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

console.log("ok")
