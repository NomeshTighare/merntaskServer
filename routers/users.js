
const sendEmail = require("../email");
const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js");
const crypto =  require("crypto")
const jwt = require("jsonwebtoken");
const { json } = require("express");
const { checkToken } = require("../middleware/jwt");
const Token = require("../models/token");


//register

router.post("/register", async (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobile_no: req.body.mobile_no,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    });
    try {
        const savedUser = await newUser.save();
        let token = await new Token({
         userId: savedUser._id,
         token: crypto.randomBytes(32).toString("hex"),
       }).save();
   
       const message = `http://localhost:8000/api/users/verify/${savedUser._id}/${token.token}`;
       await sendEmail(savedUser.email, "Verify Email", message);
        res.send({
            status: true,
            data: {newUser,},
            message: "Register successfully !! The verification link sent to your email address please verify !!"
        })
        return
    } catch (err) {
        return res.send({
            status: false,
            message: err.message
        })
        // res.status(500).json(err);
    }
});

router.get("/verify/:id/:token", async (req, res) => {
   try {
     const user = await User.findOne({ _id: req.params.id });
     if (!user) return res.status(400).send("Invalid link");
 
     const token = await Token.findOne({
       userId: user._id,
       token: req.params.token,
     });
     if (!token) return res.status(400).send("Invalid link");
 
     await User.findByIdAndUpdate(user._id,{ verified: true} );
     await Token.findByIdAndRemove(token._id);
 
     res.send("email verified sucessfully");
   } catch (error) {
     res.status(400).send(error.message);
   }
 });
 

//LOGIN

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(!user) {
         return res.status(200).send({
            status: false,
            message:"Wrong Credentials !!"
           });
        } 

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if(OriginalPassword !== req.body.password){
         return res.status(200).send({
            status: false,
            message:"Wrong Credentials !!"
           });
        }
        if(!user.verified){
            return res.status(200).send({
               status: false,
               message:"User not verified !! Please verify email"
            })
        }
            const accessToken = jwt.sign(
                {
                  id: user._id
                },
                process.env.JWT_SEC,
                {expiresIn:"3d"}
              );
          

        const { password, ...others } = user._doc;

        // res.status(200).json({ ...others, accessToken });
        res.send({
            status: true,
            accessToken,
            ...others,
            message: "Login successfully"
           
        });
    } catch (err) {
        res.status(500).json(err);
    }
   
});

router.get("/getProfile", checkToken , async (req, res) =>{
    const id = req.user.id 
    const user = await User.findById(id);
    return res.send({
      status:  true,
      data : user,
      message:"Profile Fetch Successfull !!"
    })
})


module.exports = router;