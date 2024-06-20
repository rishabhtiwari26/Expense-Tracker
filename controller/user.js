const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(id, ispremiumuser) {
    return jwt.sign({ userid: id, ispremiumuser }, process.env.TOKEN_SECRET);
}

exports.signUp = (req, res, next) => {
    const saltRounds = 10;
    const { name, email, password } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error encrypting password');
        }

        const newUser = new User({
            name: name,
            email: email,
            password: hash
        });
        newUser.save()
            .then(user => {
                res.send('User Signed-Up');
            })
            .catch(e => {
                if (e.code === 11000) { 
                    console.log('Email already exists');
                    res.send('Email already exists');
                } else {
                    console.log(e);
                    res.send('Something went wrong');
                }
            });
    });
};
exports.login = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error comparing passwords');
                }

                if (result) {
                    const token = generateAccessToken(user._id, user.ispremiumuser);
                    res.status(200).send({
                        success: true,
                        message: 'User Login successfully',
                        redirectUrl: '/expense/add-expense',
                        token: token
                    });
                } else {
                    res.status(401).send({ success: false, message: 'Password does not match' });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Something went wrong');
        });
};

