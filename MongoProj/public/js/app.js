var express 	= require('express'),
	bodyParser 	= require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use (function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept");
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log ('incoming request from ---> ' + ip);
	var url = req.originalUrl;
	console.log ('### requesting ---> ' + url);
	next();
});

app.use ('/', express.static(__dirname + '/public'));

//ROUTERS
app.get('/countries', function (request, response) {
	console.log ('User requested ' + request.originalUrl);
	console.log ('app.get /countries');
	// readRecords ({}, function (docs) {
	// 	response.json (docs);
	// });

	readRecords ({
		// 'gdp' : { '$gte' : request.query.gdp_min }
		'gdp' : { '$gte' : Number (request.query.gdp_min) }
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

// Data
var myShows = [
		{	title: 'Black Mirror',
			channel: 'Netflix',
			genre: ['Sci-fi', 'Drama', 'Critical Design'],
			year: 2012,
			number_of_seasons: 2
		},
		{	title: 'Sopranos',
			channel: 'HBO',
			genre: ['Drama', 'Mafia'],
			year: 2000,
			number_of_seasons: 7
		},
		{	title: 'Mad Men',
			channel: 'AMC',
			genre: ['Drama', 'History'],
			year: 2008,
			number_of_seasons: 7
		},
		{	title: 'Breaking Bad',
			channel: 'AMC',
			genre: ['Action', 'Drama'],
			year: 2009,
			number_of_seasons: 6
		},
		{	title: 'Portlandia',
			channel: 'AMC',
			genre: ['Comedy', 'Hipster'],
			year: 2011,
			number_of_seasons: 5
		}
];
    


// 0. Connect
function initMongo(){
	// 0.1 localhost:mongoDbPort/dbsName
	MongoClient.connect('mongodb://localhost:27017/countries', function(err, _db) {
		// 0.2 Will return two objects: err and db
		// we'll make operations on db if successfully connected
		if(err === null){
			console.log("Connected correctly to server");

			db = _db;
			readRecords ();
			response.json();

		}else{
			console.log(err);
		}
	});	
};


// 2.1
function readRecords(query, callback){
	console.log('Called readRecords.');

	// Meaning: If query === undefined, query = {}
	// else, query keeps the same
	query = query || {};
	// console.log(query);
	db.collection('records').find(query).toArray(function(err, docs) {
    	if(err === null){
    		// console.log(docs);
    		if (callback !== undefined) {
    			console.log (data);
    			callback (docs);
    		}
    		
    	}else{
			console.log(err);
    	}
	    // db.close();
	});
}

// initMongo();

var PORT = 4000;
app.listen(PORT, function () {
	console.log ('Express server is running at ' + PORT);
	initMongo ();
});