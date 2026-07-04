const express = require('express')
const { registerUser, loginUser } = require('../controllers/authController');
const isLogin = require('../middleware/isLogin');
const ordersModel = require('../models/ordersModel');

const router = express.Router();

// POST: /users/register
router.post("/register", registerUser);

// POST: /users/login
router.post("/login", loginUser);

// GET: /users/orders
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
        res.status(500).redirect("/"); 
    }
});

module.exports = router;