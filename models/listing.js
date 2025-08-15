const mongoose=require("mongoose");
const { listingSchema } = require("../schema");
const Review=require("./review.js");
const Schema=mongoose.Schema;
const newlistingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url:String,
        filename:String,
        // url: {
        //     type: String,
        //     default: "https://images.unsplash.com/photo-1745276238174-d6ae422eeb78?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //     set: (v) => v === " " ? "https://images.unsplash.com/photo-1745276238174-d6ae422eeb78?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
        // }
    },
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,
        },
    },
});
newlistingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});
const  newListing = mongoose.model("newListing", newlistingSchema);
module.exports = newListing;
