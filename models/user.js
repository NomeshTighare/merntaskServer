
const mongoose = require("mongoose");
const jwt = require ("jsonwebtoken");
const Joi = require ("joi");
const passwordComplexity = require ("joi-password-complexity");
const userSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    mobile_no: {type: String, required:true}
});
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this.id}, process.env.JWTPRIVATEKEY, {expiresln:"7d"})
    return token
};

const User = mongoose.model('user',userSchema); 

const validate = (data) => {
    const schema = Joi.object({
        firstName : Joi.string().required().label("First Name"),
        lastName : Joi.string().required().label("last Name"),
        email : Joi.string().email().required().label("Email"),
        password : passwordComplexity().required().label("Password"),
        mobile_no : Joi.string().required().label("Mobile Number")
    })
    return schema.validate(data)
}

module.exports = { User, validate };