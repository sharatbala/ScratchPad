/*
 * Pages related things
 */
var express = require('express');
var utils = require('../public/shared/utils');
var router = express.Router();

var mongoose = require('mongoose');
var Clipboard = require('../models/Clipboard');

router.get('/', function(req, res, next) {
	//Clipboard.remove({}, function(){});
	Clipboard.find(function(err, clipboards) {
		if (err) {
			return next(err);
		}
		var r = [{now: Date.now()}];
		clipboards.forEach(function(c){
			r.push({expiry: c.expiry, slug: c.slug});
		});
		res.json(r);
	});
});

/* GET /todos/id */
router.get('/:slug', function(req, res, next) {
	Clipboard.findOne({slug: req.params.slug}, function(err, post) {
		if (err) {
			return next(err);
		}
		res.json(post);
	});
});

router.post('/:slug', function(req, res, next) {
	var obj = req.body;
	obj.expiry = new Date();
	obj.expiry = obj.expiry.setTime(obj.expiry.getTime() + (6*60*60*1000));
	Clipboard.create(obj, function(err, post) {
		if (err) {
			return next(err);
		}
		res.json(post);
	});
});

router.put('/:slug', function(req, res, next) {
	var obj = req.body;
	obj.updated = Date.now();
	Clipboard.findOneAndUpdate({slug: req.params.slug}, obj, function(err, post) {
		if (err) {
			return next(err);
		}
		res.json(post);
	});
});

var taskInterval = setInterval(function() {
	Clipboard.remove({expiry: {$lte: Date.now()}}, function(err, p) {});
}, 5000);

module.exports = router;