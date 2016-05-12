//proper use:
//in terminal, cd into project folder and:
//  - setup a mongod server
//  - run node app.js
//  - load up the index.html page via http://localhost:4000

/*---------- EXPRESS SETUP ----------*/
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
});

var router = express.Router();
// console.log (app.get);
app.use ('/', express.static(__dirname + '/public'));

var test = true;
//ROUTERS
app.get('/kickspotter', function (request, response) {
    // console.log(request.query);
    // console.log(request);
    // console.log(request.query.orderBy);
    var sorter = String(request.query.orderBy);
    var sortType = Number(request.query.sortType);
    var dataSorter;// = { sorter : sortType };

    if (sorter === 'launched_at') {
        dataSorter = { launched_at : sortType };        
    } else if (sorter === 'Goal') {
        dataSorter = { Goal : sortType };        
    } else if (sorter === 'Pledged') {
        dataSorter = { Pledged : sortType };        
    } else if (sorter === 'PledgeHype') {
        dataSorter = { PledgeHype : sortType };        
    } else if (sorter === 'Backers') {
        dataSorter = { Backers : sortType };        
    } else if (sorter === 'BackerHype') {
        dataSorter = { BackerHype : sortType };        
    }

    // console.log (dataSorter);
    // console.log (sorter);
    readData ({
        'Category_Name'     : { '$eq'   : String(request.query.category) || '' },
        'Goal'              : { '$gte'  : Number(request.query.goal) || 0 },
        'Pledged'           : { '$gte'  : Number(request.query.pledged) || 0},
        'PledgeHype'        : { '$gte'  : Number(request.query.pledgeHype) || 0},
        'Backers'           : { '$gte'  : Number(request.query.backers) || 0},
        'BackerHype'        : { '$gte'  : Number(request.query.backerHype) || 0},
        // 'launched_at'       : { '$gte'  : Date(request.query.launchedAt || new Date("Apr 28 2008")) },  //kickstarter launch date
	}, 
    Number(request.query.limit) || 150,
    // { String(request.query.orderBy) : -1 },
    dataSorter,
    // {'Goal': -1},
    // _appLimit,
	function (docs) {
		console.log ('Called callback function');
		response.json (docs);
	});

});

app.get('/kickspotterAlt1', function (request, response) {
    // console.log(request.query);
    // console.log(request);
    // console.log(request.query.orderBy);
    var sorter = String(request.query.orderBy);
    var sortType = Number(request.query.sortType);
    // var dataSorter;// = { sorter : sortType };
    var dataSorter = {
        // launched_at : 1,
        Backers:-1


    }

    console.log (request.query.limit);
    // if (sorter === 'launched_at') {
    //     dataSorter = { launched_at : sortType };        
    // } else if (sorter === 'Goal') {
    //     dataSorter = { Goal : sortType };        
    // } else if (sorter === 'Pledged') {
    //     dataSorter = { Pledged : sortType };        
    // } else if (sorter === 'PledgeHype') {
    //     dataSorter = { PledgeHype : sortType };        
    // } else if (sorter === 'Backers') {
    //     dataSorter = { Backers : sortType };        
    // } else if (sorter === 'BackerHype') {
    //     dataSorter = { BackerHype : sortType };        
    // }

    // console.log (dataSorter);
    // console.log (sorter);
    readData ({
        'Category_Name'     : { '$eq'   : "Video Games" },
        'Goal'              : { '$gte'  : Number(request.query.goal) || 0 },
        'Pledged'           : { '$gte'  : Number(request.query.pledged) || 0},
        'PledgeHype'        : { '$gte'  : Number(request.query.pledgeHype) || 0},
        'Backers'           : { '$gte'  : Number(request.query.backers) || 0},
        'BackerHype'        : { '$gte'  : Number(request.query.backerHype) || 0},
        // 'launched_at'       : { '$gte'  : Date(request.query.launchedAt || new Date("Apr 28 2008")) },  //kickstarter launch date
    }, 
    Number(request.query.limit) || 150,
    // { String(request.query.orderBy) : -1 },
    dataSorter,
    // {'Goal': -1},
    // _appLimit,
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
            console.log ("error");
        }
    });
}

function readData (query, sizeLimit, orderBy, callback) {
    console.log ("Working");
    query = query || {};
  
    // db.open();
    // console.log (query);
    if (query.Goal === NaN) {
        query.Goal = 100;
    } 


    // console.log (orderBy);
    // console.log (db.collection('projects').find (query));
    // if (query.Pl) {}
    // console.log (db.collection('projects').find (query));
    db.collection('projects')
    .find (query)
    .sort (orderBy)
    .limit(sizeLimit)
    .toArray(function (err, docs) {
        if (err == null) {
            if (callback !== undefined) {
                // console.log (docs);
                // console.log (docs);
                callback (docs);
            }
        } else {
            console.log ("error");console.log (err);
        }
    });
}

initMongo ();
var PORT = 4000;
app.listen(PORT, function () {
    console.log ('Express server is running at ' + PORT);
    // initMongo ();
});

