const login = require('../models/login')
const generate_token = require('../config/token')
const jwt = require('jsonwebtoken')

// In-memory token blacklist
const tokenBlacklist = new Set()

class Logins{

    async login(req, res){
        const postData = req.body
        const result = await login.auth(postData)
        if(result == 'ok'){
            const payload = {
                username: postData.username
            }
            const token = generate_token(payload)
            res.end(token)
        }
        else{
            res.end('Incorrect Email or Password')
        }
    }

    logout(req, res) {
        const token = req.headers.authorization
        try {
            const accessToken = token.replace('Bearer ', '')
            jwt.verify(accessToken, 'your-secret-key')
            tokenBlacklist.add(token)
            res.status(200).send('Token revoked')
        } 
        catch (error) {
            res.status(401).send('Invalid token')
        }
    }

}

let main = new Logins()
module.exports = main
