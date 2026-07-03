const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken')


module.exports.registerUser = async function (req, res) {
    try {
        const { name, email, password } = req.body;

        const userExist = await userModel.findOne({ email: email });
        if (userExist) return res.flash("You have Already an Account please login");
        
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await userModel.create({
            name,
            email,
            password: hash
        })

        const token = generateToken(user)
        res.cookie('token', token)
        res.redirect("/")

    } catch (error) {
        res.status(500)
        res.redirect("/sign-up")
    }
}


module.exports.loginUser = async function (req, res ) {
    const {email, password } = req.body;
    
    const user = await userModel.findOne({email:email})
    if(!user){
        req.flash("error","Please create an account first!")
        res.redirect("/sign-up")
        return;
    } 

    const result = await bcrypt.compare(password, user.password);
    if(result){
        const token = generateToken(user);
        res.cookie('token', token)
        res.redirect("/")
    }else{
        req.flash("error",'Invalid email or password!.')
        res.redirect("/sign-up")
    }
}

module.exports.logoutUser = (req, res ) => {
    
    res.redirect("/login")
}
