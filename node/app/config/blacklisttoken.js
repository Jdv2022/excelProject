const jwt = require('jsonwebtoken')

// In-memory token blacklist
const tokenBlacklist = new Set()

function blacklist(){
    // Middleware to check token validity
    function checkToken(req, res, next) {
        const token = req.headers.authorization
        if (token && !tokenBlacklist.has(token)) {
            try {
                const decoded = jwt.verify(token, 'your-secret-key')
                req.user = decoded
                next()
            } catch (error) {
                res.status(401).send('Invalid token')
            }
        } else {
            res.status(401).send('Invalid token')
        }
    }

    // Endpoint to blacklist a token (simulate revocation)
    app.post('/revoke', (req, res) => {
        const tokenToRevoke = req.headers.authorization
        if (tokenToRevoke) {
            tokenBlacklist.add(tokenToRevoke)
            res.status(200).send('Token revoked')
        } else {
            res.status(400).send('Token not provided')
        }
    })

}

module.exports = blacklist