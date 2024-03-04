const expense = require('../model/expenseModel')

exports.getExpense=(req,res,next)=>{
    expense.findAll()
        .then(expenses=>{
            // console.log(expenses)
            res.send(expenses)
        })
        .catch(err=>console.log(err))
}

exports.addExpense=(req,res,next)=>{
    try{console.log(req.body)
        expense.create({
        expenseAmount:req.body.amount,
        description:req.body.description,
        category:req.body.cat
    }).then(expenseDetail=>{
        console.log('Expense Created')
        res.send(expenseDetail)
    }).catch(err=>console.log(err))}
    catch(e){
        throw new Error(e)
    }
}
exports.deleteExpense=(req,res,next)=>{
    const id = req.body.id
    console.log(req.body)
    expense.findByPk(id).then(expenseFound=>{
        res.send(expenseFound)
        expenseFound.destroy()
    })
    .catch(e=>console.log(e))
}