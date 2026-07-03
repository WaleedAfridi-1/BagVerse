const productModel = require("../models/product");
const userModel = require("../models/user");
const cartModel = require("../models/Cart");
const product = require("../models/product");


module.exports.cartAdd = async (req, res) => {
    const { userId, productId } = req.body;
    const product = await productModel.findById(productId);

    if (!product) {
        return res.status(404).json({
            message: "Product Not Found"
        });
    }

    let userCart = await cartModel.findOne({ user: userId })

    if(!userCart){
        userCart = await cartModel.create({
            user: userId,
            items:[]
        })
    }
    const existingItem = userCart.items.find(
        item => item.product.toString() === productId
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        userCart.items.push({
            product: productId,
            price: product.price,
            quantity: 1
        });
    }

    userCart.totalPrice = userCart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    await userCart.save();
    res.redirect("/cart")

}


module.exports.removeProduct = async (req, res) => {
    const productId = req.params.id;
    let userCart = await cartModel.findOne({user:req.user._id});
    if(!userCart){
        return res.redirect("/")
    }
    userCart.items = userCart.items.filter(
        item => item.product.toString() !== productId
    )
    userCart.totalPrice = userCart.items.reduce(
        (total , item ) => total + (item.price * item.quantity) ,0
    )
    await userCart.save()
    res.redirect("/cart")
}