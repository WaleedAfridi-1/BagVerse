const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    // 🔥 YEH SAALAH MASLA THA! Yeh array aapke schema mein nahi tha:
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product", // Aapke product model ka exact naam (check karlena small 'p' hai ya capital 'P')
                required: true
            },
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        default: "Cash On Delivery"
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    status :{
        type:String,
        default:"pending"
    },
    createdAt: {
        type: Date,
        default: Date.now // Bina brackets ke takay har order ka apna sahi time save ho
    }
});

module.exports = mongoose.model("Orders", orderSchema);