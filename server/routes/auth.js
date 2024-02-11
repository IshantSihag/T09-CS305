const express = require("express");
const router = express.Router();
const { sendLoginOTP, verifyLoginOTP, sendRegisterOTP, verifyRegisterOTP } = require("../controllers/auth");
require('dotenv').config()

router.route('/sendLoginOtp').post(sendLoginOTP);

router.route('/verifyLoginOtp').post(verifyLoginOTP);

router.route('/sendRegisterOtp').post(sendRegisterOTP);

router.route('/verifyRegisterOtp').post(verifyRegisterOTP);

module.exports = router;