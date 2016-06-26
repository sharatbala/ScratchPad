/**
 * http://usejsdoc.org/
 */
var scratchpad = angular.module('scratchpad', ['ngRoute', 'ngResource', 'ngAnimate']);

scratchpad.directive('spHeader', function() {
	return {
		restrict: 'AE', //Attribute and element
		replace: true,
		templateUrl: '/templates/header.html',
		scope: {
			search: '=search',
			showSearch: '@search',
			pageTitle: '@pageTitle'
		}
	}
});

scratchpad.directive('spDatePicker', function() {
	
	var months_en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return {
		restrict: 'AE', //Attribute and element
		replace: true,
		templateUrl: '/templates/datePicker.html',
		scope: {
			format: '@format'
		},
		link: function(scope) {
			var m = moment();
			scope.spCal = buildMonth(m);
			scope.headers = {0:'Su', 1:'Mo', 2:'Tu', 3:'We', 4:'Th', 5:'Fr', 6: 'Sa'};
			scope.lastMonth = function() {
				m.subtract(1, 'month');
				scope.spCal = buildMonth(m);
			};
			scope.nextMonth = function() {
				m.add(1, 'month');
				scope.spCal = buildMonth(m);
			};
			scope.lastYear = function() {
				m.subtract(1, 'year');
				scope.spCal = buildMonth(m);
			};
			scope.nextYear = function() {
				m.add(1, 'year');
				scope.spCal = buildMonth(m);
			};
		}
	};
	
	function buildMonth(mIn) {
		var m = moment(mIn);
		var daysInMonth = moment(m).endOf('month').date();
		var lastMonth = moment(m).subtract(1, 'month');
		var daysInLastMonth = lastMonth.endOf('month').date();
		var startDt = moment(m).startOf('month').day('sunday').date();
		var prev = [];
		if (startDt == 1) {//current month starts on a sunday, add a week from last month
			for (var i = daysInLastMonth - 6; i <= daysInLastMonth; i++) {
				prev.push(i);
			}
		} else {
			for (var i = startDt; i <= daysInLastMonth; i++) {
				prev.push(i);
			}
		}
		var curr = [];
		for (var i = 1; i <= daysInMonth; i++) {
			curr.push(i);
		}

		var next = [];
		var lastDow = moment(m).endOf('month').day();
		var end = 6-lastDow;
		for (var i = 1; i <= end; i++) {
			next.push(i);
		}
		if ((prev.length + curr.length + next.length) < 42) {
			for (var i = end+1; i <= end+7; i++) {
				next.push(i);
			}
		}
		var today = m.isSame(moment(), 'month') ? m.get('date') : -1;
		return {
			prev: prev,
			next: next,
			curr: curr,
			today: today,
			mon: m.get('month'),
			month: months_en[m.get('month')],
			year: m.get('year')
		}
	}
});