const express = require('express');
const User = require('../../Models/User');
const statusCode = require('http-status-codes');

const unblockUser = async (req, res) => {
    const { blockerID, blockedID } = req.body;

    try {
        const blocker = await User.findById(blockerID);
        const blocked = await User.findById(blockedID);

        if (!blocker || !blocked) {
            return res.status(statusCode.NOT_FOUND).json({ message: 'User(s) not found.' });
        }

        blocker.blockedUsers.pull(blockedID)

        await blocker.save();

        res.status(statusCode.OK).json({ message: 'User unblocked successfully.' });
    } catch (e) {
        console.error(e);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: e.message });
    }
};

module.exports = unblockUser;
