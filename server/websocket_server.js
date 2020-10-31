const django_request = require('./django_request')
const Server = require('ws').Server
const URL = require('url')
const cookie_parse = require('cookie').parse

var manager = require('./connection-manager.js').instance()

var get_token = function(cookie, url) {
    var params = URL.parse(url, true).query
    if (cookie === undefined || cookie === null) {
        return params.token
    }
    var cookies = cookie_parse(cookie)
    var token = 'token' in cookies ? cookies.token : params.token
    return token
}

var get_username = function(cookie, url) {
    var params = URL.parse(url, true).query
    if (cookie === undefined || cookie === null) {
        return params.username
    }
    var cookies = cookie_parse(cookie)
    var username = 'username' in cookies ? cookies.username : params.username
    return username
}

var ClientVerify = function(info) {
    var token = get_token(info.req.headers.cookie, info.req.url)

    var user = manager.find_by_token(token)

    return user !== undefined && user.username === get_username(info.req.headers.cookie, info.req.url)
}

exports.get_token = get_token

exports.init_server = function() {
    var wss = new Server({
        port: 8801,
        verifyClient: ClientVerify
    }, function() {
        console.log('listening')
    }).on('connection', function(ws, req) {
        console.log('connection build!')
        var token = get_token(req.headers.cookie, req.url)
        manager.set_ws(token, ws)
        var id = manager.find_by_token(token).id
        ws.on('message', function(message) {
            try {
                var data = JSON.parse(message)
                console.log('message received:', JSON.stringify(data))
                data['uid'] = id
                django_request.post('/api/post_data/', data, function(res) {
                    console.log('post_data response: %j', res)
                }, function(e) {
                    console.log('error post_data: ' + e)
                })
            }
            catch (e) {
                console.log('error message: ' + e)
            }
        }).on('pong', function() {
            console.log("pong")
            this.isAlive = true
        }).on('close', function() {
            console.log('connection closed...')
            manager.close_ws(id)
        })
    })
    const interval = setInterval(function() {
        wss.clients.forEach(function(ws) {
            if (ws.isAlive === false) return ws.terminate()
            ws.isAlive = false
            ws.ping(function() {})
        })
    }, 30000)
    wss.on('close', function() {
        clearInterval(interval)
    })
    return wss
}
