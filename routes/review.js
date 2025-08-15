const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const reviewController=require("../controllers/review.js");
const {isLoggedIn,validateReview, isReviewAuthor}=require("../middleware.js");
/*BEFORE REVIEW ERROR GETTING DONR THROUGH
reviews-post method
// router.post("/" ,validateReview,wrapAsync(async(req,res)=>{
// let listing =await newListings.findById(req.params.id);
// let newReview=new Reviews(req.body.review);
// listing.reviews.push(newReview);
// await newReview.save();
// await listing.save();
// res.redirect(`/listings/${listing._id}`);
 }));
 */
//post review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));
module.exports=router;