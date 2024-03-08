const Sib = require('sib-api-v3-sdk');
require('dotenv').config()

const client=Sib.ApiClient.instance
const apiKey=client.authentications['api-key']
apiKey.apiKey=process.env.API_KEY



exports.forgetPassword=(req,res,next)=>{
    console.log(req.body.emailId)
    const tranEmailApi=new Sib.TransactionalEmailsApi()
    const sender={
        email:'rtiwari1@ymail.com'
    }
    const receiver=[
        {
            email:req.body.emailId
        },
        {
            email:'rtiwari0726@gmail.com'
        }
    ]
    tranEmailApi.sendTransacEmail({
        sender,
        to:receiver,
        Subject: 'OTP for password',
        textContent:'Please put below OTP for reseting your password.'
    }).then(console.log)
    .catch(console.log)
}