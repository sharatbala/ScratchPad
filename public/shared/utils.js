/**
 * http://usejsdoc.org/
 */
(function(isNode, isAngular) {
	var Utils;
	if (isNode) {
		Utils = module.exports;
	} else {
		Utils = {};
	}

	Utils.slugify = function(text, maxLen) {
		maxLen = maxLen || 20;
		text = text.substring(0, maxLen);
		return text.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
				.replace(/[^\w\-]+/g, '') // Remove all non-word chars
				.replace(/\-\-+/g, '-') // Replace multiple - with single -
				.replace(/^-+/, '') // Trim - from start of text
				.replace(/-+$/, ''); // Trim - from end of text
	};

	Utils.randStr = function(len) {
		len = len || 4;
		return Math.random().toString(36).substr(2, len+1);
	};
	
	if (isAngular) {
		angular.module('scratchpad').factory('ScratchUtils', [function() {
			return Utils;
		}]);
	}
	
})(typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');