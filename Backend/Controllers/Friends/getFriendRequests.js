const User = require('../../Models/User');
const statusCodes = require('http-status-codes');

const getFriendRequests = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by their ID
        const user = await User.findById(userId)
            .populate('friendRequestsSent', 'userName fullName')
            .populate('friendRequestsReceived', 'userName fullName');

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        return res.status(statusCodes.OK).json({
            friendRequestsSent: user.friendRequestsSent,
            friendRequestsReceived: user.friendRequestsReceived,
        });
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

module.exports = getFriendRequests;
