const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser=require('body-parser')
const sequelize  = require('./util/database')

const user = require('./model/userModel')
const expense = require('./model/expenseModel')
const order=require('./model/orderModel')
const passwordLink = require('./model/forgetPasswordModel')
const downloadExpense=require('./model/downloadExpenseModels')

const userRoute=require('./route/userRoute')
const expenseRoute=require('./route/expenseRoute')
const orderRoute=require('./route/orderRoute')
const premiumRoute=require('./route/premiumRoute')
const passwordRoute=require('./route/passwordRoute')

app.use(cors())
app.use(bodyParser.json())
app.use('/user',userRoute)
app.use('/expense',expenseRoute)
app.use('/purchase',orderRoute)
app.use('/premium',premiumRoute)
app.use('/password',passwordRoute)

user.hasMany(expense)
expense.belongsTo(user,{constraint:true,onDelete:'CASCADE'})

user.hasMany(order)
order.belongsTo(user,{constraint:true,onDelete:'CASCADE'})

user.hasMany(passwordLink)
passwordLink.belongsTo(user,{constraint:true,onDelete:'CASCADE'})

user.hasMany(downloadExpense)
downloadExpense.belongsTo(user,{constraint:true,onDelete:'CASCADE'})

sequelize.sync()
    .then(res=>{
        // console.log(res)
        app.listen(3000)
    })
    .catch(e=>console.log(e))