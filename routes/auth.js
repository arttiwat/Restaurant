const express = require('express');
const {register, login,getMe,update,deleteUser,getAllUsers} = require('../controllers/auth');

const router = express.Router();
const {protect,authorize} = require('../middleware/auth');

router.post('/register',register);
router.post('/login',login);
router.get('/me',protect,authorize('admin','customer'),getMe);
router.put('/:id/update',protect,authorize('admin','customer'),update);
router.delete('/:id/delete',protect,authorize('admin'),deleteUser);
router.get('/getAll',getAllUsers);

module.exports = router;