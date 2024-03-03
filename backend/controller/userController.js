const User = require('../model/userModel')
let count=1
exports.signUp=(req,res,next)=>{
    console.log(count,req.body)
    count+=1
    User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
        .then(user=>{
            
            console.log('Signed-Up')
            res.send('User Signed-Up')
        })
        .catch(e=>{
            if(e.name==='SequelizeUniqueConstraintError'){
                console.log('Email already exists')
                res.send('Email already exists')
            }
            else{
                console.log(e)
                res.send('Something went wrong')
            }
        })
}