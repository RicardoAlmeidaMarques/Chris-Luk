var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var connection = require('../db.js');
var portfolio = mongoose.model('Portfolio');
var user = mongoose.model('User');
var aboutMe = mongoose.model('AboutMe');
var passport = require('passport');
var passportLocal = require('passport-local');


function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.send({success:false, message: 'Not logged in'});
    }
}

router.get('/admin', function(req,res){
	res.sendFile(path.join(__dirname,'../views/admin.html'));
})

router.post('/admin/login', function(req, res, next) {
	var user={
		username:req.body.username,
		password:req.body.password
	}
	passport.authenticate('local', function(err, user, info){
		if(err) {
			return next(err);
		}
		if(!user) {
			return res.send({success:false, message: 'Login Failed'});
		}
		req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.redirect('/admin/dashboard');
	    });
	})(req, res, next);
});

router.get('/admin/dashboard', function(req,res) {

	if(req.isAuthenticated()){
		return res.send({success:true, message: 'Logged in'});
	}
	if(!req.isAuthenticated()){
		return res.send({success:false, message: 'Not logged in'});
	}

});

router.get('/admin/logout', function(req,res){

	req.logout();
	res.redirect('/admin');

});

//delete project
router.delete('/admin/dashboard/delete/:project', loggedIn, function(req,res) {

	var title=req.params.project;
	portfolio.remove({title:title},function(err,result){
		if(err){
			return res.send({success:false, message: err });
		}
		else{
			return res.send({success:true, message: 'Deleted ' + title });
		}	
	})

});

//add project
router.post('/admin/dashboard/add/', loggedIn, function(req,res) {
	var project = new portfolio(req.body);
	project.save(function(err, project){
	    if(err){ return next(err); }
	    res.json({success:true,message:'Project added!'});
	 });
});


router.post('/admin/dashboard/edit' , loggedIn, function(req,res){

	var project = req.body;
	var id=req.body.id;
 	portfolio.update(
      {_id:id},
      {$set:
        {
          title:req.body.title,
          description:req.body.description,
          portfolioImg:req.body.portfolioImg,
          videoLink:req.body.videoLink,
          tags:req.body.tags,
          images:req.body.images
        }
      },
     function(err, result){
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
    }
  )
});

//get showreel video
router.get('/admin/video', function(req,res) {
 	aboutMe.find({}, function(err, videos){
      if(err){ return next(err);}
      res.json(videos[0].showreelVideo);
    }).sort({_id:-1});
});

//save showreel video
router.post('/admin/video', loggedIn, function(req,res) {
	var video = new aboutMe(req.body);
	video.save(function(err, video){
	    if(err){ return next(err); }
	    res.json({success:true,message:'Showreel video changed!'});
	 });
});

module.exports = router;
