const mongoose = require("mongoose");
const product = require("./product");

const cartSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    items:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
        },
        price:Number,
        quantity:Number,
        discount:{
            type:Number,
            default:0
        },
    }],
    totalPrice : {
        type:Number,
        default:0
    }
})

module.exports = mongoose.model("Cart", cartSchema)