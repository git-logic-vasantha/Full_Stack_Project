const newListings=require("../models/listing");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const { listingSchema } = require("../schema");
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});
module.exports.index=async (req,res)=>{
 const allListings= await newListings.find({});
 //console.log(allListings);
  res.render("./listings/index.ejs",{allListings});
};
module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);
res.render("./listings/new.ejs");
};
// module.exports.showListing=async (req,res)=>{
// let {id}=req.params;
// const listing=await newListings.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");//using nested populate
// if(!listing){
//     req.flash("error","Listing is not existing");
//     res.redirect("/listings");
// }
// //console.log(listing);
// // req.flash("error","Listing is not existing");
// res.render("./listings/show.ejs",{listing});
// };
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await newListings.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing is not existing");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing, mapToken }); 
};
module.exports.createListing=async(req,res,next)=>{
let response=  await  geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
    let url=req.file.path;
    let filename=req.file.filename;
 let {title,description,image,price,country,location}=req.body;
if(!req.body.listing){
    throw new ExpressError(400,"Send valid data for listing");
}
let result=listingSchema.validate(req.body);
// console.log(result);
   const newListing=new newListings(req.body.listing);
   newListing.owner=req.user._id;
   newListing.image={url,filename};
   newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
     req.flash("success"," New Listing is Created");
   res.redirect("/listings");

};
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
const listing=await newListings.findById(id);
if(!listing){
    req.flash("error","Listing is not existing");
    res.redirect("/listings");
}
 let originalImage=listing.image.url;
  originalImage.replace("/upload","/upload/w_250");
res.render("./listings/edit.ejs",{listing,originalImage});
};
module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
    throw new ExpressError(400,"Send valid data for listing");
}
    let {id}=req.params;
  let listing= await  newListings.findByIdAndUpdate(id,{...req.body.listing});
  if(req.file){
     let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
    req.flash("success","Listing is updated");
   res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
   let deletedListing= await newListings.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success","Listing is Deleted");
    res.redirect("/listings");
};