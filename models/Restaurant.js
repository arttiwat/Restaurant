const mongoose = require('mongoose')
const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please add a name'],
        uniqe: true,
        trim: true,
        maxlength: [50,'Name too long']
    },
    address: {
        type: String,
        required: [true,'Please add a Address']
    },
    district: {
        type: String,
        required: [true,'Please add a District']
    },
    province: {
        type: String,
        required: [true,'Please add a Province']
    },
    postalcode: {
        type: String,
        required: [true,'Please add a PostalCode']
    },
    tel: {
        type: String
    },
    region:{
        type: String,
        required: [true,'Please add a Region']
    }


},{
    toJSON: {virtuals: true},
    toObject: {virtuals:true}
});

//Reserve Populate with virtuals
RestaurantSchema.virtual('appointment',{
    ref:'Appointment',
    localField: '_id',
    foreignField: 'restaurant',
    justOne: false,
});

//Cascade Delete appointment when a restaurant is deleted
RestaurantSchema.pre('remove',async function(next){
    console.log(`Appointment being removed from restaurant ${this._id}`);
    await this.model('Appointment').deleteMany({restaurant: this._id});
    next();
});

module.exports = mongoose.model('Restaurant',RestaurantSchema);