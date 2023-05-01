const User = require('../models/User');

//Get token from Model, Create Cookie and Send Response
const sendTokenResponse = (user,statusCode,res)=>{
    //Create Token
    const token = user.getSignedJwtToken();

    const options = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV==='production'){
        options.secure = true;
    }
    res.status(statusCode).cookie('token',token,options).json({success:true,token,_id:user._id,token})
}

exports.getAllUsers= async(req,res,next)=>{

    let query;
    
    //Copy eq,query
    const reqQuery = {...req.query};

    //Field to exclude
    const removeField = ['select','sort','page','limit'];

    //Loop over remove field and delete them from reqQuery
    removeField.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    //Create query string
    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
    //finding resource
    query = User.find(JSON.parse(queryStr)).populate('appointments');
    // query = Hospital.find(JSON.parse(queryStr));

    //General User can see only their appointment
    // if(req.user.role !== 'admin'){
    //     query = Appointment.find({user:req.user.id}).populate({
    //         path:'restaurant',
    //         select: 'name province tel'
    //     });

    // }
    // //if you are an admin, you can see all
    // else{
    //     query = Appointment.find().populate({
    //         path:'restaurant',
    //         select: 'name province tel'
    //     });

    // }

    //Select Field
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else{
        query = query.sort('-createAt');
    }

    //Pagination
    const page = parseInt(req.query.page,10)||1;
    const limit = parseInt(req.query.limit,10)||25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;

    try{
        const total = await User.countDocuments();
        query = query.skip(startIndex).limit(limit);

        //Execute query
        const users = await query;

        //Pagination result
        const pagination = {};
        if (endIndex < total){
            pagination.next = {page:page+1,limit}

        }

        if (startIndex > 0){
            pagination.prev = {page:page-1,limit}
        }

        res.status(200).json({success:true,count:users.length, pagination,data:users});
    }catch(err){
        res.status(400).json({success:false});
        console.log(err);
    }
};

exports.register = async(req,res,next)=>{

    try{
        const {name, email, password, role, telephone} = req.body;

        //Create User
        const user = await User.create({
            name,
            email,
            password,
            role,
            telephone
        });

        //Create Token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true, token});
        // console.log(token);
        sendTokenResponse(user,200,res);


    }catch(err){
        res.status(400).json({success:false});
        console.log(err);
    }
    

};

//@desc     Login User
//@route    POST/api/v1/auth/login
//@access   Public

exports.login = async (req,res,next)=>{
    const {email,password} = req.body;

    //Validate Email & Password
    if(!email || !password){
        return res.status(400).json({success:false,
        msg:'Please Provide an Email & Password'});
    }

    //Check for User
    const user = await 
    User.findOne({email}).select('+password');
    if(!user){
        return res.status(400).json({success:false,
        msg:'Invalid Credentials'});
    }

    //Check if Password Matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(401).json({success:false,
        msg:'Invalid Credentials'})

    }

    //Create Token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({success:true,token});
    sendTokenResponse(user,200,res);
};

//@desc Get Current Logged in User
//@Route POST /api/v1/auth/me
//@access Private
exports.getMe = async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({success:true,data:user});
};

//@desc Update User Information
//@Route POST /api/v1/auth/me
//@access Private

exports.update = async (req,res,next) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators:true
        });

        if(!user){
            return res.status(400).json({success:false});
            console.log("!user");
        }
        
        res.status(200).json({success:true,data:user});
    }catch(err){
        res.status(400).json({success:false});
        console.log(err);
    }
};

exports.deleteUser = async (req,res,next) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(400).json({success:false});
        }
        user.remove();
        res.status(200).json({success:true, data:{}});
    }catch(err){
        res.status(400).json({success:false});
        console.log(err);
    }
};