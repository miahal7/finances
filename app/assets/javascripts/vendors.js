$(document).ready(function(){
    $("#vendors-tab").mouseup(function(){
        activateTab(this);
    });
    $("#vendors-tab").addClass('active');
});

function activateTab(tabObj){
    $(tabObj).addClass('active');
}