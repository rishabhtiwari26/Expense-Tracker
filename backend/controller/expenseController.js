const expense = require('../model/expenseModel')
const jwt =require('jsonwebtoken')
const user = require('../model/userModel')
const sequelize = require('../util/database')
function decodedId(token){
    return jwt.verify(token,'jkasdhakjbdwjk2kj2oieu2eu2ej2ue92')
}

exports.getExpense=(req,res,next)=>{
    console.log(req.headers.authorization)
    const userId=decodedId(req.headers.authorization).userid
    // console.log('userId',userId)
    
    expense.findAll({where:{userDetailId:userId}})
        .then(expenses=>{
            // console.log(expenses)
            res.send(expenses)
        })
        .catch(err=>console.log(err))
}

exports.addExpense=async(req,res,next)=>{
    const t= await sequelize.transaction()
    try{
        // console.log(req.body,decodedId(req.headers.authorization),t)
        const newExpense=await expense.create({
        expenseAmount:req.body.amount,
        description:req.body.description,
        category:req.body.cat,
        userDetailId:decodedId(req.headers.authorization).userid
    },{transaction:t})
        const newUser= await user.findByPk(decodedId(req.headers.authorization).userid)
        const updatedUser= await newUser.update({
            totalAmount:newUser.totalAmount+parseFloat(req.body.amount)
        },{
            transaction:t
        })
        // console.log(updatedUser,'updatedUser')
        if (updatedUser[0] === 0) {
            throw new Error("No rows were updated");
        }
        await t.commit()
    }catch(err){
        console.log('newError',err)
        await t.rollback()
    }}
exports.deleteExpense=async (req,res,next)=>{
    const t= await sequelize.transaction()
    try{
        const expenseFound=await expense.findByPk(req.body.id)
        // console.log(req.headers,re   q.body,decodedId(req.body.token))
        const newUser= await user.findByPk(decodedId(req.body.token).userid)
        const updatedUser= await newUser.update({
            totalAmount:newUser.totalAmount-parseFloat(expenseFound.expenseAmount)
        },{
            transaction:t
        })
        await expenseFound.destroy({transaction:t})
        if (updatedUser[0] === 0) {
            throw new Error("No rows were updated");
        }
        await t.commit()
        res.status(200).send({success:true,message:'Expense Deleted'})
    }catch(err){
        console.log(err)
        await t.rollback()
        res.status(401).send({success:false,message:'Rolled back'})
    }

}