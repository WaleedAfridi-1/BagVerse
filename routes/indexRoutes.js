const express = require("express");
const isLogin = require("../middleware/isLogin");
const upload = require('../config/multer');
const productModel = require("../models/product");
const { logoutUser } = require("../controllers/authController")

const router = express.Router();



router.get("/", isLogin,async (req, res) => {
    const userId = req.user._id;
    const products  = await productModel.find()
    const data = products.map(product => ({
        ...product.toObject(),
        image:`data:${product.imageType};base64,${product.image.toString("base64")}`
    })).toReversed()      
    res.render("shop", {
        data,
        userId,
        currentPage:"home"
    })
})

router.get("/sign-up", (req, res) => {
    res.render("user/registerUser")
})

router.get("/login", (req, res) => {
    const error = req.flash("error")
    res.render("user/loginUser",{error})
})

router.get("/logout", (req, res) => {
    res.clearCookie("token")
    res.redirect("/login")
} )


module.exports = router;