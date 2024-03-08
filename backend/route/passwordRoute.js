const express = require('express')
const route=express.Router()
const passwordController = require('../controller/passwordController')


route.post('/forgotPassword',passwordController.forgetPassword)


module.exports=route