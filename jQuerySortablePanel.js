jQuery(function ($) {
    $('.dropdown-menu a').click(function (e) {
        var panelList = $('#methodsPlHolder');

        panelList.sortable({
            placeholder: "ui-state-highlight",
            // Only make the .panel-heading child elements support dragging.
            // Omit this to make the entire <li>...</li> draggable.
            handle: '.panel-heading',
            update: function () {
                $('.panel', panelList).each(function (index, elem) {
                    var $listItem = $(elem),
                        newIndex = $listItem.index();

                    // Persist the new indices.
                });
            }
        });
        //    $( ".sortable" ).disableSelection();
    });
    //Reorder on sort
    $('#methodsPlHolder .panel-heading').mouseup(function () {
        //                    console.log("dropped");
        //                    var paramValsort = this.innerHTML;
        //                    console.log(paramValsort);
        //After 0.1s, get the ouput list, loop through and match the values and update all
        setTimeout(function () {
            var arr = $('#methodsPlHolder .panel-heading').get();
            for (i = 0; i < arr.length; i++) {
                $('p#method' + i).text(arr[i].innerHTML);
            }
        }, 100);
    });
});
