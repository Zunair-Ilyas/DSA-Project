const User = require('../../Models/User');
const statusCodes = require('http-status-codes');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('_id').populate('friends', '_id')    // Populate 'friends' with only '_id'

        console.log(users);
        res.status(200).json(users);
    } catch (e) {
        console.error(e);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message || 'An error occurred' });
    }
}

module.exports = getAllUsers;
