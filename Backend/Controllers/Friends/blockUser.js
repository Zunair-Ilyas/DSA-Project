const User = require('../../Models/User');
const statusCode = require('http-status-codes');

const blockUser = async (req, res) => {
    const { blockerID, blockedID } = req.body;

    try {
        const blocker = await User.findById(blockerID);
        const blocked = await User.findById(blockedID);

        if (!blocker || !blocked) {
            return res.status(statusCode.NOT_FOUND).json({ message: 'User(s) not found.' });
        }

        // Add the blocked user to the blocker's blockedUsers list
        blocker.blockedUsers.push(blockedID);

        // Remove blocked user from the friend and request lists, if applicable
        blocker.friends.pull(blockedID)
        blocked.friends.pull(blockerID)

        blocker.friendRequestsSent.pull(blockedID)
        blocked.friendRequestsReceived.pull(blockerID)

        await blocker.save();
        await blocked.save();

        res.status(statusCode.OK).json({ message: 'User blocked successfully.' });
    } catch (e) {

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: e.message });
    }
};

module.exports = blockUser;
