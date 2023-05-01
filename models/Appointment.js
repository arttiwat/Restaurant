const mongoose = require('mongoose');

const AppointmentSchema  = new mongoose.Schema({
    apptDate: {
        type: Date,
        reqired: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        reqired: true
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    createAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment',AppointmentSchema);