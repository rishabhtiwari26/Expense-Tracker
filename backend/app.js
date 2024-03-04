const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser=require('body-parser')
const sequelize  = require('./util/database')
// const user = require('./util/database')
const userRoute=require('./route/userRoute')
const expenseRoute=require('./route/expenseRoute')


app.use(cors())
app.use(bodyParser.json())
app.use('/user',userRoute)
app.use('/expense',expenseRoute)


sequelize.sync()
    .then(res=>{
        // console.log(res)
        app.listen(3000)
    })
    .catch(e=>console.log(e))