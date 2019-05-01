var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// IINDEX --show all campgrounds
router.get("/", function(req, res){
      //Get all the campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/Index", {campgrounds:allCampgrounds});
        }
    });
});


// CREATE --add new route to DB
router.post("/", middleware.isLoggedIn, function(req, res){
   //get data from form and add to the campground array
   var name  = req.body.name;
   var price  = req.body.price;
   var image = req.body.image;
   var desc  = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }; 
   var newCampground = {name: name, price:price, image: image, description: desc, author: author};
   // Create the new campground and save to the DB
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       }else{
            //redirect back to the campground page
            console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
   });
});


// NEW --show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW -- shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
    res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit Campground Route
router.get("/:id/edit",middleware.checkcampgroundownership, function(req, res) {
    // is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
         if(err){
             res.redirect("/campgrounds");
         } else {
           // does user own the campground?
           if(foundCampground.author.id.equals(req.user._id)) {
              res.render("campgrounds/edit", {campground: foundCampground});
         } else {
             res.send("YOU NEED TO LOGGED IN");
         }
        }
    });
    } else {
        console.log("You need to be logged in to do that");
         res.send("You need to be logged in to do that");
    }
});
// Update Campground Route
router.put("/:id", function(req, res){
    //fnd and update the current campground
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redrect to home page
});

//Destroy campground route
router.delete("/:id",middleware.checkcampgroundownership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;