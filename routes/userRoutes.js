const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword',
   authController.protect, 
   authController.updatePassword)

router.patch('/updateMe',
   authController.protect, userController.updateMe)

router.delete('/deactive',
   authController.protect, userController.deactive)

router.route('/:id')
  .delete(authController.protect,
     authController.restrictTo('admin'),
     userController.deleteUser)
  .get(authController.protect,
     authController.restrictTo('admin'),
     userController.getUser)

router.route('/')
  .get(userController.getAllUsers)

module.exports = router;
