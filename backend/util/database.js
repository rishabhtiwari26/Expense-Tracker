const Sequelize = require('sequelize')
const sequelize = new Sequelize('expense-tracker-nodeproject','root','sean90',{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize