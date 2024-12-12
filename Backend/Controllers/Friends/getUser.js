const User = require('../../Models/User');
const statusCodes = require('http-status-codes');

const getUser = async (req, res) => {
    const { userID } = req.params; // Extract userID from request parameters
    try {
        // Use findById to retrieve the user by their ID
        const user = await User.findById(userID);

        if (!user) {
            // Handle case where user is not found
            return res.status(statusCodes.NOT_FOUND).json({ message: 'User not found' });
        }

        console.log(user);
        res.status(statusCodes.OK).json(user);
    } catch (e) {
        console.error(e);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message || 'An error occurred' });
    }
};

module.exports = getUser;
