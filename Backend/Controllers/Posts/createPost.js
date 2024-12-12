const mongoose = require('mongoose');
const statusCodes = require('http-status-codes');
const User = require('../../Models/User');
const Post = require('../../Models/Post');

const createPost = async (req, res) => {
    const { content, media, userID, isPublic } = req.body;

    try {
        // Validate the userID before using it
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: 'Invalid User ID' });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: 'User not found' });
        }

        // Create the post
        const post = await Post.create({
            content,
            media,
            user: userID,  // This should be a valid ObjectId
            isPublic,
        });

        // Add the post ID to the user's posts array
        user.posts = [...user.posts, post._id];
        await user.save();

        return res.status(statusCodes.CREATED).json({ message: 'Post created successfully', post });
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

module.exports = createPost;
