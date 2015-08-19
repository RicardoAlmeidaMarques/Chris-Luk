var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var connection = require('../db.js');
var portfolio = mongoose.model('Portfolio');
var aboutMe = mongoose.model('AboutMe');
var nodemailer = require('nodemailer');


router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname,'../views/index.html'))
});


router.get('/portfolio', function(req, res, next) {
	portfolio.find( function(err, projects){
		if(err){ return next(err);}
		res.json(projects);
	}).sort({_id:-1});
});


router.get('/portfolio/:tags', function(req, res, next) {
    var tag=req.params.tags.split('_').join(' ').split('+');
    portfolio.find({tags : {$in : tag}}, function(err, projects){
      if(err){ return next(err);}
      res.json(projects);
    }).sort({_id:-1});

});

router.post('/project/:project', function(req,res,next){
  var id=req.params.project;
  portfolio.update(
      {_id:id},
      {$set:
        {
          title:req.body.title,
          description:req.body.description,
          portfolioImg:req.body.portfolioImg,
          videoLink:req.body.videoLink,
          tags:req.body.tags,
          date:new Date().toJSON(),
          images:req.body.images
        }
      },
     function(err, result){
      if(err){
          console.log('err:  ' + err);
      }
      else{
          res.json(result);
      }
    }
  )
});


router.get('/project/:project/', function(req, res, next){
  var projectTitle=req.params.project.split('_').join(' ');
  var json={};
  portfolio.find({title:projectTitle}, function(err,project){
    if(!project.length){
      return res.json({message:'no project'});
    }
    json.project = project; 
    var id=json.project[0]._id;
    portfolio.find({_id: {$lt: id}}, function(err,project){
      json.next = project; 
      
      portfolio.find({_id: {$gt: id}}, function(err,project){
        json.previous = project;
        res.json(json);
        
      }).sort({_id: 1}).limit(1)

    }).sort({_id: -1 }).limit(1)
  })
});


router.get('/project/:project/:tags', function(req, res, next){
  var projectTitle=req.params.project.split('_').join(' ');
  var tags=req.params.tags.split('_').join(' ').split('+');
  var json={};
  portfolio.find({title:projectTitle}, function(err,project){
    json.project = project; 
    var id=json.project[0]._id;
    portfolio.find({_id: {$lt: id},tags : {$in : tags}}, function(err,project){
      json.next = project; 
      
      portfolio.find({_id: {$gt: id},tags : {$in : tags}}, function(err,project){
        json.previous = project;
        res.json(json);
        
      }).sort({_id: 1}).limit(1)

    }).sort({_id: -1 }).limit(1)
  })
});



router.post('/about_me/contact', function (req, res) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "animations.cluk@gmail.com",
        pass: "clukanimations1" 
    }
  });
  transporter.sendMail({
    to: 'animations.cluk@gmail.com',
    subject: 'Portfolio page contact',
    text:req.body.message + '\n\xA0\n\xA0\n\xA0Sent by ' + req.body.name + ' / ' + req.body.email
  },function (error, response) {
      //Email not sent
      if (error) {
          return res.json({success:false,message:error});
      }
      //Yay!! Email sent
      else {
          return res.json({success:true,message:"Sent!"});
      }
    }
  );
});

module.exports = router;