const User = require('../model/userModel')
let count=1
exports.signUp=(req,res,next)=>{
    // console.log(count,req.body)
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

exports.login=(req,res,next)=>{
    // console.log(req.body)
    User.findOne({where:{email:req.body.email}})
        .then(user=>{
            if(user){
                // console.log(user)
                console.log('user.password',typeof(user.password),user.password,'req.body.password',typeof(req.body.password),req.body.password)
                if(user.password===req.body.password){
                    res.status(200).send({success:true,message:'User Login successfully'})
                }
                else{
                    res.status(404).send({success:false,message:'Password do not match'})
                }
            }
            else{ 
                res.status(404).send({success:false,message:'User not found'})
            }
        })
}