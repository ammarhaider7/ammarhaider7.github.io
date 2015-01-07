$(function () {
    //Add another +
    $('#addAnother').click(function () {
        if ($('#jsSelVal').val()) {
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
        }
    });
    //Add Doc ready
    $('#copy-button').one("click", function () {
        $('#scriptTags .tag').first().after('<span id="docReady">\n$(document).ready(function() {<span>');
        $('#scriptTags .tag').last().before('<span>});\n<span>');
    });
});
