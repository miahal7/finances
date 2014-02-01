// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery-2.1.0.min
//= require jquery.dataTables.min.js
//= require jquery-ui-1.10.2.custom.min.js
//= require bootstrap3.min
//= require typeahead.min
//= require jquery.currency

$(document).ready(function () {
    $(".nav-tab").click(function () {
        activateTab(this);
    });
});

/*Each tr element has an id of '<tr element name>_<transaction id>'.
 * This function removes the prepending '<tr element name>_' from
 * the element id, returning only the transaction id*/
function getTransactionId(tdObj) {
    var id = $(tdObj).attr('id');
    id = id.substring(id.indexOf("_") + 1, id.length);
    return id;
}

/* Activates tab on proper screen ex:(vendor tab on vendor screen) */
function activateTab(tabObj) {
    $(tabObj).addClass('active');
}

function saveSelected(data, searchField, fieldId) {
    var params = {};
    // params[searchField] used instead of params = { searchField: data }
    // because searchField is a variable of either vendor_name or category_name
    params[searchField] = $.trim(data);

    $.ajax({
        url:"transactions/" + fieldId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
        },
        dataType:"json",
        type:"PUT",
        data:params
    });
}