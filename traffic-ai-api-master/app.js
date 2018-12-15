const express                = require('express'),
    mongoose                 = require("mongoose"),
    passport                 = require('passport'),
    bodyParser               = require('body-parser'),
    localStrategy            = require('passport-local'),
    passportLocalMongoose    = require('passport-local-mongoose'),
    request                  = require('request'),
    sendSMS                  = require('./sendSMS');

var carSpottings             = require('./models/carSpottings');
var User = require('./models/user');
var stolenCar = require('./models/stolenCar')

mongoose.connect("mongodb://mshackdatabase.documents.azure.com:10255/?ssl=true&sslverifycertificate=false",
    {
        auth: {
            user: "mshackdatabase",
            password: "8ioC3ik5JJ3DuAc4CbmuztmsCo5kU9pkST05XXY2Bu9aPGHcZXMT0OG9TRrBYFG7IObuCaoUmsKewzlm2gBd1g=="
        }
    })

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(require("express-session")({
    secret: "Please work this time",
    resave : false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/////////////////////////////////////// ROUTES//////////////////////////////////////////////////////////


app.get("/register", function(req, res){
    res.render("register");
});

app.get("/", function(req,res){
    res.render("home");
});

app.post("/register", function(req,res){
    User.register(new User({
        username : req.body.username,
        email : req.body.email,
        name: req.body.name,
        phoneNumber: req.body.phone,
        aadhaar: req.body.aadhaar,
        license: req.body.license,
        address: req.body.address
    }), req.body.password, function(err, user){
        if (err){
            console.log(err);
            res.render('register');
        }
        else {
            console.log("user registered");
            passport.authenticate("local")(req,res, function(){
                res.redirect("secret");
            })
        }
    });
    console.log("Posted");
});


app.post("/register", function(req,res){
    User.register(new User({
        username : req.body.username,
        email : req.body.email,
        name: req.body.name,
        phoneNumber: req.body.phone,
        aadhaar: req.body.aadhaar,
        license: req.body.license,
        address: req.body.address
    }), req.body.password, function(err, user){
        if (err){
            console.log(err);
            res.render('register');
        }
        else {
            console.log("user registered");
            passport.authenticate("local")(req,res, function(){
                res.redirect("secret");
            })
        }
    });
    console.log("Posted");
});

app.post("/api/newSpot", function(req, res){
    carSpottings.create({
        licensePlate: req.body.licensePlate,
        address: req.body.address,
        lat: req.body.lat,
        lon: req.body.lon,
        timestamp: new Date(req.body.timestamp)
    }, function(err, car){
        if (err) res.send(err);
        else res.send(car);
    })
})

app.get('/api/Spots', function(req,res){
    console.log(req.query);
    carSpottings.find(req.query, function(err, spots){
        if (err) res.send(err)
        else res.send(spots);
    })
})

app.post("/api/newStolen", function(req, res){
    stolenCar.create({
        ownerLicense: req.body.ownerLicense,
        licensePlate: req.body.licensePlate
    }, function(err, car){
        if (err) res.send(err);
        else res.send(car);
    })
})

app.post("/api/register", function(req,res){
    User.register(new User({
        username : req.body.username,
        email : req.body.email,
        name: req.body.name,
        phoneNumber: req.body.phone,
        aadhaar: req.body.aadhaar,
        license: req.body.license,
        address: req.body.address,
        OTP : Math.floor(Math.random() * 100000)
    }), req.body.password, function(err, user){
        if (err){
            res.status(400).send(err);
        }
        else {
            console.log("user registered");
            passport.authenticate("local")(req,res, function(){
                sendSMS(req.user.phoneNumber, req.user.OTP);
                res.status(200).send(req.user);
            })
        }
    });
});

app.post('/api/login', function(req,res){
    console.log(req.body);
    passport.authenticate("local")(req,res, function(){
        res.status(200).send(req.user);
    })
});

app.get('/successApi', function(req,res){
    res.status(200).json(req.user);
});

app.get('/failureApi', function(req,res){
    res.status(400).send("Failed");
});

app.get("/secret", function(req,res){
    res.render("secret");
});

app.get("/login", function(req,res){
    res.render('login');
});

app.post('/login', passport.authenticate("local", {
    successRedirect : "/secret",
    failureRedirect: "/login"
}),function(req,res){

});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});




app.post("/activate", function(req, res){
    User.findOneAndUpdate({username: req.body.username}, {MobVerified: true}, function(err, Customer){
        if (err) {
            console.log(err);
            res.sendStatus(400);
        }
        if (Customer === null ) res.sendStatus(404);
        Customer.MobVerified = true;
        res.status(200).send(Customer);


    })

})

app.get("/findCar", function(req,res){
    res.render("findCar")
})

app.get("/activate/:username", function(req, res){
    User.findOneAndUpdate({username: req.params.username}, {MobVerified: true}, function(err, Customer){
        if (err) {
            console.log(err);
            res.sendStatus(400);
        }
        if (Customer === null ) res.sendStatus(404);
        Customer.MobVerified = true;
        res.status(200).send(Customer);


    })

})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var port = process.env.PORT || 5000;


app.listen(port, function(){
    console.log("Running on port " + port);
});
