const User = require('../../Models/User');

// Controller to get a user's friends
const getFriends = async (req, res) => {
    const { userID } = req.params; // Get userID from the URL parameter

    try {
        // Find the user by userID and populate the friends field with their friend data
        const user = await User.findById(userID).populate('friends', 'fullName userName bio profilePic'); // Populate only necessary fields

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the list of friends
        res.status(200).json(user.friends); // Assuming `friends` is an array of user objects
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getFriends
