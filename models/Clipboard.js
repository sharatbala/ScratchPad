/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');

var ClipboardSchema = new mongoose.Schema({
	slug : String,
	text : String,
	created : {
		type : Date,
		"default" : Date.now
	},
	updated : {
		type : Date,
		"default" : Date.now
	},
	expiry : {
		type : Date,
		"default" : Date.now
	}
});

module.exports = mongoose.model('Clipboard', ClipboardSchema);