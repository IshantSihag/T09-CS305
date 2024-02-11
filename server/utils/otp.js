const admin = require("../firebase_admin")
const otpGenerator = require('otp-generator')
const nodemailer = require("nodemailer");

exports.sendOTP = async(toEmail, emailSubject, emailMessage) =>{
    const db = admin.firestore();
    
    // Generate OTP code
    const code = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false, digits: true });

    // mail options object to send email
    let mailOptions = {
        from: process.env.CLIENT_USER,
        to: toEmail,
        subject: emailSubject,
        html: `<html> <h1>Hi,</h1> <br/><p style="color:grey; font-size:1.2em">${emailMessage}</p><br><br><h1 style="color:orange">${code}</h1></html>`
    };

    // Now try sending the otp email
    try {

        // 2 minutes
        var expiryDate = Date.now() + 180000

        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL, // your email address
            pass: process.env.PASS, // your email password
          },
        });

        console.log(`DATE: ${expiryDate}`)


        try {
            await transporter.sendMail(mailOptions)
            await db.collection("users").doc(toEmail).update({
                email: toEmail,
                otp: code,
                expiry: expiryDate
            })
            return {
                    status: "success",
                    message: "OTP has been sent to the provided email."
            }
        } catch (e) {
            return { 
                status: "failed", 
                message: "Unable to send email at the momment" 
            }
        }


    } catch (error) {
        return {
            status: "failed",
            message: `Unknown error occured:${error}`
        }
    }
}


exports.verifyOTP = async (email, otp) => {

    const db = admin.firestore()
    try {
        const snapshot = await db.collection("users").doc(email).get()
        if (!snapshot.exists) {
            return res.json({
                status: "failed",
                message: "Invalid email address"
            })
        }
        const data = snapshot.data()
        const expiry = data.expiry
        if (Date.now() > expiry) {
            return {
                status: "failed",
                message: "OTP expired. Please request for a new one"
            }
        }
        if (data.otp === otp) {

            return {
                status: "success",
                message: "OTP verified successfully",
                name: data.name
            }

        } else {
            return {
                status: "failed",
                message: "Invalid OTP"
            }
        }
    } catch (error) {
        return {
            status: "failed",
            message: `Unknown error occured:${error}`
        }
    }
}