require('dotenv').config();
const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');
const db = require('./config/mongooseConnection');
const expressSession = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const cartModel = require("./models/Cart");
const userModel = require("./models/user");
const isLogin = require("./middleware/isLogin");
const checkUser = require("./middleware/checkUser");

const usersRoutes = require('./routes/usersRoutes');
const ownerRoutes = require("./routes/ownerRoutes");
const productRoutes = require("./routes/productRoutes");
const indexRoutes = require("./routes/indexRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Basic Configurations
app.set("view engine", 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// 🔥 FIX 1: Session hamesha Flash se PEHLE aana chahiye
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET || "defaultsecret" 
}));

// 🔥 FIX 2: Flash ab session ke baad perfectly kaam karega
app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// 🔥 FIX 3: Custom Middlewares (Duplicate clean kar diye)
app.use(checkUser);

// Cart and Role Setup Middleware
app.use(async (req, res, next) => {
    if (req.user) {
        const cart = await cartModel.findOne({ user: req.user._id });
        res.locals.cart = cart || { items: [] };
        res.locals.userRole = req.user.role;
    } else {
        res.locals.cart = { items: [] };
    }
    next();
});

// Routes Mapping
app.use('/admin', ownerRoutes);
app.use("/", indexRoutes);
app.use('/users', usersRoutes);
app.use('/products', productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).send("Not found");
});

app.listen(3000, () => {
    console.log("Running on 3000");
});