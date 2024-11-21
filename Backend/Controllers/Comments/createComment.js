const Comment = require('../../Models/Comment');
const Post = require('../../Models/Post');
const statusCodes = require('http-status-codes');

const createComment = async (req, res) => {
    const { text, userID, postID } = req.body;

    try {
        const foundPost = await Post.findById(postID);

        if (!foundPost) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Post not found' });
        }

        const newComment = new Comment.create({
            text,
            userID,
            postID,
        });

        return res.status(statusCodes.CREATED).json(newComment);
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

module.exports = createComment;
