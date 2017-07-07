'use strict'

let express 		= require('express');
let bodyParser  	= require('body-parser');
let morgan      	= require('morgan');
let serviceAccount 	= require('../auth/serviceAccountKey.js');

//var secret = process.env.SECRET || 'secret123456';
var port = process.env.PORT || 5555;

module.exports = function(app, admin){

	admin.initializeApp({
  		credential: admin.credential.cert(serviceAccount),
  		databaseURL: "https://ziv-ai.firebaseio.com"
	});
	//app.set('superSecret', secret); // secret variable

	// Make the files in the public folder available to the world
	//app.use(express.static(__dirname + '/public'));

	// use body parser so we can get info from POST and/or URL parameters
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	// use morgan to log requests to the console
	app.use(morgan('dev'));
};

//module.exports.secret = secret;
module.exports.port = port;

