/*Directives*/
var ensightenDirectives = angular.module('ensightenDirectives', []);

ensightenDirectives.directive('highlightJs', ['$browser', function($browser) {
  return {
    link: function(scope, element, attributes) {
      $browser.notifyWhenNoOutstandingRequests(function() {
        console.log('Im done!');
	  		$timeout(function () { // You might need this timeout to be sure its run after DOM render.
	    			hljs.highlightBlock(element[0]);
	            }, 100);
      });

    }
  }
}]);
