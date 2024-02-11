const admin = require("../firebase_admin")

exports.getUserProfileData = async (req, res) => {

    const {email} = req.body;
    try{
        console.log(email)
        const db = admin.firestore();
        const snapshot = await db.collection('users').doc(email).get();
        // console.log(snapshot.data());
        const data = snapshot.data();
        
        const profileData = {
            'name':data.name,
            'university':data.university,
            'about':data.about
        }
        console.log(data)
        console.log(profileData)

        return res.json({
            status:'success',
            profileData:profileData,
            message:'User profile data fetch successful'
        })
    }catch(err){
        console.log(err)
        return res.json({
            status:'failed',
            message:"Something went wrong while fetching data"
        })
    }

}

exports.setUserProfileData = async (req, res) =>{
    const {email,name, university,about } = req.body;
    console.log(email,name,university,about);
    try{
        const db = admin.firestore();
        await db.collection('users').doc(email).update({
            name:name,
            university:university,
            about:about
        });
        return res.json({status:'success', message:"Profile Updated Successfully."})
    }catch(err){
        return res.json({
            status:'failed',
            message:'Something went wrong while updating data'
        })
    }
}