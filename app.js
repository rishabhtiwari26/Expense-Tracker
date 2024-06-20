const express = require('express')
const dotenv=require('dotenv');
dotenv.config()

const cors = require('cors')
const app = express()
const bodyParser=require('body-parser')
const fs=require('fs')
const path=require('path')

const user = require('./model/user')
const expense = require('./model/expense')
const order=require('./model/order')
const passwordLink = require('./model/forget-password')
const downloadExpense = require('./model/download-expense')
const connectionDB = require('./util/database');

const userRoute=require('./route/user')
const expenseRoute=require('./route/expense')
const orderRoute=require('./route/order')
const premiumRoute=require('./route/premium')
const passwordRoute=require('./route/password')

const accessLogStream=fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags:'a'})

app.use(cors())
app.use(bodyParser.json())



app.use('/user',userRoute)
app.use('/expense',expenseRoute)
app.use('/purchase',orderRoute)
app.use('/premium',premiumRoute)
app.use('/password',passwordRoute)
app.use('/reset-password.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reset-password.htm'));
});

app.use('/signup.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.htm'));
});
app.use('/login.htm', (req, res) => {
    console.log('inside login')
    res.sendFile(path.join(__dirname, 'views', 'login.htm'));
});
app.use('/forget-password.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'forget-password.htm'));
});
app.use('/reset-password.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reset-password.htm'));
});
app.use('/add-expense.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add-expense.htm'));
});

connectionDB()
    .then(result => {
        console.log('connection estlabish')
    app.listen(3000)
    }).catch(e => {
    console.log(e)
})