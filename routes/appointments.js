const express = require('express');
const {getAppointments,getAppointment,addAppointment, updateAppointment,deleteAppointment} = require('../controllers/appointments');

const router = express.Router({mergeParams:true});

const {protect,authorize} = require('../middleware/auth');



router.route('/').get(protect, getAppointments).post(protect,authorize('admin','customer'),addAppointment);
router.route('/:id').get(protect,getAppointment).put(protect,authorize('admin','customer'),updateAppointment).delete(protect,authorize('admin','customer'),deleteAppointment);

module.exports = router;