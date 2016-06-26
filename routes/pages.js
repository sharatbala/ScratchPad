/*
 * Pages related things
 */
var express = require('express');
var utils = require('../public/shared/utils');
var router = express.Router();

var mongoose = require('mongoose');
var Page = require('../models/Page');

router.get('/', function(req, res, next) {
	Page.find({hidden: {$ne: true}}, function(err, pages) {
		if (err) {
			return next(err);
		}
		res.json(pages);
	});
});

/* GET /todos/id */
router.get('/:slug', function(req, res, next) {
	Page.findOne({slug: req.params.slug}, function(err, post) {
		if (err) {
			return next(err);
		}
		if (!post || !post._id) {
			res.status('404').send();
		} else {
			res.json(post);
		}
	});
});

router.post('/', function(req, res, next) {
	var pageObj = req.body;
	pageObj.slug = utils.slugify(pageObj.title) + "-" + utils.randStr();
	Page.create(pageObj, function(err, post) {
		if (err) {
			return next(err);
		}
		res.json(post);
	});
});

router.put('/:slug', function(req, res, next) {
	var pageObj = req.body;
	pageObj.updated = Date.now()
	Page.findOneAndUpdate({slug: req.params.slug}, pageObj, function(err, post) {
		if (err) {
			return next(err);
		}
		res.json(post);
	});
});

router.delete('/:id', function(req, res, next) {
	console.log(req.params.id);
	Page.findOneAndRemove({_id: req.params.id}, function(err, page) {
		if (err) {
			return next(err);
		}
		res.json(page);
	});
});

module.exports = router;