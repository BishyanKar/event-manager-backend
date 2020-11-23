const jwt = require('jsonwebtoken');
const secretKey = 'meoqi@123';
const options = {};
// const options = { expiresIn: process.env.TOKEN_EXPIRY_TIME };

let encrypt = (user) => {
    return jwt.sign({
        data: user
      }, secretKey, options)
}

let verifyToken = (authToken) => {
    try {
        return jwt.verify(authToken, secretKey, options);
    } catch (error) {
        return "Could not verify token";  
    }
}

module.exports = {
    encrypt, verifyToken
}