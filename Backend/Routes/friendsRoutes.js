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
const {getMutualFriendsController, getFriendSuggestionsController} = require("../Controllers/Friends/getMutual&Suggestions");
const getUser = require('../Controllers/Friends/getUser')
const getFriends = require('../Controllers/Friends/getFriends')
const login = require('../Controllers/Friends/login')
const updateUser = require('../Controllers/Friends/updateUser')

router.route('/register').post(createUser);
router.route('/send-request').post(SendFriendRequest)
router.route('/accept-request').post(acceptFriendRequest)
router.route('/reject-request').post(rejectFriendRequest)
router.route('/unfriend-request').post(unfriendUser)
router.route('/block-request').post(blockUser)
router.route('/unblock-request').post(unblockUser)
router.route('/:userID').post(getFriendRequests)
router.route('/allUsers').get(getAllUsers)
router.route('/mutual-friends/:userId1/:userId2').get(getMutualFriendsController);
router.route('/friend-suggestions/:userId').get(getFriendSuggestionsController);
router.route('/getUser/:userID').get(getUser)
router.route('/getFriends/:userID').get(getFriends)
router.route('/login').get(login)
router.route('/updateUser/:userID').put(updateUser)

module.exports = router;