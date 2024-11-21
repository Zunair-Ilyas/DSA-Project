const Comment = require('../../Models/Comment');
const User = require('../../Models/User');
const statusCodes = require('http-status-codes');

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.userId;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Comment not found' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'User not found' });
        }

        if (comment.user.toString() !== userId && user.role !== 'admin') {
            return res.status(statusCodes.FORBIDDEN).json({ message: 'You are not authorized to delete this comment' });
        }

        await comment.remove();

        return res.status(statusCodes.NO_CONTENT).json({ message: 'Comment deleted successfully' });
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

module.exports = deleteComment;
