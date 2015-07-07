/*Directives*/
var ensightenDirectives = angular.module('ensightenDirectives', []);

ensightenDirectives.directive('highlightJs', ['$timeout', function($timeout) {
  return {
    link: function(scope, element, attributes) {
	$timeout(function () { // You might need this timeout to be sure its run after DOM render.
    			hljs.highlightBlock(element[0]);
        }, 1000);

    }
  }
}]);
