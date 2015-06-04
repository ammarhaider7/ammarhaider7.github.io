$(function() {
	$('#nav').affix({
	  offset: {
	    top: function() { 
	    		return (this.top = $("#nav").offset().top)
			},
		bottom: function() { 
	    		return (this.bottom = $("#nav").offset().bottom)
			}
		}
  	});
	$("a.intro").on('click', function(e) {

		   // prevent default anchor click behavior
		   e.preventDefault();

		   // store hash
		   var hash = this.hash;

		   // animate
		   $('html, body').animate({
		       scrollTop: $('#navbar').offset().top
		     }, 500, function(){

		       // when done, add hash to url
		       // (default click behaviour)
		       window.location.hash = hash;
		     });
	});

});
