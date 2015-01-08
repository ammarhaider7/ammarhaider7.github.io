$(function () {
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
        $('#scriptTags .tag').first().after('<span id="docReady">\n$(document).ready(function() {<span>');
        $('#scriptTags .tag').last().before('<span>});\n<span>');
    });
    //On submit prevent default behaviour
    $(document).submit(function (e) {
        e.preventDefault();
    });
    //Wrap in ".." script
    $('a.wrap-in').click(function (e) {
        e.preventDefault();
    });
    //Add function script
    $('a.add-function').click(function (e) {
        e.preventDefault();
    });
});
