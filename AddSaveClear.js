$(function () {
        $('#addAnother').click(function () {
            if($('#jsSelVal').val() && $('.queryMethods textarea').val()) {
            //Get the jQuery statement
            var jStatement = $('#scriptTags p').text();
            //Append it after opening script tag
            $('#scriptTags .tag').eq(0).after('<br><span>' + jStatement + ';' + '</span>');
            //Clear live jQuery statement of text and classes
            $('#scriptTags p').text("").removeClass();
            //Remove methods
            $('.queryMethods').remove();
            $('#jsSelVal').val("");
            }
        });
});
