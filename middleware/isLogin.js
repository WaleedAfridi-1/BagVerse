const jwt = require('jsonwebtoken')
const userModel = require("../models/user")


const isLogin = async (req, res, next) => {

    if (!req.cookies.token) {
        req.flash("error", "Please Login First!.")
        return res.redirect("/login")
         
    }

    try {
        const decode = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decode.email }).select("-password")
        if(!user){
            return res.redirect("/sign-up")
        }
        req.user = user;
        next()
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/sign-up")
    }
}

module.exports = isLogin;