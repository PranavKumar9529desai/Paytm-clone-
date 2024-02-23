const express = require("express"); 
const router = express.Router(); 
// router.use("/user", userRouter);

const { User, Account } = require('../db/db');
const zod = require('zod'); 
const jwt= require('jsonwebtoken');
const sceret = require('../config.js') ;
const JWT_SECRET = sceret.JWT_SECRET;
const Authmiddlware = require('../middlwares/auth.js');
const bcrypt = require('bcrypt');


//validating the input using zod
const userSchema = zod.object({
   FirstName : zod.string(),  
   LastName : zod.string(),
   Password : zod.string().min(6),
   UserName : zod.string(),
});

router.post("/signup",async function(req,res){
    const {UserName , Password , FirstName , LastName } = req.body ;
    console.log('body',req.body);
    const ValidateBody = userSchema.safeParse(req.body);
    console.log('status',ValidateBody);

    if(!ValidateBody.success) {
      return res.status(400).json({msg : "Invalid  inputs"});
      // using return makes sure compilar knows that fun/conditions ended here.
      // so the control never goes to the try catch
    }

    const userExists = await User.findOne({UserName : UserName});
    //  don't forget write await as findOne is asychoronuous function 
    if(userExists){
       return res.status(409).json({msg : "User already Exists !"});
    }
    // using the declared static method in db.js to create the hash
    hasedPassword = await User.createHash(Password);
    
   try {
   const user = await User.create({
         UserName : UserName ,
         Password : hasedPassword,
         FirstName : FirstName ,
         LastName : LastName,
   });
     //  assiging random balence to the user 
      try {
         let random_balance = Math.floor(Math.random() * 1000) + 1;
         const account = await Account.create({
         userID :  user._id ,
         balence :  random_balance, 
      }); 
           try {
               const userID = user._id;
               const token = jwt.sign({_id:userID},JWT_SECRET);   
                 return res.status(200).json({
                  msg : "User created sucessfully !",
                  jwt : token ,
                  account : account ,
                 });
               } 
                catch (jwtError) {
                  console.error(jwtError);
                  return res.status(500).json({ msg: "Error signing the token" });
              }
           
       } 
         catch (accountError) {
            console.error(accountError);
            // deleting the user without account as it will create the inconsistency in the database
            await User.deleteOne({_id : User._id });
            return res.status(500).json({ msg: "Error creating account" });
       }
        
  }catch (userError) {
     return res.status(400).json({msg : "failed to create the User"});
 }
});


router.post("/signin",async function(req,res){
   const { UserName , Password } = req.body ;
   console.log(Password);


   try {
      const  user = await User.findOne({
         UserName : UserName 
     });
      if(!user){
         return res.status(500).json({
            msg : "Sign Unsccuessful"
         });
      }
   //   resend jwt after the sign 
     const userID = user._id;
     const hasedPassword = user.Password ;
   //   using validatePassword method defined inside the user.js
     const token = jwt.sign({_id:userID},JWT_SECRET);
     const  isValid = await User.validatePassword(Password,hasedPassword);
      if(isValid){
        return res.status(200).json({
          msg : "Sucessfully logged in !",
          jwt : token,
        })
      }  
   } 
     catch (error) {
      console.log(error);
      return res.status(500).json({
         msg : "Unable to login try again later !"
      });
   }
});

router.put("/",Authmiddlware,async function(req,res){
     //  getting the Username from the req.user sent by Authmiddleware 
     const filter = req.user ;
     console.log(filter);
   
     // cleaner apporach 
      const { UserName , Password , FirstName , LastName} = req?.body;
     // updated username,password etc are send through body
      
     // only update the non null values from the username ,password etc ;
     const updates = Object.assign({}, req.body);

     //  upadated password / username should follow conditions
     if(UserName.length < 3 || Password.length < 6 || FirstName.length < 3 ) {
        return res.status(400).json({msg : "UseName or password or firstName is too short"});
     }
      
      try {
         //   hasging the updated password 
        if(updates.Password){
         updates.Password = await User.createHash(updates.Password);
        }

        const user = await User.findOneAndUpdate(
          { UserName : filter } ,
          { $set : updates} ,
          { new : true} 
        );

        return res.status(200).json({
            msg : "Sucessfully updated the User " ,
            User  : user ,
         });
          
       } catch (error) {
         console.log(error);
          return res.status(200).json({
             msg : "UserName/firstName already taken ! " 
          });
      } 
});


router.get("/bulk",Authmiddlware,async function(req,res){
   // using the destructuring 
      const filter = req.query.filter || "";
      // const filter = req.params.filter ;
      console.log(filter);
    
   //  finding the users which mathes with the username or firstname 
   const users = await User.find({
      $or : [{
          UserName : {
            "$regex"  : filter
          }} ,
          { FirstName : {
            "$regex"  : filter
         }
      }] 
   });

  res.json({
      users : users.map(user=>({
         _id : user._id,
         UserName : user.UserName,
         Password : user.Password,
         FirstName : user.FirstName,
         LastName : user.LastName
         }))
   });

});
  
module.exports =  router  