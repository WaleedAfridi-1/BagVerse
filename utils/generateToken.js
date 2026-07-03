const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    return jwt.sign({email:user.email, id:user.id, role:user.rol}, process.env.JWT_KEY, {expiresIn:"1d"})
}

module.exports = generateToken;