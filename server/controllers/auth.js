const admin = require("../firebase_admin")
const { sendOTP } = require("../utils/otp");
const { verifyOTP } = require("../utils/otp");
const generateToken = require("../utils/generate_token");
const db = admin.firestore();

exports.sendLoginOTP = async (req, res) =>{
    // Retrieve email param
    const toEmail = req.body.email

    const emailMessage = "Please use the below OTP code to complete your account setup on My App";
    const emailSubject = "OTP to complete your login process";
    const result = await sendOTP(toEmail,emailSubject, emailMessage);

    return res.json(result);

}

exports.verifyLoginOTP = async(req, res) => {
    const { email, otp } = req.body

    const result = await verifyOTP(email, otp);

    if(result.status==="success"){ // check if the otp was even verified or not
        const user = { // create user object
            name:result.name,
            email:email
        };

        result.user = user; // set user object to share
        result.token = generateToken(email);
    }

    console.log(result);
    return res.json(result);

}

exports.sendRegisterOTP = async(req, res) => {
    const {email, name} = req.body;
    const emailSubject = "OTP to complete your registration process";
    const emailMessage = "Please use the below OTP code to complete your account setup on My App"

    // check if the user already exists
    const db = admin.firestore();

    const status = await db.collection('users').doc(email).get();
    if(status.exists) {
        console.log("User Exists Already!!");
        return {
            status : "failed",
            message : "user already registererd!"
        }
    }

    await db.collection('users').doc(email).set({ // add to db if not exists
        email:email,
        name:name,
        status:0
    });

    const result = await sendOTP(email, emailSubject, emailMessage);

    return res.json(result);

}

exports.verifyRegisterOTP = async(req, res) => {
    const {email, otp} = req.body;

    // check if the user already exists
    const db = admin.firestore();
    const snapshot = await db.collection("users").doc(email).get();
    const data = snapshot.data();

    if(snapshot.exists && data.status==1){ // email exists and verified
        return res.json({
            status:"failed",
            message:"User already registered and verified. Please login instead."
        })
    }

    await db.collection('users').doc(email).set({ // add to db if not exists
        email:email,
        status:1
    });

    const result = verifyOTP(email, otp);

    return res.json(result);
}