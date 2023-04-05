const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.route('/')
  .get(userController.getAllUsers)

// Protect Middleware
router.use(authController.protect)

router.patch('/updateMyPassword', authController.updatePassword)

router.get('/me', 
   userController.getMe, 
   userController.getUser)

router.patch('/updateMe', userController.updateMe)
router.delete('/deactive', userController.deactive)

// Restrict Middleware
router.use(authController.restrictTo('admin'))

router.route('/:id')
  .delete(userController.deleteUser)
  .get(userController.getUser)

module.exports = router;
