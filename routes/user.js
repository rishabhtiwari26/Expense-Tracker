const express = require('express')
const route=express.Router()
const userController = require('../controllers/user')
const expenseController = require('../controllers/expense')

route.post('/signup',userController.signUp)
route.post('/login',userController.login)
route.get('/download',expenseController.downloadExpense)


module.exports=route