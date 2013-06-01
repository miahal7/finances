$(document).ready(function(){
    $("#cat-tab").addClass('active');

    $('table').dataTable({
        "bJQueryUI": true,
        "asStripeClasses": [ 'table-odd', 'table-even' ],
        "iDisplayLength": 1000,
        "bRetrieve": true
    });
});