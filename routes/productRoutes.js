const express = require('express')
const isLogin = require("../middleware/isLogin")
const isAdmin = require("../middleware/isAdmin")
const productModel = require("../models/product");
const { render } = require('ejs');
const router = express.Router();



router.get("/hand-bags", isLogin,  async (req, res) => {
    const products = await productModel.find();
    const data = products.filter(
        item => item.category.toLowerCase() === 'hand-bag'
    )
    res.render("category/handBags",{
        currentPage:"handBags",
        data,
        userId:req.user._id
    }
    )
})
router.get("/back-packs",isLogin, async (req, res) => {
    const products = await productModel.find();
    const backPacks = products.filter(
        item => item.category.toLowerCase() === 'back-pack'
    )
    res.render("category/backPacks",{
            currentPage:"backPacks",
            data:backPacks,
            userId:req.user._id
        }
    )
})
router.get("/travel-bags",isLogin, async (req, res) => {
    const products = await productModel.find();
    const travelBags = products.filter(
        item => item.category.toLowerCase() === "travel-bag"
    )
    res.render("category/travelBags",{
        currentPage:"travelBags",
        data:travelBags,
        userId:req.user._id
    }
    )
})

router.get("/urban/bags",isLogin, async (req, res) => {
    const products = await productModel.find();
    const data = products.filter((item) => item.subCategory.toLowerCase() === 'urban'); 
    res.render("category/urbanBags",{
        data,
        currentPage:"urban",
        userId:req.user._id
    })
})

router.get("/luxury/bags", isLogin,async (req, res) => {
    const product = await productModel.find()
    const data = product.filter(item => item.subCategory.toLowerCase() === "luxury")
    res.render('category/luxuryHandbags',{
        currentPage:"luxuryHandBag",
        userId:req.user._id,
        data
    })
})

router.get("/:id",isLogin, async (req, res) => {
    try {
        const product = await productModel.findOne({_id:req.params.id});
        
        if (!product) {
            return res.status(404)
            res.redirect("/");
        }

        res.render("category/productDetail", {
            currentPage: "productDetail",
            product: product,
            userId:req.user._id,
        });
    } catch (error) {
        console.error("Fetch Product Detail Error:", error);
        res.status(500).send("Internal Operational Error");
    }
});
module.exports = router;