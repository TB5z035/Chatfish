var ws = require("nodejs-websocket")

var server = ws.createServer(function (conn) {
    conn.on("text", function (message) {
        var data = JSON.parse(message)
        console.log("text", data)
    })
    conn.on("close", function (code, reason) {
        console.log("close()")
    })
}).listen(process.env.EXPOSE_PORT, function() {
    console.log('listening')
})
