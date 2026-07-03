const express = require("express");
const isLogin = require("../middleware/isLogin");
const productModel = require("../models/product");
const { cartAdd, removeProduct } = require("../controllers/cartController");
const userModel = require("../models/user");
const cartModel = require("../models/Cart");
const isAdmin = require("../middleware/isAdmin");
const product = require("../models/product");



const router = express.Router();

router.get("/",isLogin, async (req, res) => {
    const cart = await cartModel.findOne({user:req.user._id}).populate('items.product')
    res.render("cart/cart", {
        cart,
        currentPage:"cart"
    })
})


router.get("/checkout", (req, res) => {
    res.render("cart/cartCheckout",{
        currentPage:"cart"
    })
})


router.post("/add",isLogin ,cartAdd);
router.get("/product/:id",isLogin, removeProduct);


router.get("/product/quantity/:id", isLogin, async (req, res) => {
    try {
        const id = req.params.id;

        const cart = await cartModel.findOne({user:req.user._id});

        const item = cart.items.find(item => item.product.toString() === id);

        if (!item) {
            return res.status(404).send("Product not found in cart");
        }

        item.quantity += 1;
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),0)

        await cart.save();

        res.redirect("/cart")

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/product/remove/quantity/:id",async (req, res) => {
    const id = req.params.id;
    const cart = await cartModel.findOne({user:req.user._id});

    const item = cart.items.find(item => item.product.toString() === id)
    if(item.quantity > 1 ){
        item.quantity -= 1;
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),0
        )
        await cart.save()
    }
    res.redirect("/cart")

})
module.exports = router;