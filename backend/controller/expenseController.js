const expense = require('../model/expenseModel')
const jwt =require('jsonwebtoken')
function decodedId(token){
    return jwt.verify(token,'jkasdhakjbdwjk2kj2oieu2eu2ej2ue92')
}

exports.getExpense=(req,res,next)=>{
    expense.findAll()
        .then(expenses=>{
            // console.log(expenses)
            res.send(expenses)
        })
        .catch(err=>console.log(err))
}

exports.addExpense=(req,res,next)=>{
    try{console.log(req.body,decodedId(req.body.token))
        expense.create({
        expenseAmount:req.body.amount,
        description:req.body.description,
        category:req.body.cat,
        userDetailId:decodedId(req.body.token).userid
    }).then(expenseDetail=>{
        console.log('Expense Created')
        res.send(expenseDetail)
    }).catch(err=>console.log(err))}
    catch(e){
        throw new Error(e)
    }
}
exports.deleteExpense=(req,res,next)=>{
    const decodedId=jwt.verify(req.body.token,'jkasdhakjbdwjk2kj2oieu2eu2ej2ue92')
    console.log(decodedId)
    console.log(req.body)
    expense.findByPk(decodedId.userid).then(expenseFound=>{
        

        res.send(expenseFound)
        expenseFound.destroy()
    })
    .catch(e=>console.log(e))
}