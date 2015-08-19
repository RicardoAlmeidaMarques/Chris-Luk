var express = require('express'),
    app = express(),
    server = require('http').Server(app);
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var connection = require('./db.js');
var mongoose = require('mongoose');
var user = mongoose.model('User');
var Fs = require('fs');
var router = express.Router();

//middleware

// app.use(favicon(__dirname + ''));
app.use('/', express.static(__dirname + '/public'));
app.use('/admin/', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ 
  secret: process.env.SESSION_SECRET || 'secret' ,
  resave: false,
  saveUninitialized: false
}));
app.use(favicon(__dirname + '/public/favicon.ico'));


//sessions
app.use(expressSession({ 
  secret: process.env.SESSION_SECRET || 'fsnfweq93jk3f9ene39' ,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(
  function(username, password, done) {
    user.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password!=password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user.findById(id, function(err, user) {
    done(err, user);
  });
});


//routes
var routes = {
  index : require('./routes/index'),
  admin : require('./routes/admin')
};


app.use('/', routes.index);
app.get('/', routes.index);
app.use('/admin/', routes.admin);
app.all('/admin/*', routes.admin);


if (process.env.NODE_ENV === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

process.on('uncaughtException', function(err) {
  console.log(err);
});




//server

server.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});