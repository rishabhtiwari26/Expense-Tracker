const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const ForgotPassword = require('../models/forget-password');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Sib = require('sib-api-v3-sdk');
const client = new Sib.TransactionalEmailsApi();

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const API_KEY = process.env.API_KEY;
client.apiClient.authentications['api-key'].apiKey = API_KEY;

const sender = {
    email: 'rtiwari1@ymail.com',
    name: 'rishabh'
};

function generateAccessToken(id, isactive) {
    return jwt.sign({ userid: id, isactive }, TOKEN_SECRET);
}

exports.forgetPassword = async (req, res, next) => {
    const newLink = uuidv4();

    try {
        const user = await User.findOne({ email: req.body.emailId });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const transaction = await ForgotPassword.startSession();
        transaction.startTransaction();

        try {
            await ForgotPassword.create(
                [{ linkid: newLink, userId: user._id }],
                { session: transaction }
            );

            await client.sendTransacEmail({
                sender,
                to: [{ email: req.body.emailId }],
                subject: 'OTP for password',
                textContent: `Please Click on the below link for resetting your password.
                http://localhost:3000/password/resetpassword/${newLink}`
            });

            await transaction.commitTransaction();
            res.status(201).send('Email sent');
        } catch (error) {
            await transaction.abortTransaction();
            console.error(error);
            res.status(500).send('Failed to send email');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to find user');
    }
};


exports.resetPassword = (req, res, next) => {
    const newLink = req.params.resetLink;

    ForgotPassword.findOne({ linkid: newLink })
        .then(foundLink => {
            if (!foundLink) {
                return res.status(404).send({ isActive: false, message: 'Link Not Found' });
            }

            if (!foundLink.isActive) {
                return res.status(403).send({ isActive: false, message: 'Link is not active' });
            }

            const newtoken = generateAccessToken(foundLink.userId, foundLink.isActive);

            foundLink.isActive = false;
            foundLink.save()
                .then(() => {
                    res.send(`<html>
                        <form>
                            <label for="newpassword">Enter New password</label>
                            <input name="newpassword" id='newpassword' type="password" required></input>
                            <button type='button' onclick=newf()>reset password</button>
                        </form>
                        <script>
                            function newf(){
                                const password=document.getElementById('newpassword').value
                                const url='http://localhost:3000/reset-password.htm?message=Reset%20your%20password"&token=${newtoken}&pass='+password
                                window.location.href= url
                            }
                        </script>
                    </html>`);
                })
                .catch(err => {
                    console.error('Error updating link status:', err);
                    res.status(500).send('Failed to update link status');
                });
        })
        .catch(err => {
            console.error('Error finding link:', err);
            res.status(500).send('Failed to find link');
        });
};

exports.newPassword = (req, res, next) => {
    const { token, newPassword } = req.body;
    const userIdStatus = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log('inside 2nd step of forget password')

    User.findById(userIdStatus.userid)
        .then(user => {

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            bcrypt.hash(newPassword, 10)
                .then(hash => {
                    user.password = hash;
                    return user.save();
                })
                .then(() => {
                    res.status(200).send({ message: 'Password updated successfully', success: true });
                })
                .catch(err => {
                    console.error('Error updating password:', err);
                    res.status(500).send({ message: 'Failed to update password' });
                });
        })
        .catch(err => {
            console.error('Error finding user:', err);
            res.status(500).send({ message: 'Failed to find user' });
        });
};
