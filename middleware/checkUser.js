const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const checkUser = async (req,res,next)=>{

    if(req.cookies.token){

        try{

            const decode = jwt.verify(
                req.cookies.token,
                process.env.JWT_KEY
            );

            const user = await userModel
            .findOne({email:decode.email})
            .select("-password");

            req.user = user;

        }catch(err){
            req.user = null;
        }

    }

    next();
}

module.exports = checkUser;