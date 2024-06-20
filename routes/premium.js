const express = require('express')
const route=express.Router()
const premiumController = require('../controllers/premium')

route.get('/showleaderboard',premiumController.showLeaderBoard)



module.exports=route