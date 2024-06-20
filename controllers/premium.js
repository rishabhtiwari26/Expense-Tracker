const User = require('../models/user');

exports.showLeaderBoard = async (req, res, next) => {
    try {
        const users = await User.find({})
            .select('name totalAmount')
            .sort({ totalAmount: -1 });

        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
};
