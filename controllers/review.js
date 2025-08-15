const Reviews=require("../models/review.js");
const newListings=require("../models/listing.js");
module.exports.createReview=async (req, res) => {
    const { id } = req.params; // <-- Make sure you use req.params.id
    const listing = await newListings.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    const newReview = new Reviews(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
     req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview=async (req, res) => {
  const { id, reviewId } = req.params;
  await Reviews.findByIdAndDelete(reviewId);
  await newListings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
};