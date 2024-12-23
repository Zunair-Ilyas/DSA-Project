const express = require('express');
const Post = require('../../Models/Post')
const statusCodes = require('http-status-codes');

const getUserPosts = async (req, res) => {
    const { userID } = req.query;

    try {
        const query = userID ? {user: userID} : {};
        const posts = await Post.find(query).populate('user', 'fullName userName profilePicture').select('content createdAt');

        console.log(posts)
        return res.status(statusCodes.OK).json(posts);
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
}

module.exports = getUserPosts;
