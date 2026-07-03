const mongoose = require('mongoose')



const productSchema = mongoose.Schema({
    name: String,
    category:{
        type:String
    },
    subCategory:String,
    stock:Number ,
    image: Buffer,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    description : {
        type:String,
        default:""
    }
}) 

module.exports = mongoose.model("product", productSchema)