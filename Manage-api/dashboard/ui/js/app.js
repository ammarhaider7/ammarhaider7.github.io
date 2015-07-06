'use strict';

var ensightenApp = angular.module('ensightenApp', ['ngRoute', 'ensightenControllers', 'ensightenServices', 'ensightenDirectives']);

ensightenApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/tags', {
    templateUrl: 'partials/tag-list.html',
    controller: 'tagListCtrl'
  }).
  when('/tags/:tagId', {
    templateUrl: 'partials/tag-detail.html',
    controller: 'TagDetailCtrl'
  }).
  otherwise({
    redirectTo: '/sign-in',
    templateUrl: 'partials/sign-in.html'
  });
}]);
