const express = require('express')
const route=express.Router()
const expenseController = require('../controller/expenseController')

route.post('/add-expense',expenseController.addExpense)
route.post('/delete-expense',expenseController.deleteExpense)
route.get('/get-expense',expenseController.getExpense)
route.get


module.exports=route