const expense = require('../model/expenseModel')
const jwt =require('jsonwebtoken')
function decodedId(token){
    return jwt.verify(token,'jkasdhakjbdwjk2kj2oieu2eu2ej2ue92')
}

exports.getExpense=(req,res,next)=>{
    console.log(req.headers.authorization)
    const userId=decodedId(req.headers.authorization).userid
    console.log('userId',userId)
    
    expense.findAll({where:{userDetailId:userId}})
        .then(expenses=>{
            // console.log(expenses)
            res.send(expenses)
        })
        .catch(err=>console.log(err))
}

exports.addExpense=(req,res,next)=>{
    try{console.log(req.body,decodedId(req.headers.authorization))
        expense.create({
        expenseAmount:req.body.amount,
        description:req.body.description,
        category:req.body.cat,
        userDetailId:decodedId(req.headers.authorization).userid
    }).then(expenseDetail=>{
        console.log('Expense Created')
        res.send(expenseDetail)
    }).catch(err=>console.log(err))}
    catch(e){
        throw new Error(e)
    }
}
exports.deleteExpense=(req,res,next)=>{
    
    
    console.log(req.body)
    expense.findByPk(req.body.id).then(expenseFound=>{
        if(decodedId(req.body.token).userid==expenseFound.userDetailId){
            expenseFound.destroy()
            res.status(200).send({success:true,message:'Expense Deleted'})
        }
        else{
            res.status(401).send({success:false,message:'Not Your Expense'})
        }

        
    })
    .catch(e=>console.log(e))
}