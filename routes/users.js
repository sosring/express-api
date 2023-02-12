const express = require('express')
const router = express.Router()
const { getAllUser, createUser, getUser, patchUser, deleteUser } = require('../controller/userCtrl')

router.route('')
   .get(getAllUser)
   .post(createUser)

router.route('/:id')
   .get(getUser)
   .patch(patchUser)
   .delete(deleteUser)

module.exports = router
