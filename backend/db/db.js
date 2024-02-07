const mongoose = require('mongoose') ;
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

// .then(()=>{console.log("Database is Connected")});
mongoose.connect('mongodb+srv://pranav:MxfRXkOKXcFhAW1j@cluster0.dwt4kjb.mongodb.net/Paytm')
.then(()=>{console.log("Database is connected")});

const UserSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    Password: {
        type: String,
        required: true,
        minLength: 6
    },
    FirstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    LastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

// creatig a monogoose schema refering the userid of user
const AccountSchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true ,
    }, 
    balence : {
        type : Number ,
        required : true ,
    }
});




// creating method(fun) which we can use later on in the code with any instanous
UserSchema.statics.createHash= async function (plainTextPassword){
    const saltRounds = 10 ;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainTextPassword,salt);
    return hashedPassword ;
}

// creating method to validate the passwords with the hash 
UserSchema.statics.validatePassword = async function (plainTextPassword,hashedPassword){
    return  bcrypt.compare(plainTextPassword, hashedPassword);
}

const User  = new mongoose.model('User', UserSchema) ;
const Account = new mongoose.model('Account',AccountSchema);

module.exports = {
    User ,
    Account
}