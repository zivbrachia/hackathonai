'use strict'

let express = require('express')
let	app     = express();
let admin   = require('firebase-admin');

let port = require('./lib/config').port;

//require('./lib/alexa')(app, admin);

require('./lib/config')(app, admin);

require('./lib/routes')(app, admin);

app.listen(port);

console.log('Your application is running on http://localhost:' + port);