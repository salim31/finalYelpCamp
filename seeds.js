var mongoose = require("mongoose"); 
var Campground = require("./models/campground");
var Comment  = require("./models/comment");
var data = [
{
    name: "cloud rest",
    image: "https://s3.amazonaws.com/imagescloud/images/medias/reservation/camping/main.jpg",
    description: "blah blah blah"
},
{
    name: "cloud rest",
    image: "https://s3.amazonaws.com/imagescloud/images/medias/reservation/camping/main.jpg",
    description: "blah blah blah"
},
{
    name: "cloud rest",
    image: "https://s3.amazonaws.com/imagescloud/images/medias/reservation/camping/main.jpg",
    description: "blah blah blah"
}
    ];

function seedDB(){
    //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
       console.log("remove campgrounds!");
        //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                   console.log("added a campground"); 
                   //create a comment
                  Comment.create(
                 {
                  text: "I wish there was Internet",
                author: "Homer"
           }, function(err, comment){
               if(err)
             {  
                  console.log(err);
            } else {
              campground.comments.push(comment);
            campground.save();
          console.log("Created new comment");
    }
    });
              }
        }) ;
       });
    });
    
}

module.exports = seedDB;