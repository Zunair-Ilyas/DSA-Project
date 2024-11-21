const express = require('express');
const User = require('../../Models/User');
const statusCode = require('http-status-codes');

const rejectFriendRequest = async (req, res) => {
    const { senderID, receiverID } = req.body;

    try {
        const sender = await User.findById(senderID);
        const receiver = await User.findById(receiverID);

        if (!sender || !receiver) {
            return res.status(statusCode.NOT_FOUND).json({ message: 'User(s) not found.' });
        }

        if (!receiver.friendRequestsReceived.includes(senderID)) {
            return res.status(statusCode.BAD_REQUEST).json({ message: 'No friend request from this user.' });
        }

        receiver.friendRequestsReceived.pull(senderID)

        sender.friendRequestsSent.pull(receiverID)

        await sender.save();
        await receiver.save();

        res.status(statusCode.OK).json({ message: 'Friend request rejected successfully.' });
    } catch (e) {
        console.error(e);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: e.message });
    }
};

module.exports = rejectFriendRequest;
