var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var path = require('path');
var app = express();
// Configure the local strategy for use by Passport.

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.

app.use(express.static('public'))

app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'new@secret!goes#here*', resave: false, saveUninitialized: false }));



// Set React as view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());



// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
  });

app.get('/login',
  function(req, res){
    res.sendFile(path.join(__dirname + '/noAccess.html'));
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/welcome');
  });

  
  app.get('/welcome',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    console.log(req.user.displayName)
    if(req.user.role === 'admin'){
      res.sendFile(path.join(__dirname + '/welcomeAdmin.html'));
    }
      res.sendFile(path.join(__dirname + '/welcome.html'));
  });


app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/protected',
function(req, res){
  if(req.user.role === "admin"){
    res.json({"adminAuth": "Yes"})
  }else{
    res.json({"adminAuth": "NO!!!"})
  }
}
)

app.get('/profile',
require('connect-ensure-login').ensureLoggedIn(),
function(req, res){
  res.render('profile', { name: req.user.displayName });
 }
)


var protectedRoutes = require('./routes/protectedRoutes');

// ...

app.use('/protectedRoutes', protectedRoutes)

app.listen(3000, function(){
  console.log('I\'m Listening...')
});
