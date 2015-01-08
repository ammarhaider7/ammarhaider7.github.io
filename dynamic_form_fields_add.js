$(function () {

    $(document).on('click', '.btn-add, a', function (e) {
        //        e.preventDefault();
        var controlForm = $('.controls form:first'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);

        newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-default').addClass('btn-default')
            .html('<span class="glyphicon glyphicon-minus"></span>');
        $("input, .form-group input, textarea").bind("keypress", function () {
            $('#outputFlash').addClass('blink');
        });
        $("input, .form-group input, textarea").blur(function () {
            $('#outputFlash').removeClass('blink');
        });
    }).on('click', '.btn-remove', function (e) {
        $(this).parents('.entry:first').remove();
        e.preventDefault();
        return false;
    });
    $("input, textarea").bind("keypress", function () {
        $('#outputFlash').addClass('blink');
        $('#outputColumn').addClass('flash');
        $('#CSSfields form').popover('destroy');
        //            $('#outputHeader').popover('show');
    });
    //On the first keypress only, show the output popover
    $("#CSSfields input").one("keypress", function() {
        setTimeout(function() {
        $('#outputColumn').tooltip('show');
        setTimeout(function() {
            $('#outputColumn').tooltip('destroy');
        },3000);
        },500);
    });
    $("input, textarea").blur(function () {
        $('#outputFlash').removeClass('blink');
        //        $('#outputColumn').removeClass('flash');
    });
});
