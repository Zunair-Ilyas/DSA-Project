const User = require('../../Models/User');
const {getMutualFriends, getFriendSuggestions} = require("../../Util/GraphBuilder");


exports.getMutualFriendsController = async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;
        const mutualFriends = await getMutualFriends(userId1, userId2);

        return res.status(200).json({ mutualFriends });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.getFriendSuggestionsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const suggestions = await getFriendSuggestions(userId);

        return res.status(200).json({ suggestions });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};
