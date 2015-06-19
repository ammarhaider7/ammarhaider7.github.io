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
		   $('body,html').animate({
		       scrollTop: $('#navbar').offset().top
		     }, 500);
	});
	// donut.runAjax(1)
});
