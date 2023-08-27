const jwt = require('jsonwebtoken')

// Your secret key for signing the token (keep this secret!)
const secretKey = 'your-secret-key'

function generateToken(payload) {
    const options = {
        expiresIn: '1h'
    }
    const token = jwt.sign(payload, secretKey, options)
    return token
}

module.exports = generateToken