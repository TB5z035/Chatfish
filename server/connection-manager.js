'use strict';

class ConnectionManager {
    constructor() {
        this._instance = null
        this.users = []
    }

    add_user(id, token, username) {
        this.users.push({
            id: id,
            token: token,
            username: username
        })
    }

    find(id) {
        return this.users.find(user => {
            return user.id === id
        })
    }

    find_index(id) {
        return this.users.findIndex(user => {
            return user.id === id
        })
    }

    find_by_token(token) {
        return this.users.find(user => {
            return user.token === token
        })
    }

    find_index_by_token(token) {
        return this.users.findIndex(user => {
            return user.token === token
        })
    }

    check_user(id, token) {
        var user = find(id)
        if (user) return user.token === token
        return false
    }

    set_ws(token, ws) {
        var index = this.find_index_by_token(token)
        this.users[index].ws = ws
        if (this.users[index].timer) {
            console.log('clear timeout!')
            clearTimeout(this.users[index].timer)
            delete this.users[index].timer
        }
    }

    get_ws(id) {
        var index = this.find_index(id)
        if (index !== -1) return this.users[index].ws
        else return null
    }
    
    close(id) {
        var index = this.find_index(id)
        if (index !== -1) this.users.splice(index, 1)
    }

    close_ws(id) {
        var index = this.find_index(id)
        if (index !== -1) this.users[index].timer = setTimeout(function(ts, index) {
            ts.users.splice(index, 1)
            console.log('token expirated!')
        }, 3 * 60 * 60 * 1000, this, index)
    }

    static instance() {
        if (!this._instance) this._instance = new ConnectionManager()
        return this._instance
    }
}

module.exports = ConnectionManager