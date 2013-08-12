$(document).ready(function () {


    transTblInit();
//
    $("#trans-tab").addClass('active');

    $("#prev-month-btn").click(function(){
        changeMonth($("#prev-month").val(), 'right');
    });

    $("#next-month-btn").click(function(){
        changeMonth($("#next-month").val(), 'left');
    });

    $("#new-trans-btn").click(function () {
        console.log("new-trans-btn clicked and will save a transaction in the" +
            " month of " + $("#current-month").val());
        newTransaction();
    });

});
/* Initiate the transactions table */
function transTblInit() {
    //$("#new-trans-btn, #next-month-btn, #prev-month-btn").button();

    $.fn.dataTableExt.afnSortData['dom-text'] = function (oSettings, iColumn) {

        var aData = [];
        $('td:eq(' + iColumn + ') input', oSettings.oApi._fnGetTrNodes(oSettings)).each(function () {
            aData.push($(this).val());
        });
        return aData.sort();
    }

    $.fn.dataTableExt.afnSortData['dom-checkbox'] = function (oSettings, iColumn) {
        var aData = [];
        $('td:eq(' + iColumn + ') div button:nth-child(2)', oSettings.oApi._fnGetTrNodes(oSettings)).each(function () {
            console.log(this);


            aData.push($(this).val() == "true" ? "1" : "0");
        });
        console.log(aData);

        return aData;
    }

//    $("td:nth-child(5) div button:nth-child(3)", this)


    var oTable =
        $('table').dataTable({
            "bJQueryUI":true,
            "asStripeClasses": [ 'table-odd', 'table-even' ],
            "iDisplayLength": 1000,
            "bRetrieve": true,
            "aaSorting": [
                [ 10, "desc" ], [9, "asc"], [6, "asc"], [8, "asc"]     //recurring, date, vendor name, amount
            ],
            "aoColumns": [
                { "iDataSort": 6 },  //vendor name input
                { "iDataSort": 7 },  //category name input
                { "iDataSort": 8 },  //amount input
                { "iDataSort": 9 },  //date input
                { "iDataSort": 10 }, //cleared/recurring/deposit checkboxes
                null,  //delete button
                { "bSearchable": true, "bVisible": false }, //vendor name
                { "bSearchable": true, "bVisible": false }, //category name
                { "bSearchable": true, "bVisible": false }, //amount
                { "bSearchable": true, "bVisible": false }, //date
                { "bSearchable": true, "bVisible": false }, //recurring
                { "bSearchable": true, "bVisible": false }, //cleared
                { "bSearchable": true, "bVisible": false }  //deposit
            ]
        });

    return oTable;
}

function newTransaction() {
    var ledgerMonth = $("#current-month").val();
    var oTable = $(".transaction-table");
    $.ajax({
        url:'transactions',
        data:{ transaction:{ ledger_month:ledgerMonth } },
        type:"POST",
        dataType:"json",
        success:function (data) {
            console.log("New Transaction created with ID of " + data.id)
            var id = data.id;
            var textProps = ' type="text" autocomplete="off" ';
            var taProps = ' data-provide="typeahead" class="editable typeahead input-medium" ';
            oTable.dataTable().fnAddData([
                '<input id="vendorName_' + id + '" name="vendor_name" placeholder="Transaction Name" ' + taProps + textProps + '>',
                '<input id="categoryName_' + id + '" name="category_name" placeholder="Category Name" ' + taProps + textProps + '>',
                '<div class="input-prepend">' +
                    '<span class="add-on">$</span>' +
                    '<input id="amount_' + id + '" name="amount" class="editable input-small currency" placeholder="Amount"' + textProps + '>' +
                '</div>',
                '<div class="input-append">' +
                    '<input id="date_' + id + '" name="date" class="editable datepicker input-small" placeholder="Date"' + textProps + '>' +
                    '<span class="add-on"><i class="icon-calendar"></i></span>' +
                '</div>',
                '<div class="btn-group" data-toggle="buttons-checkbox">' +
                    '<button id="cleared_' + id + '" name="cleared" class="btn editable checkbox">' +
                        '<i class="icon-check icon-white"></i></button>' +
                    '<button id="recurring_' + id + '" name="recurring" class="btn editable checkbox">' +
                        '<i class="icon-refresh icon-white"></i></button>' +
                   '<button id="deposit_' + id + '" name="deposit" class="btn editable checkbox">' +
                        '<i class="icon-money icon-white"></i> </button>' +
                '</div>',
//                '<a href="/transactions/' + id + '/edit" id="edit-btn_' + id + '" class="btn btn-mini" style="float:left">Edit</a><br/>' +
                '<form action="/transactions/' + id + '" class="button_to" method="post" >' +
                '<div><input name="_method" type="hidden" value="delete">' +
                '<input id="delete-btn_' + id + '" type="submit" value="Delete" class"btn btn-mini btn-danger" style="float:right"></div></form>',
                '<div id="vendorName_' + id + '"_Search"></div>',
                '<div id="categoryName_' + id + '"_Search"></div>',
                '<div id="amount' + id + '"_Search"></div>',
                '<div id="date_' + id + '"_Search"></div>',
                '<div id="cleared_' + id + '"_Search"></div>',
                '<div id="recurring_' + id + '"_Search"></div>',
                '<div id="deposit_' + id + '"_Search"></div>'
            ]);

            $('#edit-btn_' + id).addClass('btn btn-mini');
            $('#delete-btn_' + id).addClass('btn btn-mini btn-danger');
            inlineTableFormInit();

            $("#vendorName_" + id).focus();
        }
    });
}

function changeMonth(ledger_month, direction){
    var month = new Date(ledger_month).getMonth() + 1;

    $.ajax({
        url: 'transactions',
        data: { ledger_date: ledger_month },
        method: "GET",
        success: function(html){
            $("#content-inner").html("").hide();
            $("#content-inner-2").html(html).show();
            transTblInit();
//            slideOnX($("#content-inner"), $("#content-inner-2"), html, direction);
//            changeHeaderArt(month);
        }
    });
}

// Moves a div on X axis out of the view and replaces it with another div, scrolling it into the view
// slideOut   -> the content to be removed from view
// slideIn    -> the content that will replace the removed content
// data       -> the that will be rendered in slideIn
// direction  -> the direction in which the animation will flow (left or right)
function slideOnX(slideOut, slideIn, data, direction){
    var slideDistance = (direction == 'left') ? -$(window).width() : $(window).width();
    var placeholder;

    /*Background animations*/
//    var contentBgWidth = parseInt($("#content-bg").css('marginRight').replace(/[A-Za-z]/g, '')) + 20;
//    alert(contentBgWidth);
//    $("#content-bg").animate({ left: contentBgWidth }, 500);


    // if slideOut is empty then replace it with slideIn and vise versa
    if (slideOut.html() == "") {
        placeholder = slideIn;
        slideIn = slideOut;
        slideOut = placeholder;
    }

    // Move the content div that is displayed out of the view
    // then delete its contents.
    slideOut.animate({ left:slideDistance }, 500, function () {
        slideOut.html("");
    });

    // Move the empty content div to the opposite side of the screen to
    // and prepare it for a slide in animation.
    slideIn.animate({ left:-slideDistance }, 500, function () {
        slideIn.html(data);
        transTblInit();
        slideIn.show();
    });

    // Slide in the newly created content div
    slideIn.animate({ left:0}, 500);
}

function adjustBalance() {

}



