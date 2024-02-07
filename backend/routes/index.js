// backend/routes/index.js
const express = require('express');
const userRouter = require("./user");
const accounRouter = require("./accounts");

const router = express.Router();
// so requeste that on endpoints /api/v1/user goes to the userRouter
router.use("/account",accounRouter);
router.use("/user", userRouter);


module.exports = router;