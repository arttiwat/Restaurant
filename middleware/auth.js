const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect Routes
exports.protect = async (req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    //Make sure token exists
    if(!token){
        return res.status(401).json({success:false,message:'Not Authorize to access this route1'});

    }

    try{
        //Verify Token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);

        next();
    }catch(err){
        console.log(err.stack);
        return res.status(401).json({success:false,message:'Not Authorize to access this route2'});
    }
};

//Grant Access to specific Roles
exports.authorize = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success:false,message:`User role ${req.user.role} is not authorized to access this route`});

        }
        next();
    }
}