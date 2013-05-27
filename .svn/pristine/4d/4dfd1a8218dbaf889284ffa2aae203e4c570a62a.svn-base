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
// require jquery
// require jquery_ujs
//= require jquery-1.9.1
//= require jquery.dataTables.min.js
//= require jquery-ui-1.10.2.custom.min.js
// require modernizr-2.5.3.min.js
// require jEditable.js
//= require bootstrap.min
//= require jquery.currency
// require_tree .

$(document).ready(function () {

    $(".nav-tab").click(function () {
        activateTab(this);
    });

//    changeHeaderArt(monthName($("#month-name").val()));
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




function changeHeaderArt(month) {
    var style = isNaN(month) ? month : monthName(month);
    $("header").removeClass($("header").attr('class'));
    $("header").addClass(style.toLowerCase());
}

function monthName(month) {
    var monthNames = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];
    var monthName;

    if (isNaN(month)) {
        for (var i = 0; i < monthNames.length; i++) {
            if (month.indexOf(monthNames[i]) > -1) {
                monthName = monthNames[i];
                break;
            }
        }
    }
    else {
        monthName = monthNames[month]
    }
    return monthName;
}

function saveSelected(data, searchField, fieldId) {
    var params = {};

    // params[searchField] used instead of params = { searchField: data }
    // because searchField is a variable of either vendor_name or category_name
    params[searchField] = data;

    $.ajax({
        url:"transactions/" + fieldId,
        dataType:"json",
        type:"PUT",
        data:params
    });
}










//function initEditable() {
//    $('.editable').each(function () {
//        $(this).editable('transactions/' + getTransactionId(this), {
//            type:'text',
//            method:'PUT',
//            name:$(this).attr('name'),
//            tooltip:'Click to edit...Enter to save'
//        })
//    });
//}
// Changes date to yyyy-mm-dd format
//function formatDate(dateString){
//    var date = new Date(dateString);
//    var year = date.getFullYear();
//    var month = date.getMonth() + 1;
//    var day = date.getDate();
//    var formattedDate;
//
//    month = (('' + month).length < 2 ? '0' : '') + month;
//    day = (('' + day).length < 2 ? '0' : '') + day;
//
//    formattedDate = year + "-" + month + "-" + day;
//
//    return formattedDate;
//}
//function getNamedLike(term, field, response) {
//    $.ajax({
//        url:field + "/named_like",
//        dataType:"json",
//        data:{
//            term:term
//        },
//        success:function (data) {
//            if (data === null) {
//            }
//            response($.map(data, function (vendor) {
//                return{
//                    label:vendor.name
//                }
//            }));
//        },
//        error:function () {
//            alert("Error retrieving data")
//        }
//    });
//}
//function initAutocomplete() {
//    $(".autocomplete").each(function () {
//        var searchField = $(this).prop("name");
//        var fieldId = getTransactionId(this);
//        var initVal = $(this).val();
//
//        $(this).autocomplete({
//            source:function (request, response) {
//                getNamedLike(request.term, searchField, response);
//            },
//            minLength:1,
//            select:function (event, data) {
//                initVal = data.item.label;
//                // saveSelected(data.item.label, searchField, fieldId);
//            },
//            close:function () {
//                $(this).val(initVal).blur();
//            }
//        });
//    })/*.blur(function(){
//     var fieldId = getTransactionId(this);
//     var searchField = $(this).prop("name");
//     saveSelected($(this).val(), searchField, fieldId)
//     })*/;
//}
//function initCheckBoxes() {
//    $(".edit-checkbox").click(function () {
//        var parentElement = $(this).closest("td");
//        var transId = getTransactionId(parentElement);
//        var data = {};
//        data[$(parentElement).attr("name")] = $(this).is(':checked');
//
//        $.ajax({
//            url:'transactions/' + transId,
//            data:data,
//            type:"PUT",
//            success:function (data) {
//            },
//            error:function (data) {
//                alert("Unable to update date. Please contact the help desk for assistance.");
//            }
//        });
//    }).each(function () {
//            if ($(this).val() == 'true') {
//                $(this).prop("checked", true);
//            }
//            else {
//                $(this).prop("checked", false);
//            }
//        });
//}