/* Controllers */
/*Note: We have specified an Angular Module to load using ng-app="ensightenApp", 
where ensightenApp is the name of our module. This module will contain the spaceListCtrl.*/

var ensightenControllers = angular.module('ensightenControllers', []);

//Space List controller
/*ensightenControllers.controller('spaceListCtrl', function($scope, spaceFactory) {
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
    console.log($scope);
    spaceFactory.setSpace($scope.selectedSpace.id);
  }
});*/

//Tag list controller
ensightenControllers.controller('tagListCtrl', ['$scope', 'tokenFactory', 'Tags', 'spaceFactory', 'tagFactory', function($scope, tokenFactory, Tags, spaceFactory, tagFactory) {
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
  $scope.tableRun = false;
  $scope.getTags = function() {
    spaceFactory.setSpace($scope.selectedSpace.id);
	console.log(spaceFactory.getSpace());
	Tags(tokenFactory.getToken(), spaceFactory.getSpace()).pull()
	.success(function(tags) {
		$scope.tableRun = true;
		return $scope.tags = tags;
	})
	.error(function() {
		console.log("Error");
	});
	console.log($scope.tags);
	tagFactory.setTags = $scope.tags;
  }
  $scope.orderProp = '-modifyDate';
}]);

//Tag details (code) controller
ensightenControllers.controller('TagDetailCtrl', ['$scope', '$routeParams', 'tagFactory', function($scope, $routeParams, tagFactory) {
/*  Tags.query(function(data) {
    angular.forEach(data, function(el) {
      if (el.id == $routeParams.tagId) {
        return $scope.tag = el;
      }
    });
  });*/
  $scope.tag = tokenFactory.getTagById($routeParams.tagId);

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

/*ensightenControllers.controller('signinCtrl', ['$scope', '$http', '$location',
	function ($scope, $http, $location) {
		$scope.submit = function() {
		$http({
			method: "POST", 
			url: "//manage-api.ensighten.com/auth/token",
			data: 'grant_type=password',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": "Basic " + btoa("experian" + ":" + $scope.user.name + ":" + $scope.user.password)
			}
		}).
		success(function() {
		  $location.path('/tags').replace();
		}).
		error(function() {
			$scope.invalid = true;
		});
	}
}]);*/

ensightenControllers.controller('signinCtrl', ['$scope', '$location', 'tokenFactory', 'Auth',
	function ($scope, $location, tokenFactory, Auth) {
		$scope.submit = function() {
			Auth($scope.user.name, $scope.user.password)
				.connect()
				.success(function(response) {
					tokenFactory.setToken(response.access_token);
					console.log(response);
				  	$location.path('/tags').replace();
				})
				.error(function() {
					$scope.invalid = true;
				});
		}
}]);
