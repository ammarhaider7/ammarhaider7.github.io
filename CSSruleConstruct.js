$(function () {
    //STYLE CONSTRUCT
    $('#cssColumn').bind("keyup", function () {
        if ($('#CSSfields .entry input').val()) {
            var arr = $('#CSSfields .form-control');
            arr = $.map(arr, function (n, i) {
                return ($(n).val());
            });
            //console.log(arr.join(','));
            $('#dynamicCSS').text(arr.join(',\n') + ' {' + '\n').show();
            //Now enable the Hide/Remove popover for when a user hovers over it 
            // $('.HideRemoveWrap').one("mouseenter", function () {
            //     $(this).popover('show');
            // });
        }
    });
    $('#HideRemove').click(function (e) {
        if ($('#cssSelVal').val()) {
            setTimeout(function () {
                var hideSel = $('#HideRemove label').eq(0).hasClass('active');
                var removeSel = $('#HideRemove label').eq(1).hasClass('active');
                if (hideSel) {
                    var propVal = 'visibility:hidden;\n}';
                } else if (removeSel) {
                    var propVal = 'display:none;\n}';
                }
                $('#dynHideRem').text(propVal);
                $('#cssSelVal').parent().removeClass('has-error').addClass('has-success');
            }, 100);
        } else {
            $('#cssSelVal').parent().removeClass('has-success').addClass('has-error');
            $('#dynHideRem').text("");
            $('#dynamicCSS').text("");
        }
    });
    // //Show the jQuery selector  but only once.
    // $('#HideRemove').one("click", function () {
    //     if ($('#cssSelVal').val()) {
    //         //Destroy the Hide/Remove popover
    //         $('.HideRemoveWrap').popover('destroy');
    //         //Show the jQuery selector popover when user clicks on Hide/Remove
    //         $('#jSelect .entry').popover('show');
    //     }
    // });
    //JS Selector CONSTRUCT
    //When a user presses a key in the jQuery selector div
    $('#jSelect').bind("keyup", function () {
        $('.navbar-fixed-bottom').show("slide", {
            direction: "down"
        }, 250);
        //if there is text in the jQuery selector field, populate the #dynamicJS tag with the selector
        if ($('#jsSelVal').val()) {
            var selVal = $('#jsSelVal').val();
            $('#dynamicJS').text('$(\'' + selVal + '\')');
        }
    });
    //Show the jQuery controls popover but only once
/*    $('#jSelect').one("keyup", function () {
        setTimeout(function () {
            $('.navbar-brand').tooltip('show');
            $('#cssMethdsGr').tooltip('show');
            setTimeout(function () {
                $('.navbar-brand').tooltip('destroy');
            }, 5000);
        }, 800);
    });*/
    //When user starts using methods dropdowns, destroy tooltip
    if ($('#cssSelVal').val()) {
        $('#JSfields').click(function () {
            $('#cssMethdsGr').tooltip('destroy');
        });
    }
    //jQUERY METHODS CONSTRUCT
    //When a user presses a key in the methods textareas div
    $('#methodsPlHolder').bind("keyup", function () {
        //        console.log('keyup');
        //Get the val of the textarea element currently in focus 
        var textVal = $('textarea:focus').val();
        //        console.log(textVal);
        // Get the id as well, this is the method name, e.g. .blur()
        var paramVal = $('textarea:focus').attr('id');
        //Split id to make room for param values
        splitParamVal = paramVal.split('(');
        //            console.log(splitParamVal[0]+"(");
        paramValp1 = splitParamVal[0] + "(";
        paramValp2 = splitParamVal[1];
        //        console.log('paramVal: ' + paramVal);
        //Get all script method p tags
        var arr = $('#scriptTags p').get();
        //        console.log(arr[0]);
        //Match the id with the classNames of method p tags, return true
        function outputMatch() {
            for (i = 1; i < arr.length; i++) {
                if (arr[i].className == paramVal) {
                    //                    console.log(arr[i].className);
                    //                console.log(i);
                    //        console.log(textVal);
                    return true
                }
            }
        }
        //When a match is found, populate the relevant method div (i-1) with the method
        if (outputMatch()) {
            //            console.log(i + " " + paramVal);
            //            console.log(i);
            $('#method' + (i - 1)).text(paramValp1 + textVal + paramValp2);
        }
    });

});
