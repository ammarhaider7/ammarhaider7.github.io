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

/*ensightenServices.factory('Auth', ['$resource',
  function ($resource) {
    return function(username, password) {
      return $resource('//manage-api.ensighten.com/auth/token', {}, {
        connect: {
          method:'POST', 
          data: 'grant_type=password',
          params: {},
          isArray: false,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa("experian" + ":" + username + ":" + password)
          }
        }
      });
    }
}]);*/

ensightenServices.factory('Auth', ['$http', function ($http) {
  return function(username, password) {
    return {
      connect: function() {
        return $http({
          method: "POST", 
          url: "//manage-api.ensighten.com/auth/token",
          data: 'grant_type=password',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa("experian" + ":" + username + ":" + password)
          }
        });
      }
    }
  }
}]);
