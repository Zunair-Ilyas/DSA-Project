const express = require('express');
const Post = require('../../Models/Post');
const statusCodes = require('http-status-codes');
const mongoose = require('mongoose'); // Import mongoose

const getAllPosts = async (req, res) => {
    const { userID } = req.params;  // Use req.params to get userID from the route

    if (!userID) {
        return res.status(statusCodes.BAD_REQUEST).json({ message: 'User ID is required' });
    }

    try {
        // Find all posts
        const posts = await Post.find()
            .populate('user', 'fullName userName profilePicture')
            .select('content createdAt');

        // const filteredPosts = posts.filter(post => post.user._id.toString() !== new mongoose.Types.ObjectId(userID).toString());

        // console.log(filteredPosts);
        console.log(posts);
        // return res.status(statusCodes.OK).json(filteredPosts);
        return res.status(statusCodes.OK).json(posts);
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching posts" });
    }
};

module.exports = getAllPosts;
