const express=require("express");
const router = express.Router({ mergeParams: true });
const User=require("../models/user.js");
const passport=require("passport");

const {saveRedirectUrl}=require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { renderSignupForm, signUp, renderLoginForm ,login,logout} = require("../controllers/user.js");
router.route("/signup").get(renderSignupForm)
.post(wrapAsync(signUp));
router.route("/login").get(renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),login);
//logout
router.get("/logout",logout);
module.exports=router;