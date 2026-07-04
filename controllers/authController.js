const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const generateToken = require('../utils/generateToken');

module.exports.registerUser = async function (req, res) {
    try {
        const { name, email, password } = req.body;

        const userExist = await userModel.findOne({ email: email });
        if (userExist) {
            req.flash("error", "You already have an account, please login.");
            return res.redirect("/login"); // Direct login page par bhejein
        }
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            name,
            email,
            password: hash
        });

        const token = generateToken(user);
        res.cookie('token', token);
        res.redirect("/");

    } catch (error) {
        req.flash("error", "Registration failed. Try again!");
        res.redirect("/sign-up");
    }
}

module.exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;
        
        const user = await userModel.findOne({ email: email });
        if (!user) {
            req.flash("error", "Please create an account first!");
            // 🔥 FIX: Timeout bilkul hata diya taaki session message destroy na ho
            return res.redirect("/sign-up"); 
        } 

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const token = generateToken(user);
            res.cookie('token', token);
            res.redirect("/");
        } else {
            req.flash("error", 'Invalid email or password!.');
            res.redirect("/login");
        }
    } catch (error) {
        req.flash("error", "Something went wrong.");
        res.redirect("/login");
    }
}