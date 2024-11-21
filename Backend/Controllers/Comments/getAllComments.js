const Comment = require('../../Models/Comment');
const User = require('../../Models/User');
const statusCodes = require('http-status-codes');

const getAllComments = async (req, res) => {
    const { postId } = req.params;

    try {
        // Find all comments related to a specific post
        const comments = await Comment.find({ post: postId })
            .populate('user', 'userName fullName')
            .populate('replies', 'text user');

        return res.status(statusCodes.OK).json(comments);
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

module.exports = getAllComments;
