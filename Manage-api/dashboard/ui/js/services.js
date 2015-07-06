/*Services module*/
var ensightenServices = angular.module('ensightenServices', ['ngResource']);

ensightenServices.factory('Tags', ['$resource', function($resource) {
  return $resource('tags.json', {}, {
    query: {
      method: 'GET',
      params: {},
      isArray: true
    }
  });
}]);

ensightenServices.factory('Signin', ['$resource', function($resource) {
  return $resource('users.json', {}, {
    query: {
      method: 'GET',
      params: {},
      isArray: true
    }
  });
}]);

ensightenServices.factory('Auth', ['$resource',
  function ($resource) {
    return $resource('//manage-api.ensighten.com/auth/token', {
      get: {
        method:'POST', 
        data: 'grant_type=password',
        headers: {
        "Authorization": "Basic " + btoa("experian" + ":" + $scope.user.name + ":" + $scope.user.password)
        },
      }
    });
}]);
