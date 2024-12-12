const User = require('../../Models/User');

// Controller to get a user's friends
const getFriends = async (req, res) => {
    const { userID } = req.params;

    try {
        const user = await User.findById(userID).populate('friends', 'fullName userName bio profilePic'); // Populate only necessary fields

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.friends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getFriends
