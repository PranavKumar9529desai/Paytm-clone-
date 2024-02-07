const jwt = require('jsonwebtoken');
const sceret = require('../config.js') ;
const JWT_SECRET = sceret.JWT_SECRET;

function Authmiddlware (req,res,next){
    const token = req.headers.authorization;
    if(!token) {
        return res.status(500).json({msg : 'no token is send'});
    }
    const Token = token.split(' ')[1];
    

    jwt.verify(Token,JWT_SECRET,function(err,decoded){
        if(decoded){
            req.user=decoded;
            console.log(decoded);
            next();
        }
        else res.status(400).json({msg : 'Wrong/null authorization token'});
    });
} 


module.exports = Authmiddlware ;

