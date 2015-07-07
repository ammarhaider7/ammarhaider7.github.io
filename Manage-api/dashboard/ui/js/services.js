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

//Tag pull service
ensightenServices.factory('Tags', ['$http', function ($http) {
  return function(token, spaceId) {
    return {
      pull: function() {
        return $http({
          method: "POST", 
          url: "//manage-api.ensighten.com/manage/deployments/search",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
          },
          data: JSON.stringify({
            "fields": "id, spaceId, name, status, executionTime, comments, code, dependentDeployments, conditionIds, creationDate, lastAction, modifyDate",
            "sort": "+name",  
            "filters": {
              "live": true,
              "spaceId": [spaceId]
            }
          }),
          processData : false
        });
      }
    }
  }
}]);

//Space Service
ensightenServices.factory('spaceFactory', function() {
  var o = {
    space: ''
  };
  o.setSpace = function(space) {
    o.space = space;
  };
  o.getSpace = function() {
    return o.space;
  };
  return o;
});

//Auth Service
ensightenServices.factory('tokenFactory', function() {
  var o = {
    token: ''
  };
  o.setToken = function(token) {
    o.token = token;
  };
  o.getToken = function() {
    return o.token;
  };
  return o;
});
