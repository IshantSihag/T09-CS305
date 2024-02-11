const admin = require("../firebase_admin")
const { sendOTP } = require("./auth")

exports.register = async(req, res) =>{
    const db = admin.firestore()

    const email = req.body.email
    const name = req.body.name

    try {

        const snapshot = await db.collection("users").doc(email).get()
        const data = snapshot.data()
        if (snapshot.exists) { // if email exists in db
            if(data?.status == 1){
                return res.status(403).json({
                    status: "failed",
                    message: "A verified user with this email already exists!"
                })
            }else{
                return res.status(401).json({
                    status:"failed",
                    message:"Please verify OTP first"
                })
            }
        }
        
        sendOTP()

        await db.collection("users").doc(email).set({
            email: email,
            name: name,
            status: 0
        })

        return res.status(201).json({
            status: "success",
            message: "User registered successfully but verification is pending!"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}