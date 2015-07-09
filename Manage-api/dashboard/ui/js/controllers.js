/* Controllers */
/*Note: We have specified an Angular Module to load using ng-app="ensightenApp", 
where ensightenApp is the name of our module. This module will contain the spaceListCtrl.*/

var ensightenControllers = angular.module('ensightenControllers', []);

//Tag list controller
ensightenControllers.controller('tagListCtrl', ['$scope', 'tokenFactory', 'Tags', 'spaceFactory', 'tagFactory', function($scope, tokenFactory, Tags, spaceFactory, tagFactory) {
  $scope.tableRun = false;
$scope.spaces = [{
	name: 'UK Credit Expert - Prod',
	id: 1501
}, {
	name: 'UK Credit Expert - Stage',
	id: 1503
}, {
	name: 'UK Experian Corp - Prod',
	id: 7469
}, {
	name: 'UK Experian Corp - Stage',
	id: 7709
}, {
	name: 'UK GSD - Prod',
	id: 11304
}, {
	name: 'UK GSD - Pre-prod',
	id: 11307
}, {
	name: 'UK Credit Matcher - Prod',
	id: 4237
}, {
	name: 'UK Credit Matcher - Stage',
	id: 4236
}];
  var matchSpaces = function(spaceName) {
  	var matchedSpace;
  	angular.forEach($scope.spaces, function (space) {
  		// console.log(space);
  		if(space.name == spaceName) matchedSpace = space;
  	});
  	return matchedSpace;
  }			
if(tagFactory.getTags() != undefined) {
  $scope.tags = tagFactory.getTags();
  $scope.tableRun = true;
  //console.log(spaceFactory.getSpace());
  //console.log(spaceFactory.getSpace().name);
  $scope.selectedSpace = matchSpaces(spaceFactory.getSpace().name);
  //console.log($scope.selectedSpace);
}
$scope.getTags = function () {
	$scope.tableRun = false;
	$scope.loader = true;
	// console.log("name: " + $scope.selectedSpace.name + " id: " + $scope.selectedSpace.id);
	spaceFactory.setSpace($scope.selectedSpace.name, $scope.selectedSpace.id);
	// console.log(spaceFactory);
	Tags(tokenFactory.getToken(), spaceFactory.getSpaceId()).pull()
		.success(function(tags) {
			// console.log(tags);
			tagFactory.setTags(tags);
			// console.log(tagFactory);
			// console.log("tagFactory.getTags(): " + tagFactory.getTags())
			$scope.loader = false;
			$scope.tableRun = true;
			return $scope.tags = tags;
		})
		.error(function() {
			console.log("Error");
			$scope.loader = false;
		});
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
	// console.log('$routeParams: ' + $routeParams.tagId);
	// console.log("tagFactory.getTagById($routeParams.tagId): " + tagFactory.getTagById($routeParams.tagId));
  	$scope.tag = tagFactory.getTagById($routeParams.tagId);
  	$scope.tagId = $routeParams.tagId;
  	// console.log("$scope.tag: " + $scope.tag);
}]);

ensightenControllers.controller('signinCtrl', ['$scope', '$location', 'tokenFactory', 'Auth',
	function ($scope, $location, tokenFactory, Auth) {
		$scope.submit = function() {
			$scope.loader = true;
			Auth($scope.user.name, $scope.user.password)
				.connect()
				.success(function(response) {
					tokenFactory.setToken(response.access_token);
				  	$location.path('/tags').replace();
				  	$scope.loader = false;
				})
				.error(function() {
					$scope.loader = false;
					$scope.invalid = true;
				});
		}
}]);
