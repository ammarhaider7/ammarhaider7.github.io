/*Directives*/
var ensightenDirectives = angular.module('ensightenDirectives', []);

ensightenDirectives.directive('highlightJs', ['$browser', function($browser) {
  return {
    link: function(scope, element, attributes) {
      $routeChangeSuccess(function() {
        console.log('Im done!');
	hljs.highlightBlock(element[0]);
      });

    }
  }
}]);
