const express = require('express')
const router = express.Router()
const { getAllUser, createUser, getUser, patchUser, deleteUser } = require('../controller/userCtrl')
const { signup, login }= require('../controller/authCtrl')

router.post('/signup', signup)
router.post('/login', login)

router.route('')
   .get(getAllUser)
   .post(createUser)

router.route('/:id')
   .get(getUser)
   .patch(patchUser)
   .delete(deleteUser)

module.exports = router
