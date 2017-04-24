var express = require('express');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy;
var User = require('./User');
var search = require('./search');
// config vars
var client_id = require('./config').client_id;
var client_secret = require('./config').client_secret;
var callback_URL = require('./config').callback_URL;

var app = express();
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use(cookieSession({
  name: 'session',
  secret: 'thisisaprettycooldemo',
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
}

passport.serializeUser(function(user, done) {
  done(null, user.spotifyId);
});

passport.deserializeUser(function(id, done) {
  User.find({ spotifyId: id }, function(err, user) {
    done(err, user);
  });
});

passport.use(new SpotifyStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: callback_URL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(profile.id, function (err, user) {
      return done(err, user);
    });
  }
));

app.get('/', function (req, res) {
  res.render('login');
});

app.get('/songs', isLoggedIn, function(req, res, next) {
  res.render('songs', { user: req.user });
});

app.post('/search', function(req, res) {
  console.log(req.body.term);
  if (req.body.term === '') {
    User.getFavoriteTracks(req.body.id, function(err, results) {
      if (err) { res.send('error' + err); }
      search.getTracks(results, function(err, results) {
        res.contentType('json');
        if (err) { res.send('error' + err); }
        for (var i = 0; i < results.length; i++) {
          results[i].isFavorite = true;
        }
        res.send(results);
      });
    });
  } else {
    search.searchForSong(req.body.term, function(err, origres) {
      User.getFavoriteTracks(req.body.id, function(err, results) {
        for (var i = 0; i < origres.length; i++) {
          if (results.indexOf(origres[i].id) > -1) {
            console.log(origres[i]);
            origres[i].isFavorite = true;
          }
        }
        res.contentType('json');
        res.send(origres);
      });
    })
  }
});

app.post('/favorite', function(req, res) {
  User.addFavoriteSong(req.body.id, req.body.link, function(err, results) {
    if (err) {
      res.send(err)
    } else {
      res.send('ok');
    }
  });
});

app.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

app.get('/auth/spotify',
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'] }),
  function(req, res){
});

app.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
function(req, res) {
  res.redirect('/songs');
});



app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('listening on port ' + app.get('port'));
});
