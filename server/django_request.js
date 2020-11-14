const http = require('http')
const crypto = require('crypto')
const encoder = new TextEncoder('utf8')

var default_protocol = "http://"
var default_host = "localhost"
var default_port = "8000"

exports.get = function get(path) {
    return new Promise(function(resolve, reject) {
        var url = default_protocol + default_host + ':' + default_port + path
        http.get(url, function(res) {
            res.setEncoding('utf-8')
            var body = ""
            res.on('data', function(data) {
                body += data
            })
            res.on("end", function() {
                try {
                    data = JSON.parse(body)
                    resolve(data)
                }
                catch (e) {
                    console.log('error message: ' + e)
                    reject(e)
                }
            })
            res.resume()
        }).on('error', function(e) {
            reject(e)
        }).end()
    })
}

exports.post = function post(path, data, on_data_callback, on_err_callback) {
    var sha512 = crypto.createHash('sha512')
    var text = encoder.encode(JSON.stringify(data) + ' post from ChatFish Server')
    var key = sha512.update(text).digest('hex')

    var content = JSON.stringify(data)
    var options = {
        hostname: default_host,
        port: default_port,
        path: path,
        method: 'POST',
        headers: {
            'Cookie': 'csrftoken=' + global.csrf_token,
            'Content-Type': 'application/json;charset=utf8',
            'Content-Length': Buffer.byteLength(content),
            'Data-Key': key,
            'X-CSRFToken': global.csrf_token
        }
    }
    var post_req = http.request(options, function(res) {
        res.setEncoding('utf-8')
        var body = ""
        res.on('data', function(rec_data) {
            body += rec_data
        })
        res.on("end", function() {
            try {
                on_data_callback(JSON.parse(body))
            }
            catch (e) {
                console.log('error message: ' + e)
            }
        })
        res.resume()
    }).on('error', function(e) {
        console.log(e)
        if (on_err_callback)
            on_err_callback(e)
        else
            throw "error get " + url + ", " + e
    })
    post_req.write(content)
    post_req.end()
}
