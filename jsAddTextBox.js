$(function () {
    var methodStr;
    $('.dropdown-menu a').click(function (e) {
        if ($('#jsSelVal').val()) {
            //Add bespoke JSON field for .css()
            //            var isCssJson = $(this).is('#cssJson');
            //            if (isCssJson) {
            //                $('#methodsPlHolder').append(function () {
            //                    return "<div class = \"panel panel-default cssQueryMethods\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><div id=\".css({...})\" class=\"panel-heading\">.css({...})</div><div class=\"panel-body\"><form class=\"form-inline\"><div class=\"form-group\"><label id=\"propInlineLabel\" for=\"exampleInputEmail2\">Property </label><input type=\"text\" class=\"form-control\" id=\"exampleInputEmail2\" placeholder=\"e.g. colour\"></div><div class=\"form-group\"><label id=\"valInlineLabel\" for=\"exampleInputPassword2\">Value</label><input type=\"text\" class=\"form-control\" id=\"exampleInputPassword2\" placeholder=\"e.g. red\"></div><button id = \"cssRuleAddBtn\" class=\"cssRuleAdd btn btn-default btn-add\" type=\"button\"><span class=\"glyphicon glyphicon-plus\"></span></button></form></div></div>";
            //                });
            //                $('#cssRuleAddBtn').click(function (e) {
            //                    e.preventDefault();
            //                    $(".form-group input").bind("keypress", function () {
            //                        $('#outputFlash').addClass('blink');
            //                    });
            //                    $(".form-group input").blur(function () {
            //                        $('#outputFlash').removeClass('blink');
            //                    });
            //                    $('.cssQueryMethods .panel-body').append("<form class=\"form-inline\"><div class=\"form-group\"><label id=\"propInlineLabel\" for=\"exampleInputEmail2\">Property</label><input type=\"text\" class=\"form-control\" id=\"exampleInputEmail2\" placeholder=\"e.g. colour\"></div><div class=\"form-group\"><label id=\"valInlineLabel\" for=\"exampleInputPassword2\">Value</label><input type=\"text\" class=\"form-control\" id=\"exampleInputPassword2\" placeholder=\"e.g. red\"></div><button id = \"cssRuleMinBtn\" class=\"cssRuleMinus btn btn-default btn-add\" type=\"button\"><span class=\"glyphicon glyphicon-minus\"></span></button></form>");
            //
            //                    $('.cssRuleMinus').click(function (e) {
            //                        e.preventDefault();
            //                        //console.log("minus clicked");
            //                        $(this).parent().remove();
            //                    });
            //
            //                });
            //                $('#jsSelVal').parent().removeClass('has-error').addClass('has-success');
            //                var cssParamVal = ".css({...})";
            //                var arr = $('#methodsPlHolder .panel-heading').get();
            //                var i;
            //                for (i = 0; i < arr.length; i++) {
            //                    //                    console.log(arr[i].);
            //                    if (arr[i].innerHTML == cssParamVal) {
            //                        $('p#method' + i).text(cssParamVal);
            //                    }
            //                }
            //                //Reorder on sort
            //                $(this).mouseup(function () {
            //                    setTimeout(function () {
            //                        var arr = $('#methodsPlHolder .panel-heading').get();
            //                        for (i = 0; i < arr.length; i++) {
            //                            $('p#method' + i).text(arr[i].innerHTML);
            //                        }
            //                    }, 100);
            //                });
            //            } else {
            //Add Textarea div when user clicks on a dropdown link
            //Prevent the default bahaviour of jumping scroll to top of page
            e.preventDefault();
            //Assign class of has-success to jQuery selector field, makes it green
            $('#jsSelVal').parent().removeClass('has-error').addClass('has-success');
            //Get the text value of the link, e.g. .blur()     
            methodStr = this.text;
            //Append a textarea in a default panel div and assign the method name as its id and value to the textarea element
            $('#methodsPlHolder').append(function () {
                return "<div class = \"panel panel-default queryMethods\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><div id=" + methodStr + " class=\"panel-heading\">" + methodStr + "</div><div class=\"panel-body\"><div class=\"form-group\"><textarea id=" + methodStr + " rows=1 class=\"form-control parameter\" name=\"fields[]\" type=\"text\" placeholder=\"Paste parameter values here\"></textarea></div><div id=\"escape\" class=\"btn-clipboard\">Escape HTML</div><div class=\"btn-clipboard wrap-in\">Wrap in \"..\"</div></div></div>";
            });
            //Push to output
            var paramVal = methodStr;
            //Get all the methods that have been clicked, pass into array
            var arr = $('#methodsPlHolder .panel-heading').get();
            var i;
            /*Loop through methods and match the current clicked element text to the panel heading text 
            then populate the method with the correct id number with the method name and add a class too*/
            for (i = 0; i < arr.length; i++) {
                if (arr[i].innerHTML == paramVal) {
                    $('p#method' + i).text(paramVal).addClass(paramVal);
                }
            }
            //Reorder on sort
            //When a method panel is released from drag
            $('#methodsPlHolder .panel-heading').mouseup(function () {
                //                    console.log("dropped");
                //                    var paramValsort = this.innerHTML;
                //                    console.log(paramValsort);
                //Wait 0.1s, get the ouput list, loop through and match the values and update all
                setTimeout(function () {
                    var arr = $('#methodsPlHolder .panel-body textarea').get();
                    //                        console.log(arr[0].id);
                    for (i = 0; i < arr.length; i++) {
                        var txtId = arr[i].id;
                        var splitTxtId = txtId.split('(');
                        var splitTxtIdp1 = splitTxtId[0] + "(";
                        var splitTxtIdp2 = splitTxtId[1];
                        var liveParamVal = arr[i].value;
                        var draggedVal = splitTxtIdp1 + liveParamVal + splitTxtIdp2;
                        $('p#method' + i).text(draggedVal).removeClass().addClass(arr[i].id);
                    }
                }, 100);
            });
            //Enable tool tips for post ajax element, but only the first first one
            $('.queryMethods .panel-heading').first().one('mouseenter', function () {
                $(this).tooltip();
            });
        } else {
            $('#jsSelVal').parent().removeClass('has-success').addClass('has-error');
        }
        //When user closes a textarea
        $('button.close').click(function () {
            //Get all methods in output
            var closeArr = $('#scriptTags p').get();
            //            console.log(closeArr[0]);
            var q;
            //Loop through them and if one equals the current clicked element, remove it
            for (q = 1; q < closeArr.length; q++) {
                var closeVal = $(this).next().text();
                //                console.log(closeVal);
                //Clear output text and remove class
                if (closeVal == closeArr[q].className) {
                    //                    console.log('#method' + (q - 1));
                    $('#method' + (q-1)).text("").removeClass();
                }
            }
            //Remove Text box
            $(this).parent().remove();
        });
    });
});
