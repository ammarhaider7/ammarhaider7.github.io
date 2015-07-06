'use strict';

var ensightenApp = angular.module('ensightenApp', ['ngRoute', 'ensightenControllers', 'ensightenServices', 'ensightenDirectives']);

ensightenApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/tags', {
    templateUrl: 'Partials/tag-list.html',
    controller: 'tagListCtrl'
  }).
  when('/tags/:tagId', {
    templateUrl: 'Partials/tag-detail.html',
    controller: 'TagDetailCtrl'
  }).
  otherwise({
    redirectTo: '/sign-in',
    templateUrl: 'Partials/sign-in.html'
  });
}]);
