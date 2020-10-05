const ws = require('nodejs-websocket')
const django_request = require('./django_request')

exports.init_server = function() {
    return ws.createServer(function(conn) {
        conn.on("text", function(message) {
            try {
                var data = JSON.parse(message)
                console.log("text received:", JSON.stringify(data))
                django_request.post('/api/post_data/', data, function(res) {
                    console.log('post_data response: %j', res)
                }, function(e) {
                    console.log('error post_data: ' + e)
                })
            }
            catch (e) {
                console.log('error message: ' + e)
            }
        })
    }).listen(8801, function() {
        console.log('listening')
    })    
}
