const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verify_token");
const { getUserProfileData, setUserProfileData } = require("../controllers/user");
require('dotenv').config()

router.route('/getProfileData').post(verifyToken, getUserProfileData);
router.route('/setProfileData').post(verifyToken, setUserProfileData)
module.exports = router;