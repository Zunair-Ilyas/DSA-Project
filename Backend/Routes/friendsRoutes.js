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
const getAllUsers = require('../Controllers/Friends/getAllUsers')
const getMutualsSuggestions = require('../Controllers/Friends/getMutual&Suggestions')

router.route('/register').post(createUser);
router.route('/send-request').post(SendFriendRequest)
router.route('/accept-request').post(acceptFriendRequest)
router.route('/reject-request').post(rejectFriendRequest)
router.route('/unfriend-request').post(unfriendUser)
router.route('/block-request').post(blockUser)
router.route('/unblock-request').post(unblockUser)
router.route('/:userID').post(getFriendRequests)
router.route('/allUsers').get(getAllUsers)
router.route('/receive-data').post(getMutualsSuggestions);

module.exports = router;