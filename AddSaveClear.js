$(function () {
    window.o = {};
    //    //Wrap in quotes
    //        $('a#Wrap_in_quotes').one("click", function (e) {
    //        e.preventDefault();
    //        var textVal = $('textarea:focus').val();
    //        var textValQuo = "\"" + textVal + "\"";
    //        $('#scriptTags p').val(textValQuo);
    //    });
    //Add another +
    $('#addAnother').click(function (e) {
        e.preventDefault();
        //If there is text in jquery selector field and a method textarea
        if ($('#jsSelVal').val() && $('.form-group textarea').length) {
            //Get the jQuery statement
            var jStatement = $('#scriptTags p').text();
            //If no doc ready, append it after opening script tag, else append after doc ready
            //            if(
            //            $('#scriptTags .tag').eq(0).after('<br><span>' + jStatement + ';' + '</span>');
            $('#dynamicJS').before('<br><span>' + jStatement + ';' + '</span>');
            //Clear live jQuery statement of text and classes
            $('#scriptTags p').text("").removeClass();
            //Remove methods
            $('.queryMethods').remove();
            $('#jsSelVal').val("");
        } else {
            alert('Please enter at least one method');
        }
    });
    //Add Doc ready
    
    $('#copy-button').one("click", function () {
        if(!o.domReady) {
        $('#scriptTags .tag').first().after('<span id="docReady">\n(function checkJquery() {\nif(window.$) {\n$(document).ready(function() {<span>');
        $('#scriptTags .tag').last().before('<span>});\n} else {\nsetTimeout(checkJquery,100);\n}\n})();\n<span>');
        o.checkjQuery = true;
        }
    });
    $('#dom-ready-button').one("click", function () {
        if(!o.checkjQuery) {
        $('#scriptTags .tag').first().after('<span id="docReady">\n$(function() {<span>');
        $('#scriptTags .tag').last().before('<span>});\n<span>');
        o.domReady = true
        }
    });   

    //On submit prevent default behaviour
    $(document).submit(function (e) {
        e.preventDefault();
    });

    //Wrap in ".." script 
    $('#methodsPlHolder').on("click", ".wrap-in", function () {
        //Get current input text
        var currentValtxt = $(this).prev().find('textarea').val();
        //Wrap text in " " 
        var wrappedVal = '\"' + currentValtxt + '\"';
        //Update input with " "
        $(this).prev().find('textarea').val(wrappedVal);
        //Get ID of textarea
        var valTxtId = $(this).prev().find('textarea').attr('id');
        //Get all script method p tags
        var arr = $('#scriptTags p').get();
        //Match the id with the classNames of method p tags, return true
        function outputMatch() {
            for (i = 1; i < arr.length; i++) {
                if (arr[i].className == valTxtId) {
                    return true;
                }
            }
        }
        //When a match is found, populate the relevant method div (i-1) with the method
        if (outputMatch()) {
            splitIdVal = valTxtId.split('(');
            //Split method to make space for Quotes and then update
            splitIdValp1 = splitIdVal[0] + "(";
            splitIdValp2 = splitIdVal[1];
            $('#method' + (i-1)).text(splitIdValp1 + wrappedVal + splitIdValp2);
        }
    });
    
    $('#methodsPlHolder').on("click", '#escape', function() {
        // e.preventDefault();
        // List of HTML entities for escaping.
        var htmlEscapes = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '/': '&#x2F;'
        };
        
        // Regex containing the keys listed immediately above.
        var htmlEscaper = /[&<>"'\/]/g;
        
        // Escape a string for HTML interpolation.
        _escape = function(string) {
          return ('' + string).replace(htmlEscaper, function(match) {
            return htmlEscapes[match];
          });
        };
        
        //Get current input text
        var currentValtxt = $(this).prev().find('textarea').val();
        var escapedVal = _escape(currentValtxt);
        //Update input with " "
        $(this).prev().find('textarea').val(escapedVal);
        
    })
    
    //Add function script
    $('a.add-function').click(function (e) {
        e.preventDefault();
    });
});
