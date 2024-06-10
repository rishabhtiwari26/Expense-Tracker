const express = require('express')
const route=express.Router()
const premiumController = require('../controller/premium')

route.get('/showleaderboard',premiumController.showLeaderBoard)



module.exports=route