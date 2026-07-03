const express = require('express')
const router = express.Router();
const ownerModel = require("../models/ownerModel");
const upload = require("../config/multer");
const productModel = require("../models/product");
const isAdmin = require("../middleware/isAdmin")
const isLogin = require("../middleware/isLogin");
const product = require('../models/product');
const orderModel = require("../models/ordersModel"); 



router.get("/dashboard", isLogin, isAdmin, async (req, res) => {
    const products = await productModel.find();
    const inventory = products.reduce(
        (inventory, item) => inventory + item.stock, 0
    )
    const totalValuation = products.reduce(
        (total, item) => total + (item.price * item.stock), 0
    )
    const lowStock = products.filter((item) => {
        return item.stock < 5
    })
    res.render("admin/adminDashboard", {
        currentPage: "overView",
        admin: req.user,
        products,
        activeInventory: inventory,
        lowStockItems: lowStock.length,
        totalValuation,
    })
})

router.post("/orders/:id/status", isLogin, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!["Pending", "Shipped", "Delivered"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid Status Value" });
        }
        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order nahi mila" });
        }

        res.json({ success: true, message: `Status updated to ${status} successfully!`, status: updatedOrder.status });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



router.get("/orders", isLogin, isAdmin, async (req, res) => {
    try {
        
        const orders = await orderModel.find().populate("orderItems.product").sort({ createdAt: -1 });

        const totalOrders = orders.length;
        const pendingCount = orders.filter(o => o.status === "Pending").length; // Agar status update kiya hai to
        const shippedCount = orders.filter(o => o.status === "Shipped").length;
        
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        res.render("admin/adminOrders", {
            currentPage: "orders",
            admin: req.user,
            orders: orders, 
            stats: {
                totalOrders,
                pendingCount,
                shippedCount,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).send("Error fetching orders: " + error.message);
    }
});


router.get("/orders/:id", isLogin, isAdmin, async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id).populate("orderItems.product");
        
        if (!order) {
            return res.status(404).send("Order not found!");
        }

        res.render("admin/orderDetail", {
            currentPage: "order`s",
            admin: req.user,
            order: order
        });
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

router.get("/products", isLogin, isAdmin, async (req, res) => {
    const products = await productModel.find()
    const inStock = products.reduce(
        (stocks, item) => stocks + item.stock, 0
    )
    const lowStock = products.filter(item => item.stock > 0 && item.stock < 5)
    const outOfStock = products.filter(item => item.stock === 0)
    res.render("admin/adminProducts", {
        currentPage: "products",
        admin: req.user,
        products,
        inStock,
        lowStock,
        outOfStock
    })
})
router.get("/products/add", isLogin, isAdmin, async (req, res) => {
    res.render("product/createProduct", {
        currentPage: "nav",
    })
});

router.get("/products/edit/:id", async (req, res) => {
    const item = await productModel.findOne({ _id: req.params.id })
    res.render("product/editProduct", {
        item
    })
})

router.post("/product/update/:id", upload.single("image"), async (req, res) => {
    try {

        const { name, category, subCategory, price, description, stock, discount } = req.body;

        let updateData = {
            name,
            category,
            subCategory,
            price,
            description,
            stock,
            discount
        };


        
        if(req.file){
            updateData.image = req.file.buffer;
        }


        const updateItem = await productModel.updateOne(
            { _id: req.params.id },
            {
                $set: updateData
            }
        );


        res.redirect("/admin/products");


    } catch(err){
        res.status(500).send(err.message);
    }
});

router.post("/product/create", upload.single("image"), async (req, res) => {
    const buffer = req.file.buffer;
    const { name, price, discount, category, stock, subCategory, description } = req.body;
    const product = await productModel.create({
        name,
        category,
        subCategory,
        stock,
        price,
        discount,
        description,
        image: buffer
    })
    res.redirect("/admin/dashboard")
});

router.get("/products/delete/:id", async (req,res) => {
    const itemId = req.params.id;
    await productModel.deleteOne({_id:itemId})
    res.redirect("/admin/products")
})


module.exports = router;