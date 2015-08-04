/*Directives*/
var ensightenDirectives = angular.module('ensightenDirectives', []);

ensightenDirectives.directive('highlightJs', [/*'$timeout', */function(/*$timeout*/) {
  return {
/*    link: function(scope, element, attributes) {
	$timeout(function () { // You might need this timeout to be sure its run after DOM render.
    			hljs.highlightBlock(element[0]);
        }, 100);

    }*/
    compile: function(element, attrs) {
    	console.log(element);
    	window.element = element;
    	hljs.highlightBlock(element[0]);
    }
    }
  }
  ]);
