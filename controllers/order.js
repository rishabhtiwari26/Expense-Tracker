const Order = require('../models/order');
const User = require('../models/user');
const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

function generateAccessToken(id, ispremiumuser) {
    return jwt.sign({ userid: id, ispremiumuser }, process.env.TOKEN_SECRET);
}

function decodedId(token) {
    return jwt.verify(token, process.env.TOKEN_SECRET);
}

exports.purchaseMembership = (req, res, next) => {
    try {
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 2500;
        rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
            console.log('inside');
            try {
                const userId = decodedId(req.headers.authorization).userid;
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                const newOrder = new Order({
                    orderid: order.id,
                    status: 'pending',
                    userId: userId
                });
                await newOrder.save();
                res.status(201).json({ order, key_id: rzp.key_id });
            } catch (e) {
                console.log(e);
                throw new Error(e);
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
};

exports.updateMembership = async (req, res, next) => {
    try {
        const { order_id, payment_id } = req.body;
        const userId = decodedId(req.headers.authorization).userid;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const reqUser = await User.findById(userId).session(session);
            const newOrder = await Order.findOneAndUpdate(
                { orderid: order_id },
                { paymentid: payment_id, status: 'SUCCESSFUL' },
                { new: true, session }
            );

            await reqUser.updateOne({ ispremiumuser: true }, { session });

            await session.commitTransaction();

            res.status(202).json({
                success: true,
                message: 'Transaction Successful',
                token: generateAccessToken(reqUser.id, reqUser.ispremiumuser)
            });
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    } catch (e) {
        console.log('transaction failed', e);
        res.status(500).json({ success: false, message: 'Transaction Failed' });
    }
};
