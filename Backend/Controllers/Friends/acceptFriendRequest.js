const express = require('express');
const User = require('../../Models/User');
const statusCode = require('http-status-codes');

const acceptFriendRequest = async (req, res) => {
    const { senderID, receiverID } = req.body;

    try {
        const sender = await User.findById(senderID);
        const receiver = await User.findById(receiverID);

        if (!sender || !receiver) {
            return res.status(statusCode.NOT_FOUND).json({ message: 'User(s) not found.' });
        }

        // Block check
        if (receiver.blockedUsers.includes(senderID)) {
            return res.status(statusCode.FORBIDDEN).json({ message: 'You are blocked by this user and cannot accept their friend request.' });
        }

        if (sender.blockedUsers.includes(receiverID)) {
            return res.status(statusCode.FORBIDDEN).json({ message: 'You have blocked this user and cannot accept their friend request.' });
        }

        // Check if the users are already friends
        if (sender.friends.includes(receiverID) || receiver.friends.includes(senderID)) {
            return res.status(statusCode.BAD_REQUEST).json({ message: 'You are already friends.' });
        }

        // Check if the friend request exists
        if (!receiver.friendRequestsReceived.includes(senderID)) {
            return res.status(statusCode.BAD_REQUEST).json({ message: 'No friend request from this user.' });
        }

        // Add friends to both users
        sender.friends.push(receiverID);
        receiver.friends.push(senderID);

        // Remove the friend request from both users' arrays
        sender.friendRequestsSent.pull(receiverID);
        sender.friendRequestsReceived.pull(receiverID);
        receiver.friendRequestsReceived.pull(senderID);
        receiver.friendRequestsSent.pull(senderID);

        // Save the updated data
        await sender.save();
        await receiver.save();

        // Respond with success
        res.status(statusCode.CREATED).json({ message: 'Friend request accepted successfully.' });
    } catch (e) {
        console.error(e);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: e.message });
    }
};

module.exports = acceptFriendRequest;
