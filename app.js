const express = require('express')
const dotenv=require('dotenv');
dotenv.config()

const cors = require('cors')
const app = express()
const bodyParser=require('body-parser')
const fs=require('fs')
const path=require('path')

const user = require('./models/user')
const expense = require('./models/expense')
const order=require('./models/order')
const passwordLink = require('./models/forget-password')
const downloadExpense = require('./models/download-expense')
const connectionDB = require('./utils/database');

const userRoute=require('./routes/user')
const expenseRoute=require('./routes/expense')
const orderRoute=require('./routes/order')
const premiumRoute=require('./routes/premium')
const passwordRoute=require('./routes/password')

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