const express = require('express');
const Post = require('../../Models/Post');
const User = require('../../Models/User');
const statusCodes = require('http-status-codes');

const createPost = async (req, res) => {
    const { content, media, userID, isPublic } = req.body;

    try {
        const user = await User.findById(userID)
        if (!user) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: 'User ID is required' });
        }

        const post = await Post.create({
            content,
            media,
            user: userID,
            isPublic,
        });

        user.posts = [...user.posts, post._id]

        await user.save()

        return res.status(statusCodes.CREATED).json({ message: 'Post created successfully', post });
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

module.exports = createPost;
