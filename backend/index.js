const db = require('./db/db');
const express = require('express') ;
const rootRouter  = require('./routes/index') ;
const app =  express() ;
const cors = require('cors');
const bodyparser =  require('body-parser');


app.use(cors()) ;
app.use(express.json());

app.use("/api/v1" ,rootRouter) ;


app.listen(process.env.PORT || 3000,()=>{
  console.log("Server is running on port 3000");
})
