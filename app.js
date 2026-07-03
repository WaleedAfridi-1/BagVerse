require('dotenv').config();
const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');
const db = require('./config/mongooseConnection');
const expressSession = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const cartModel = require("./models/Cart");
const userModel = require("./models/user")
const isLogin = require("./middleware/isLogin");
const checkUser = require("./middleware/checkUser");

const usersRoutes = require('./routes/usersRoutes');
const ownerRoutes = require("./routes/ownerRoutes");
const productRoutes = require("./routes/productRoutes");
const indexRoutes = require("./routes/indexRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");


const app = express();

app.use(express.json())
app.set("view engine", 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(checkUser)
app.use(cookieParser());

app.use(checkUser);

app.use(async (req, res, next) => {

    if (req.user) {

        const cart = await cartModel.findOne({
            user: req.user._id
        });

        res.locals.cart = cart || { items: [] };
        res.locals.userRole = req.user.role;
    } else {

        res.locals.cart = { items: [] };

    }

    next();

});

app.use('/admin', ownerRoutes);
app.use("/", indexRoutes);
app.use('/users', usersRoutes);
app.use('/products', productRoutes);
app.use("/cart", cartRoutes)
app.use("/order", orderRoutes)


app.use((req, res) => {
    res.send("Not found")
})
app.listen(3000, () => {
    console.log("Running on 3000")
})