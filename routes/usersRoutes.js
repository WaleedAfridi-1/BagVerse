const express = require('express')
const userModel = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const generateToken = require('../utils/generateToken');
const {registerUser, loginUser } = require('../controllers/authController');
const isLogin = require('../middleware/isLogin');
const ordersModel = require('../models/ordersModel');

const router = express.Router();




router.post("/register", registerUser)
router.post("/login", loginUser )

router.get("/orders", isLogin, async (req, res) => {
    try {

        const orders = await ordersModel.find({ user: req.user._id })
            .populate("orderItems.product"); 
        res.render("user/userOrders", {
            currentPage: "userOrders",
            orders: orders
        });
    } catch (error) {
        console.error("Order Fetch Error:", error);
        res.status(500)
        res.redirect("/users/orders");
    }
});

module.exports = router