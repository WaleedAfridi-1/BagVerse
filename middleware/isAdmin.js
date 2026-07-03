

const isAdmin = (req, res, next) => {

    
    if(req.user.role !== "admin"){
        res.status(403)
        req.flash("error", "Access Denied")
        return res.redirect("/");
    }
    next();
}

module.exports = isAdmin