/**
 * http://usejsdoc.org/
 */
(function() {
	var scratchpad = angular.module('scratchpad');
	//---------------
	// Services
	//---------------
	scratchpad.factory('Page', ['$resource', function($resource){
		return $resource('api/pages/:slug', {slug: '@slug'}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			},remove: {
				url:'api/pages/:id',
				method: 'DELETE',
				params: {id: '@_id'}
			}
		});
	}]);
	//---------------
	// Controllers
	//---------------
	
	scratchpad.controller('PageCtrl', ['$scope', 'Page', '$filter', function ($scope, Page, $filter) {
		$scope.pages = Page.query();
		$scope.deleteNote = function(id) {
			if (confirm("Are you sure you want to delete this note? ")) {
				Page.remove({id: id}, function() {
					$scope.pages = Page.query();
				});
			}
		};
	}]);
	
	scratchpad.controller('PageDetailCtrl', ['$scope', '$routeParams', 'Page', '$location', function ($scope, $routeParams, Page, $location) {
		$scope.master = {};
		if ($routeParams.slug && $routeParams.slug.length > 0) {
			$scope.page = Page.get({slug: $routeParams.slug});
			$scope.page.$promise.then(function() {
				$scope.master = angular.copy($scope.page);

				$scope.pageTitle = 'Edit '+$scope.page.title;
			}).catch(function(res) {
				if (res.status === 404) {
					console.log(res);
					$scope.pageNotFound = true;
					$scope.pageTitle = 'Oops!';
				}
			});
		} else {
			$scope.page = new Page();
			$scope.newPage = true;
			$scope.pageTitle = 'Add New Note';

			if ($routeParams.title) {
				$scope.page.title = $routeParams.title;
			}
			if ($routeParams.notes) {
				$scope.page.notes = $routeParams.notes;
			}
		}
		$scope.toggleHidden = function() {
			$scope.page.hidden = !$scope.page.hidden;
		};
		$scope.doSave = function() {
			$scope.submitted = true;
			if ($scope.pageForm.$valid) {
				if ($scope.newPage) {
					Page.save($scope.page, function(newPage) {
						$location.path('/p/' + newPage.slug);
					});
				} else {
					$scope.master.notes = $scope.page.notes;
					$scope.master.hidden = $scope.page.hidden;
					Page.update($scope.master, function() {
						$scope.page.title = $scope.master.title;
					});
				}
			}
		};
	}]);
	//---------------
	// Routes
	//---------------
	
	scratchpad.config(['$routeProvider', function ($routeProvider) {
	  $routeProvider.when('/', {
		  templateUrl: '/templates/pages.html',
	      controller: 'PageCtrl'
	    }).when('/new-note/:title?/:notes?', {
			templateUrl: '/templates/pageDetails.html',
			controller: 'PageDetailCtrl'
	    }).when('/p/:slug', {
			templateUrl: 'templates/pageDetails.html',
			controller: 'PageDetailCtrl'
	    });
	}]);
})();