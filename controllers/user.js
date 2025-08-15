const User=require("../models/user.js");
module.exports.signUp=async(req,res,next)=>{
    let {username,email,password}=req.body;
try{
     const newUser=new User({email,username});
 const registeredUser=await User.register(newUser,password);
// console.log(registeredUser);
req.login(registeredUser,(err)=>{
if(err)
    return next(err);
 req.flash("success","Welcome to Joureno");
   res.redirect("/listings");
//res.redirect(req.session.redirectUrl);
});

}
catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}

};
module.exports.renderSignupForm=(req,res)=>{
res.render("./users/signup.ejs");
};
module.exports.login=async(req,res)=>{
    req.flash("success","You are logged in");
    let redirectUrl=res.locals.redirectUrl||"/listings";
   res.redirect(redirectUrl);
};
module.exports.logout=(req,res)=>{
    req.logout((err)=>{;
    if(err){
        return next(err);
    }
    /* Why return Matters Here
 Without return, Express may try to 
 continue executing other code even after
 next() or res.redirect() is called — and 
  that’s what causes:"Cannot set headers after they are sent to the client"
*/
    req.flash("success","logged out!");
    res.redirect("/listings");
});
};
module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login.ejs");
};