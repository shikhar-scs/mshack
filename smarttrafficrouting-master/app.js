const express                = require('express'),
    mongoose                 = require("mongoose"),
    passport                 = require('passport'),
    bodyParser               = require('body-parser'),
    localStrategy            = require('passport-local'),
    passportLocalMongoose    = require('passport-local-mongoose'),
    request                  = require('request'),
    sendSMS                  = require('./sendSMS'),
    trashCan                 = require('./models/trashCan'),
    binRequest               = require('./models/binRequest'),
    pickupSchedule           = require('./models/pickupSchedule'),
    complaint                = require('./models/complaint'),
    predictedClusters        = require('./models/predictedClusters');





var User = require('./models/user');

//mongoose.connect("mongodb://sanjay:sanjay123@ds251223.mlab.com:51223/sanjayji");
mongoose.connect("mongodb://admin:admin123@ds143293.mlab.com:43293/bakhodihacks");

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
        address: req.body.address,
        incentive: 0
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


app.post("/newbin", function(req, res){
    trashCan.create({
        lat: req.body.lat,
        lon: req.body.lon
    }, function(err,trashCan){
        if (err) res.send(err);
        else res.send(trashCan);
    })
})

app.get("/bins", function(req, res){
    trashCan.find({}, function(err, Cans){
        if (err) res.send(err);
        else res.send(Cans);
    })
})

app.post("/requestbin", function(req, res){
    binRequest.find({location: req.body.location}, function(err, oldRequest){
        if (err) res.send(err);
        if(oldRequest.length){
            res.send({message: `request at location ${oldRequest[0].location} already raised by ${oldRequest[0].username} on ${oldRequest[0].date}`});
        } else {
            binRequest.create({
                location: req.body.location,
                username: req.body.username,
                date: new Date().toString()
            }, function(err, newRequest){
                res.send({message: "request created"});
            })
        }

    })
});
app.get("/binrequests", function(req,res){
    binRequest.find({}, function(err, requests){
        if (err) res.send(err);
        res.send(requests);
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
        incentive: 0,
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

app.post("/schedulePickup", function(req, res){
    pickupSchedule.create({
        lat: req.body.lat,
        lon: req.body.lat,
        recyclable: req.body.recyclable,
        nonRecyclable: req.body.nonRecyclable,
        username: req.body.username,
        status: 1,
        comments: req.body.comments
    }, function(err, pickup){
        if (err) res.send(err);
        else res.send({
            message: "Pickup request Created successfully"
        })
    })
})

app.post("/incrementincentive", function(req, res){
    User.findOne({username:req.body.username}, function(err, user){
        if (err) res.send(err);
        else {
            user.incentive = Number(user.incentive) + Number(req.body.weight);
            user.save();
            res.send(user);
        }
    });
});

app.get("/incentives", function(req, res){
    res.render("incentives");
});

app.post("/increment", function(req, res){
    User.findOne({username: req.body.username}, function(err, user){
        user.incentive = Number(user.incentive) + Number(req.body.weight) * 0.83;
        user.save();
        sendSMS(user.phoneNumber, user, Number(req.body.weight) * 0.83, req.body.weight);
        res.render("userIncentive", {user: user, newIncentive: Number(req.body.weight) * 0.83, weight: req.body.weight});
    })
})

app.post("/getincentive", function(req, res){
    User.findOne({username: req.body.username}, function(err, user){
        if (err) res.send(err);
        else res.send(`Your due incentive till date is ${user.incentive}. Continue donating recyclable waste to get much more!`);
    })
})

app.post('/complaint', function(req, res){
    complaint.create({
        lat: req.body.lat,
        lon: req.body.lon,
        username: req.body.username,
        comments: req.body.comments,
        date: new Date().toString()
    }, function(err, complaint){
        if (err) res.send(err);
        else res.send(complaint);
    })
})

app.post("/addCluster", function(req, res){
    predictedClusters.update( { lat : req.body.lat, lon: req.body.lon }, { lat : req.body.lat, lon : req.body.lon, cluster: req.body.cluster }, { upsert : true }, function(err){
        if (err) res.send(err);
        else res.send("updated");
    } );

})

app.get("/getPredictedClusters", function(req, res){
    predictedClusters.find({}, function(err, clusters){
        
        if (err) res.send(err);
        else{
            res.render("predictedClusters", {coords: clusters})
        }
    })
})

app.get("/getCluster", function(req, res){
    predictedClusters.find({
        cluster: req.query.cluster
    }, function(err, clusters){
        if (err) res.send(err);
        else{
            res.send(clusters)
        }
    })
})

app.post("/predictedClusters", function(req, res){
    predictedClusters.collection.drop(function(err){
        if (err) res.send(err);
        else {
            console.log("dropped");
            predictedClusters.create(req.body.predictions, function(err, predictions){
                if (err) res.send (err);
                res.send("added to db");
            })
        }

    })
})

app.get("/getClusters", function(req, res){
    predictedClusters.find({}, function(err, clusters){
        if(err) res.send(err);
        else res.send(clusters);
    })
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
app.get('/seeroutes', function(req, res){
    res.render('routing');
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var port = process.env.PORT || 5000;


app.listen(port, function(){
    console.log("Running on port " + port);
});
