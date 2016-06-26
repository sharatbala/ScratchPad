/**
 * Module dependencies.
 */

var express = require('express');
var pages = require('./routes/pages');
var clipboards = require('./routes/clipboards');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var Promise = require("bluebird");
var fs = require('fs');
Promise.promisifyAll(fs);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/scratchpad', function(err) {
	if (err) {
		console.log('connection error', err);
	} else {
		console.log('connection successful');
	}
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true, secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
	app.use(errorHandler());
}

app.use('/api/pages', pages);
app.use('/api/clipboards', clipboards);

app.get('/', function(req, res) {
	var jsModules = [];
	var jsShared = [];
	var templateNames = [];
	var readDirs = [];
	readDirs.push(fs.readdirAsync('./public/modules/'));
	readDirs.push(fs.readdirAsync('./public/shared/'));
	
	Promise.all(readDirs).then(function(results) {
		var moduleFiles = results[0];
		var sharedFiles = results[1];
		var templateContents = [];
		if (sharedFiles) {
			sharedFiles.forEach(function(file){
				if (file.substr(-3) === '.js') {
					jsShared.push(file);
				}
			});
		}
		if (moduleFiles) {
			moduleFiles.forEach(function(file) {
				if (file.substr(-3) === '.js') {
					jsModules.push(file);
				}
			});
		}
		res.render('main', {
			modules: jsModules,
			shared: jsShared,
			templates: []
		});
	}).catch(function(err) {
		console.log(err);
	});
});

app.listen(app.get('port'), function() {
	console.log('ScratchPad server listening on port ' + app.get('port'));
});
