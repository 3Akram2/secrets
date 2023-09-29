import mongoose from "mongoose";
import encrypt from "mongoose-encryption"
 const userSchema =new mongoose.Schema ({
    email:String,
    password:String,
 
 });
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})
 const User = mongoose.model('User', userSchema);
 export default User;
