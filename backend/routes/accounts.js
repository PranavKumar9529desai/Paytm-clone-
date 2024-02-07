const express = require("express"); 
const {User ,Account}  = require('../db/db');
const { json } = require("body-parser");
const { mongoose } = require("mongoose");
const router = express.Router(); 
const Authmiddlware = require('../middlwares/auth')

router.get("/balance",async (req,res)=>{
    const userID = req.query.userID;
    try {
        const account = await Account.findOne({
            userID  : userID ,
        });
        const balance = account.balence;
        return res.status(200).json({
            balance : balance
        })
        
    } catch (accountError) {
        console.log(accountError);
         return res.json(400).send({
            msg : "account does not exits !"
        })
    }
});


router.post("/transfer",Authmiddlware,async (req,res)=>{
    const userid = req.user._id;
    const {amount ,to }= req.body;
    const account = await Account.findOne({userID : userid})
    .catch(err=>{
        res.status(400).json({msg : "can't find your account !"});
    })

   if(account.balence < amount) {
        return res.status(400).json({
            msg : "low balence !",
        });}
    
    const toaccount = await Account.findOne({
        userID : to ,
    })
     .catch(err=>{
        res.status(400).json({
        msg : "sender id is invalid !", });
    });

    const sender = await Account.updateOne({
        userID : req.body._id
    },{
        $inc : {
            balence : -amount
        }
    });

    const receiver = await Account.updateOne({
        userID : to 
    },{
        $inc : {
            balence : amount
        }
    });
    

    res.json({
        msg : "transaction sucessfull " 
    })


});


router.post("/transaction/tranfer",Authmiddlware,async (req,res)=>{
    const userid = req.user._id;
    console.log(userid);
    const session = await mongoose.startSession();    
    //  configuring the transaction 
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
        maxCommitTimeMS: 1000
      };
      session.startTransaction(transactionOptions);
      // staring the transactions 
    // session.startTransaction();
    const { amount , to } = req.body;
    const account = await Account.findOne({userID : userid}).session(session);
    
    if(!account || account.balence < amount){
        session.endSession();
        return res.status(400).json({
            msg : "Low balence or account does not exist ",
        });
    };

    const sender = await Account.updateOne({
         userID : userid
        },{
            $inc : {
            balence : - amount ,
        }
    }).session(session);

   // using the session(sessio) to tell that which operation are part of transaction
    const receiver = await Account.updateOne({
        userID : to
       },{
           $inc : {
           balence :  amount ,
       }
   }).session(session) ;
   
   // commit the transaction
   await session.commitTransaction();
   session.endSession();


   res.json({
     msg : "transactions is sucessfull" ,
   })
});

module.exports = router ;