const express = require('express');
const {getRestaurants,createRestaurant,deleteRestaurant,getRestaurant,updateRestaurant} = require('../controllers/restaurants');
const appointmentRouter = require('./appointments');
//
//  const {getAppointments,getAppointment,addAppointment, updateAppointment,deleteAppointment} = require('../controllers/appointments');
//

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');


router.use('/:restaurantId/appointments/',appointmentRouter);
router.route('/').get(getRestaurants).post(protect,authorize('admin'),createRestaurant);
router.route('/:id').get(getRestaurant).delete(protect,authorize('admin'),deleteRestaurant).put(protect,authorize('admin'),updateRestaurant);

//
// router.route('/:id/appointments').get(addAppointment);
//

// router.route('/').get(getRestaurants).post(protect,createRestaurant);
// router.route('/:id').get(getRestaurant).delete(protect,deleteRestaurant).put(protect,updateRestaurant);

// router.route('/').get(getRestaurants).post(createRestaurant);
// router.route('/:id').get(getRestaurant).delete(deleteRestaurant).put(updateRestaurant);



module.exports=router;