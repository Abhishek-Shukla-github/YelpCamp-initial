let express = require("express");
let router = express.Router({ mergeParams: true });
let Campground = require("./../models/campground");
let Comment = require("./../models/comment");

//New comment
router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) console.log("ERrrrrrrrrrrrrrrrrrrror");
    else {
      res.render("comment/new", {
        campground: campground,
        currentUser: req.user,
      });
    }
  });
});

// Create comment
router.post("/", isLoggedIn, (req, res) => {
  //lookup campground using ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) console.log(err);
    else {
      //Create Comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) console.log(err);
        else {
          //Add Username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //Save the comment
          comment.save();

          foundCampground.comments.push(comment);
          foundCampground.save();
          res.redirect("/campgrounds/" + foundCampground._id);
          console.log(comment);
        }
      });
    }
  });
});

//Preventing actions if not logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;