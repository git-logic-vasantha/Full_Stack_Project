if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
//const mongo_URL="mongodb://127.0.0.1:27017/Journeo";
const dbUrl=process.env.ATLASDB_URL;
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const methodOverride=require('method-override');
const ExpressError=require("./utils/ExpressError.js");
const listingsRouter=require("./routes/listing.js");
 const reviewsRouter=require("./routes/review.js");
  const usersRouter=require("./routes/user.js");
 const session=require("express-session");
 const MongoStore=require("connect-mongo");
 const flash=require("connect-flash");
 const passport=require("passport");
 const LocalStrategy=require("passport-local");
 const User=require("./models/user.js");
main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs',ejsMate);
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
       res.locals.currUser = req.user;
   next();
});
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",usersRouter);
     app.all("/.*/", (req, res, next) => {
          next(new ExpressError(404, "Page Not Found"));
     });

app.use((err, req, res, next) => {
   const { statusCode = 500, message = "Something went wrong!" } = err;
  //  console.error("Error Stack Trace:", err.stack); // <-- This line logs to console
    res.status(statusCode).render("error.ejs", { err});
});

app.listen(3000,()=>{
    console.log("server is listening to port 3000");
});

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const ejsMate = require("ejs-mate");
// const methodOverride = require("method-override");
// const session = require("express-session");
// const flash = require("connect-flash");
// const ExpressError = require("./utils/ExpressError.js");
// const listings = require("./routes/listing.js");
// const reviews = require("./routes/review.js");

// const mongo_URL = "mongodb://127.0.0.1:27017/Journeo";

// async function main() {
//     await mongoose.connect(mongo_URL);
// }
// main().then(() => {
//     console.log("Connected to DB");
// }).catch((err) => {
//     console.log(err);
// });

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "/public")));
// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// const sessionOptions = {
//     secret: "mysupersecretcode",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//     }
// };
// app.use(session(sessionOptions));
// app.use(flash());
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });
// app.get("/", (req, res) => {
//     res.send("Hi, I am a root");
// });
// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviews);
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });
// app.use((err, req, res, next) => {
//     const { statusCode = 500, message = "Something went wrong!" } = err;
//     res.status(statusCode).render("error.ejs", { err });
// });
// app.listen(3000, () => {
//     console.log("Server is listening on port 3000");
// });