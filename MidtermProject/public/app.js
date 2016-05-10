//proper use:
//in terminal, cd into project folder and:
//  - setup a mongod server
//  - run node app.js
//  - load up the index.html page via http://localhost:4000

//Initial App Setup
var express		= require('express'),
	bodyParser	= require('body-parser');

var app = express ();
app.use (bodyParser.urlencoded({extended: false}));
app.use (bodyParser.json());

app.use (function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept");
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log ('incoming request from ---> ' + ip);
	var url = req.originalUrl;
	console.log ('### requesting ---> ' + url);
	next();
})

app.use ('/', express.static(__dirname + '/public'));

//ROUTERS
app.get('/kickspotter', function (request, response) {
    readData ({
        'goal' : { '$gte' : request.query.Goal },
        'goalHype' : { '$gte' : request.query.GoalHype },
        'pledged' : { '$gte' : request.query.Pledged },
        'pledgeHype' : { '$gte' : request.query.PledgeHype }
        // 'launched_at' : { '$gte' : request.query.launched_at }
	}, 
	function (docs) {
		console.log ('Called callback function');
		response.json (docs);
	});

});
/*-------------------- MODULES --------------------*/
// Load the mongodb module
var	MongoClient = require('mongodb').MongoClient;
var db;

function initMongo () {
    // 0.1 localhost:mongoDbPort/dbsName
    console.log ('mono initd');
    MongoClient.connect ('mongodb://localhost:27017/kickspotter', function (err, _db) {
        if (err == null) {
            db = _db;
            // console.log (db);
        } else {
            console.log (err);
        }
    });
}

function readData (query, callback) {
    console.log ("Working");
    query = query || {};
    console.log (db);
    db.collection('projects').find (query).toArray(function (err, docs) {
        if (err == null) {
            if (callback !== undefined) {
                // console.log (docs);
                callback (docs);
            }
        } else {
            console.log (err);
        }
    });
}

initMongo ();
var PORT = 4000;
app.listen(PORT, function () {
    console.log ('Express server is running at ' + PORT);
    // initMongo ();
});

