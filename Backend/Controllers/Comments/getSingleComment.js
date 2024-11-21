const Comment = require('../../Models/Comment');
const User = require('../../Models/User');
const statusCodes = require('http-status-codes');

const getComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId)
            .populate('user', 'userName fullName')

        if (!comment) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Comment not found' });
        }

        return res.status(statusCodes.OK).json(comment);
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

module.exports = getComment;
