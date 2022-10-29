
const mongoose=require("mongoose");
const UserSchema = new mongoose.Schema(
    {
        firstName: {type: String, required:true},
            lastName: {type: String, required:true},
            email: {type: String, required:true},
            password: {type: String, required:true},
            mobile_no: {type: Number, required:true},
            verified: {
                type: Boolean,
                default: false,
              }
    },
    {timestamps:true}
);
module.exports=mongoose.model("user",UserSchema);