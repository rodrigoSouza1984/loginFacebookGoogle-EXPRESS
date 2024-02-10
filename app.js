const express = require("express");

const passport = require("passport");
const configFacebook = require('./configFacebook');

const cookieParser      =     require('cookie-parser');
const bodyParser        =     require('body-parser')
const session = require('express-session');

const app = express();

const strategy = require('passport-facebook').Strategy;
const FacebookStrategy = strategy.Strategy;

app.use(express.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.session());


app.get('/', function (req, res) {
    res.render('index', { user: req.user });
});


app.use(passport.initialize());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: configFacebook.clientID,
    clientSecret: configFacebook.clientSecret,
    callbackURL: configFacebook.callbackURL,
    profileFields: ['id', 'displayName','photos', 'emails',]
},
    function (accessToken, refreshToken, profile, done) {
        console.log(profile, 'llllll')
        //const userData = {    
        //facebookId: profile._json.id,
        //email : profile._json.email
        //};
        //console.log(userData, 'erer')
        //const login = new FaceModel(userData)
        //login.save();
        done(null, profile);
    }
));

app.get('/', function (req, res) {
    res.render('index', { user: req.user });
});

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/",
        failureRedirect: "/"
    })
);

app.get("/fail", (req, res) => {
    res.send("Failed attempt");
});

app.get("/", (req, res) => {
    res.send("Success");
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

app.listen(5000, () => {
    console.log('Api Started!');
});

