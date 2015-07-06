/* Controllers */
'use strict';
/*Note: We have specified an Angular Module to load using ng-app="ensightenApp", 
where ensightenApp is the name of our module. This module will contain the spaceListCtrl.*/

var ensightenControllers = angular.module('ensightenControllers', []);

//Space List controller
ensightenControllers.controller('spaceListCtrl', function($scope) {
/*	The concept of a scope in Angular is crucial. A scope can be seen as the glue which allows the template, 
	model and controller to work together. Angular uses scopes, along with the information contained in the template, 
	data model, and controller, to keep models and views separate, but in sync. Any changes made to the model are 
	reflected in the view; any changes that occur in the view are reflected in the model.*/
  $scope.spaces = [{
    'name': 'UK Credit Expert - Prod',
    'id': 1501,
    'age': 3
  }, {
    'name': 'UK Experian Corp - Prod',
    'id': 7469,
    'age': 2
  }, {
    'name': 'UK GSD - Prod',
    'id': 11304,
    'age': 1
  }];
  $scope.orderProp = 'age';
  $scope.getTags = function() {
    console.log($scope.mySpace);
  }
});

//Tag list controller
ensightenControllers.controller('tagListCtrl', ['$scope', 'Tags', function($scope, Tags) {
  $scope.tags = Tags.query();
  $scope.orderProp = '-modifyDate';
}]);

//Tag details (code) controller
ensightenControllers.controller('TagDetailCtrl', ['$scope', '$routeParams', 'Tags', function($scope, $routeParams, Tags) {
  Tags.query(function(data) {
    angular.forEach(data, function(el) {
      if (el.id == $routeParams.tagId) {
        return $scope.tag = el;
      }
    });
  });

  $scope.tagId = $routeParams.tagId;

}]);

//Sign in controller
/*ensightenControllers.controller('signinCtrl', ['$scope', 'Signin', '$location', function($scope, Signin, $location) {
  $scope.submit = function() {
    Signin.query(function(data) {
      angular.forEach(data, function(el) {
        if (el.Username === $scope.user.name && el.Password === $scope.user.password) {
          $location.path('/tags').replace();
        }
      });
    });
    $scope.invalid = true;
  }
}]);*/

/*ensightenControllers.controller('signinCtrl', ['$scope', 'Auth', '$location',
	function ($scope, Auth, $location) {
		$scope.submit = function () {
			Auth($scope.user.name, $scope.user.password).connect(
				function() {
					$location.path('/tags').replace();
				},
				function() {
					$scope.invalid = true;
				}
			);
		}
	}
]);*/

ensightenControllers.controller('signinCtrl', ['$scope', '$http', '$location',
	function ($scope, $http, $location) {
		$scope.submit = $http({
		method: "POST", 
		url: "//manage-api.ensighten.com/auth/token",
		data: 'grant_type=password',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": "Basic " + btoa("experian" + ":" + username + ":" + password)
		}
		}).
		success(function() {
		  $location.path('/tags').replace();
		}).
		error(function() {
			$scope.invalid = true;
		});
}]);
