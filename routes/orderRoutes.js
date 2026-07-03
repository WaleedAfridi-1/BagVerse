const express = require("express");
const isLogin = require("../middleware/isLogin");
const orderModel = require("../models/ordersModel"); 
const cartModel = require("../models/Cart")
const isAdmin = require("../middleware/isAdmin")
const router = express.Router();


router.post("/place", isLogin, async (req, res) => {
    try {
        const { name, email, phone, postalCode, address, city } = req.body;

        const cart = await cartModel.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            res.status(400);
            return res.redirect("/")
        }

        const orderItems = cart.items.map(item => {
            return {
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.price
            };
        });

        const newOrder = new orderModel({
            user: req.user._id,
            orderItems: orderItems, 
            name,
            email,
            phone,
            postalCode,
            city,
            address,
            totalPrice: (10 + cart.totalPrice) 
        });

        await newOrder.save();

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        const populatedOrder = await orderModel.findById(newOrder._id).populate("orderItems.product");

        res.render("cart/success",{
            currentPage:"checkout"
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
});



module.exports = router;