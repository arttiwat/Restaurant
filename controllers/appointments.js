const { json } = require('express');
const Appointment = require('../models/Appointment');
const Restaurant = require('../models/Restaurant');

exports.getAppointments = async (req,res,next)=>{
    let query;

    //General User can see only their appointment
    if(req.user.role !== 'admin'){
        query = Appointment.find({user:req.user.id}).populate({
            path:'restaurant',
            select: 'name province tel'
        });

    }
    //if you are an admin, you can see all
    else{
        query = Appointment.find().populate({
            path:'restaurant',
            select: 'name province tel'
        });

    }
    try{
        const appointments = await query;

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Cannot Find Appointment101"
        });
    }
};

exports.getAppointment = async (req,res,next) => {

    try{
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'restaurant',
            select: 'name description tel'
        });

        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with id of ${req.params.id}`});

        }

        res.status(200).json({
            success:true,
            data:appointment
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Appointment"});
    }
    
};

exports.addAppointment = async (req,res,next) => {

    try{
        req.body.restaurant = req.params.restaurantId;

        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if(!restaurant){
            return res.status(404).json({
                success:false,
                message: `No restaurant with id of ${req.params.restaurant}`
            });
        }

        //add user ID to req.body
        
        req.body.user = req.user.id;

        // Check for existed Appointment
        const existedAppointments = await Appointment.find({user:req.user.id});

        //id the user is not an admin, they can only create 3 appointment.
        if(existedAppointments.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({
                success:false,
                message:`The User with ID ${req.user.id} has already made 3 appointments`
            });
        }

        const appointment = await Appointment.create(req.body);
        res.status(200).json({
            success:true,
            data: appointment
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot Create Appointment"});
    }
}

//@desc     Update Appointment
//@route    PUT /api/v1/appointments/:id
//@access   Private

exports.updateAppointment = async(req,res,next) => {

    try{
        let appointment = await Appointment.findById(req.params.id);

        if(!appointment){
            return res.status(404).json({
                success:false,
                message:`No Appointment with the ID of ${req.params.id}`
            });
        }

        //Make sure user is the appointment Owner
        if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorized to update this appointment`
            });
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success:true,
            data: appointment
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot Update Appointment"
        });
    }

};

//@desc     Delete Appointment
//@route    DELETE /api/v1/appointments/:id
//@access   Private

exports.deleteAppointment = async(req,res,next)=>{
    try{
        const appointment = await Appointment.findById(req.params.id);

        if(!appointment){
            return res.status(404).json({
                success:false,
                message:`No Appointment with the ID of ${req.params.id}`
            });
        }

        //Male sure user is the appointment owner
        if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorized to delete this bootcamp`
            });
        }

        await Appointment.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success:true,
            data:{}
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot Delete Appointment"
        });
    }
};