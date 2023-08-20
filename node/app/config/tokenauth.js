const jwt = require('jsonwebtoken')
// Middleware to check for an existing valid token
function checkExistingToken(req, res, next) {
    const jwtHeader = req.headers.authorization || '' // Get the Authorization header
    // Extract the token from the header (assuming Bearer scheme)
    const accessToken = jwtHeader.replace('Bearer ', '')
    const fullUrl = req.originalUrl

    // If a valid token is found, deny the request
    if (jwtTokenIsValid(accessToken) && fullUrl != '/admin/logout') {
        console.log('tokenauth')
        return res.status(403).send('Token already present')
    }
    // Proceed to the next middleware or route handler
    next()
}

function jwtTokenIsValid(token) {
    if (!token) {
      return false // No token provided
    }

    try {
        // Parse the token and verify its contents
        const decodedToken = jwt.verify(token, 'your-secret-key')
        // Check additional conditions if needed, such as expiration
        return true // Token is valid
    } catch (error) {
        return false // Token is invalid
    }
}

module.exports = checkExistingToken