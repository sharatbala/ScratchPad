/**
 * http://usejsdoc.org/
 */
(function() {

	var scratchpad = angular.module('scratchpad');
	// ---------------
	// Services
	// ---------------
	scratchpad.factory('Clipboard', ['$resource', function($resource){
		return $resource('api/clipboards/:slug', {slug: '@slug'}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		});
	}]);
	// ---------------
	// Controllers
	// ---------------
	scratchpad.controller('ClipCtrl', [ '$scope', '$routeParams', '$location', 'ScratchUtils', '$timeout', 'Clipboard',
	                                    function($scope, $routeParams, $location, ScratchUtils, $timeout, Clipboard) {
		if (!$routeParams.slug) {
			$location.path('/c/' + ScratchUtils.randStr(2)).replace();
		} else {
			$scope.clip = Clipboard.get({slug: $routeParams.slug});
			$scope.fetching = false;

			function saveChanges() {
				if (!$scope.fetching) {
					$scope.fetching = true;
					if (!$scope.clip._id) {
						console.log("save");
						$scope.clip.slug = $routeParams.slug;
						$scope.clip.$save(function() {
							setSaved();
						});
					} else {
						console.log("update");
						Clipboard.update($scope.clip, setSaved);
					}
				}
			};
			
			var saveTimeout;
			function setSaved() {
				$scope.saved = true;
				$scope.fetching = false;
				if (saveTimeout) {
					$timeout.cancel(saveTimeout);
				}
				saveTimeout = $timeout(function() {
					$scope.saved = false;
				}, 1500);
			}
			
			var timeout = null;
			var debouncedSave = function(newVal, oldVal) {
				if (!$scope.fetching && newVal != oldVal) {// something changed, wait for typing to finish
					$scope.saved = false;
					if (timeout) {
						$timeout.cancel(timeout);
					}
					timeout = $timeout(saveChanges, 1000);
				}
			}
			
			
			$scope.clip.$promise['catch'](function(res) {
				if (res.status === 404) {
					$scope.newClip = true;
				}
			})['finally'](function() {
				$scope.$watch('clip.text', debouncedSave);
			});
		}
	} ]);
	// ---------------
	// Routes
	// ---------------

	scratchpad.config([ '$routeProvider', function($routeProvider) {
		$routeProvider.when('/c', {
			templateUrl : '/templates/clipboard.html',
			controller : 'ClipCtrl'
		}).when('/c/:slug', {
			templateUrl : '/templates/clipboard.html',
			controller : 'ClipCtrl'
		});
	}]);
})();