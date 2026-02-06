const Listing = require("../models/listing");


module.exports.index = async (req,res)  => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", { allListings });
};  

module.exports.renderNewForm = (req,res) => {
  
    res.render("listings/new.ejs");
  
};

module.exports.showListing = async (req,res) => {
    const {id} =req.params;
    const listData = await Listing.findById(id)
    .populate({path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
    if(!listData) {
       req.flash("error", "listing does not Exist");
      return res.redirect("/listings");
    }
    console.log(listData);
    res.render("listings/show.ejs", {listData});
};



const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

module.exports.createListing = async (req, res) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    if (newListing.location) {
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(newListing.location)}&email=${encodeURIComponent(CONTACT_EMAIL)}`;

      const response = await fetch(geoUrl, {
        headers: { "User-Agent": `StudentProject/1.0 (${CONTACT_EMAIL})` }
      });
      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        newListing.coordinates = [lon, lat]; 
      }
    }

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings");
  }
};


module.exports.renderEditForm = async(req,res) => {
    let {id} =req.params;
    let listingData =await Listing.findById(id);
    if(!listingData)
    {
      req.flash("error", "listing you want to update Does not Exist");
      return res.redirect("/listings");
    }
    
    let originalImageUrl = listingData.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", {listingData,originalImageUrl});
 };


 module.exports.updateListing = async(req,res) => {
    if(!req.body.listing) {
    throw new ExpressError(400 , "sent valid data for listing");
     }
    let {id} =req.params;
    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename= req.file.filename;

    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated successfully");
   res.redirect(`/listings/${id}`); 
};


module.exports.destroyListing = async(req,res) => {
     let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     req.flash("success", "Listing deleted Successfully");
     console.log(deletedListing);
     res.redirect("/listings");

};
   

