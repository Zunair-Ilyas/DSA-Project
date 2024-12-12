const SocialGraph = require('../Util/Graph')
const User = require("../Models/User");

const getGraphData = async () => {
    const users = await User.find({}, '_id friends').populate('friends', '_id');
    const graph = new SocialGraph();

    users.forEach(user => {
        graph.addNode(user._id.toString());
        user.friends.forEach(friend =>
            graph.addEdge(user._id.toString(), friend._id.toString())
        );
    });

    return graph;
};

const getMutualFriends = async (userId1, userId2) => {
    const graph = await getGraphData();
    return graph.getMutualFriends(userId1, userId2);
};

const getFriendSuggestions = async (userId) => {
    const graph = await getGraphData();

    // Calculate popularity scores (example: number of friends)
    const popularityScores = {};
    const users = await User.find({}, '_id friends');
    users.forEach(user => {
        popularityScores[user._id.toString()] = user.friends.length;
    });

    return graph.getFriendSuggestions(userId, popularityScores);
};


module.exports = {getMutualFriends, getFriendSuggestions};