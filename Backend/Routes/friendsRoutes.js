const express = require('express');
const router = express.Router();

const createUser = require('../Controllers/Friends/createUser')
const SendFriendRequest = require('../Controllers/Friends/sendFriendRequest')
const acceptFriendRequest = require('../Controllers/Friends/acceptFriendRequest')
const rejectFriendRequest = require('../Controllers/Friends/rejectFriendRequest')
const unfriendUser = require('../Controllers/Friends/unfriendUser')
const blockUser = require('../Controllers/Friends/blockUser')
const unblockUser = require('../Controllers/Friends/unblockUser')
const getFriendRequests = require('../Controllers/Friends/getFriendRequests')

router.route('/register').post(createUser);
router.route('/send-request').post(SendFriendRequest)
router.route('/accept-request').post(acceptFriendRequest)
router.route('/reject-request').post(rejectFriendRequest)
router.route('/unfriend-request').post(unfriendUser)
router.route('/block-request').post(blockUser)
router.route('/unblock-request').post(unblockUser)
router.route('/:userID').post(getFriendRequests)

module.exports = router;