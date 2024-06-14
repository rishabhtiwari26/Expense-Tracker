const User = require('../model/user');
const Expense = require('../model/expense');
const Download = require('../model/download-expense');

const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

function decodedId(token) {
    return jwt.verify(token, process.env.TOKEN_SECRET);
}

async function uploadToS3(data, filename) {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log(err, 'something went wrong in aws');
                reject(err);
            } else {
                console.log('success', s3response);
                resolve(s3response.Location);
            }
        });
    });
}

exports.downloadExpense = async (req, res, next) => {
    try {
        const reqUser = decodedId(req.headers.authorization).userid;
        const user = await User.findById(reqUser);
        const foundExpenses = await Expense.find({ userId: reqUser });

        const stringifiedData = JSON.stringify(foundExpenses);
        const fileName = `${user.id}Expense${new Date()}.txt`;
        const fileURL = await uploadToS3(stringifiedData, fileName);

        await Download.create({ linkURL: fileURL, userId: user.id });

        res.status(200).send({ fileURL, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send({ fileURL: '', success: false, err: err });
    }
};

exports.getExpense = async (req, res, next) => {
    try {
        const expensePerPage = Number(req.headers.rowsperpage);
        const userId = decodedId(req.headers.authorization).userid;
        const page = Number(req.query.page);

        const total = await Expense.countDocuments({ userId: userId });
        const expenses = await Expense.find({ userId: userId })
            .skip((page - 1) * expensePerPage)
            .limit(expensePerPage);

        res.send({
            expenses,
            currentPage: page,
            hasNextPage: page * expensePerPage < total,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            totalPage: Math.ceil(total / expensePerPage)
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong');
    }
};

exports.addExpense = async (req, res, next) => {
    try {
        const { amount, description, cat } = req.body;
        const userId = decodedId(req.headers.authorization).userid;

        const newExpense = new Expense({
            expenseAmount: amount,
            description: description,
            category: cat,
            userId: userId
        });

        await newExpense.save();

        const user = await User.findById(userId);
        user.totalAmount += parseFloat(amount);
        await user.save();

        res.status(201).send('Expense added successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong');
    }
};

function decodedId(token) {
    return jwt.verify(token, process.env.TOKEN_SECRET);
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.body;
        const userId = decodedId(req.body.token).userid;

        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).send({ success: false, message: 'Expense not found' });
        }

        const user = await User.findById(userId);
        user.totalAmount -= parseFloat(expense.expenseAmount);
        await user.save();

        await expense.remove();

        res.status(200).send({ success: true, message: 'Expense Deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: 'Rolled back' });
    }
};