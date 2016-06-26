/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');

var PageSchema = new mongoose.Schema({
	title : String,
	slug : String,
	notes : String,
	hidden: Boolean,
	created : {
		type : Date,
		"default" : Date.now
	},
	updated : {
		type : Date,
		"default" : Date.now
	},
});

module.exports = mongoose.model('Page', PageSchema);