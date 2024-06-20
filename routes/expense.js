const express = require('express')
const route=express.Router()
const expenseController = require('../controllers/expense')

route.post('/add-expense',expenseController.addExpense)
route.post('/delete-expense',expenseController.deleteExpense)
route.get('/get-expense',expenseController.getExpense)



module.exports=route