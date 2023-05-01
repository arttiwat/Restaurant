const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a Name']
    },
    email:{
        type:String,
        required:[true,'Please add an E-mail'],
        unique:true,
        match:[
            /^(([^<>([\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9{1,3\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a Valid E-mail'
        ]
    },
    role:{
        type:String,
        enum:['customer','restaurant','admin'],
        default:'customer'
    },
    password:{
        type:String,
        required:[true,'Please add a Password'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    telephone:{
        type:String,
        required:[true,'Please add a Telephone Number'],
        minlength:4,
        unique:true

    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true},
});

//Reverse Populate with virtuals
UserSchema.virtual('appointments',{
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'restaurant',
    justOne: false,
});

//Cascade Delete appointment when a hospital is deleted
UserSchema.pre('remove', async function(next){
    console.log(`Appointments being removed from user ${this._id}`);
    await this.model('Appointment').deleteMany({user: this._id});
    next();
});

//Encypt Password using bcryte
UserSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

// //Sign JWT and Return
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
}

// // Match User entered Password to hashed passwordin database
UserSchema.methods.matchPassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password);

}

module.exports = mongoose.model('User',UserSchema);