const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role:{
        type:String,
        enum:["user", 'admin'],
        default:"user"
    },
    cart: {
        type: Array,
        default: []
    },
    orders: {
        type: Array,
        default: []
    },
    contact : Number,
    picture : String
})

module.exports = mongoose.model("user", userSchema )