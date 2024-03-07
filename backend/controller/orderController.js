const order = require('../model/orderModel')
const Razorpay = require('razorpay')
const user=require('../model/userModel')
const jwt =require('jsonwebtoken')
function generateAccessToken(id,ispremiumuser){
    return jwt.sign({userid:id,ispremiumuser},'jkasdhakjbdwjk2kj2oieu2eu2ej2ue92')
}
function decodedId(token){
    return jwt.verify(token,'jkasdhakjbdwjk2kj2oieu2eu2ej2ue92')
}

exports.purchaseMembership=(req,res,next)=>{
    try{
        // console.log(req.user,req.body)
        let rzp=new Razorpay({
            key_id:'rzp_test_KFINKLK6tJLxP8',
            key_secret:'t7fsZ4SMqOKYSclA8xnhMyCe'
        })
        const amount=2500
        rzp.orders.create({amount,currency:'INR'},(err,order)=>{
            if(err){
                console.log(err)
                throw new Error(err)
            }
            console.log('inside')
            console.log(req.headers)
            user.findOne({where:{id:decodedId(req.headers.authorization).userid}})
                .then(user=>{
                    user.createOrder({orderid:order.id,status:'pending'})
                        .then(()=>{
                            res.status(201).json({order,key_id:rzp.key_id})
                        })
                        .catch(e=>{
                            throw new Error(e)
                        })
                })
        })
    }catch(e){
        console.log(e)
    }

}

exports.updateMembership=(req,res,next)=>{
    try{
        console.log('inside updatemembership')
        const {order_id,payment_id}=req.body
        // console.log(order_id,payment_id)
        order.findOne({where:{orderid:order_id}})
            .then(order=>{
                order.update({paymentid:payment_id,status:'SUCCESSFUL'}).then(()=>{
                    user.findOne({where:{id:decodedId(req.headers.authorization).userid}})
                    .then((user)=>{
                        user.update({ispremiumuser:true}).then(()=>{
                            return res.status(202).json({sucess:true,message:'Transaction Successful',token:generateAccessToken(user.id,user.ispremiumuser)})
                        }).catch(e=>{
                            throw new Error(e)
                        })
                        
                    }).catch(e=>{
                        throw new Error(e)
                    })
                    
                }).catch(e=>{
                    throw new Error(e)
                })
            }).catch(e=>{
                throw new Error(e)
            })
           
    }catch(e){
        console.log('inside updatemembership catch')
        console.log(e)
    }
}