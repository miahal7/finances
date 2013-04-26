$(document).ready(function () {
    inlineTableFormInit();
});

function inlineTableFormInit() {
    var savedText; // Saves the original text in the field in case of abort
    var fieldId; // Text field Id
    var searchType; // Text field name (categories, vendors)

    typeaheadInit();
    editableInit();
    datepickerInit();
    checkBoxesInit();
    currencyInit();
}

function editableInit() {
    $(".editable")
        .keydown(function (e) {
            if (e.which == 13) {
                saveSelected($(this).val(), searchType, fieldId);
                savedText = $(this).val();
                $(this).blur();
            }
            else if (e.which == 9) {
                saveSelected($(this).val(), searchType, fieldId);
                savedText = $(this).val();
            }
        })
        .blur(function () {
            $(this).val(savedText);
        })
        .on("focus", function () {
            savedText = $(this).val();
        })
        .on("click focus", function () {
            fieldId = getTransactionId(this);
            searchType = $(this).prop("name");
        });
}

function appendDecimalOnSave(field) {
    var append = "";
    var prepend = "";
    var val = $(field).val();

    if (val.indexOf(".") == 0) {
        prepend = "0";
    }
    if (val.indexOf(".") == 0 && val.length == 1) {
        prepend = "0";
        append = "00";
    }
    else if (val.indexOf(".") == -1) {
        append = ".00";
    }
    else if (val.indexOf(".") == val.length - 1) {
        append = "00";
    }
    else if (val.indexOf(".") == val.length - 2) {
        append = "0";
    }

    $(field).val(prepend + val + append);
}

function currencyInit() {
    var startVal;
    var moneyRx = /^((\d{0,12})+(\.)?|(\d{0,10})+\.\d{1,2})?$|^\$?[\.]([\d{1,2}]?)$/g;

    $('.currency')
        .on('focus', function () {
            startVal = $(this).val();
            console.log("setting startVal -> " + startVal);

//            changeBalance(this, startVal);

        })
//        .on('input propertychange', function () {
//            var val = $(this).val();
//
//            if (!val.match(moneyRx)) {
//                $(this).val(startVal);
//            }
//            else {
//                changeBalance(this, startVal);
//
//                startVal = $(this).val();
//            }
//
//        })
        .on('blur', function () {
            appendDecimalOnSave(this);
            console.log("passing this startVal -> " + startVal);
            changeBalance(this, startVal);

        });
}

function typeaheadInit() {
    //TODO: typeahead searches EVERY TIME a key is pressed.
    // searchType, fieldId, and savedText are all set in the .editable click event
    $('.typeahead')
        .typeahead({
            source: function (query, process) {
                $.ajax({
                    url: searchType + "/like",
                    data: query,
                    success: function (data) {
                        process(data);
                    }
                });
            },
            minLength: 1,
            updater: function (item) {
                saveSelected(item, searchType, fieldId);
                savedText = item;
                return item;
            }
        });
}

function datepickerInit() {
    // searchType, fieldId, and savedText are all set in the .editable click event
    $(".datepicker").datepicker({
        dateFormat: "M d, yy",
        onSelect: function (date) {
            saveSelected(date, searchType, fieldId);
        }
    });
}

function checkBoxesInit() {
    $(".checkbox").click(function () {
        var checked = $(this).hasClass('active');
        checkBoxStyleHandler(this, checked);
        changeBalance(this, 0);
        saveSelected(!checked, searchType, fieldId);
    });
}

/**ChangeBalance changes the balances on the screen to reflect the most recent changes to transactions
 * Parameters:
 *          field - which field was changed. Can be amount, deposit, cleared, or
 *          recurring(though this one does not change anything **/
function changeBalance(field, origVal) {
    var id = getTransactionId(field);
    var name = $(field).prop("name");
    var ledgerStartBal = Number($("#ledger-balance").data("balance"));
    var bankStartBal = Number($("#bank-balance").data("balance"));
    var amount;
    var tdId;
    var cleared;
    var deposit;
    var bankBalance = 0;
    var ledgerBalance = 0;
    var date;
    var month;
    var year;
    var ledger_date;
    var date_today = new Date;
    var rows = $(".transaction-table tr:gt(0)");

    console.log("========================================================");
    console.log("bank start balance is " + bankStartBal);
    console.log("ledger start balance is " + ledgerStartBal);


    /**TODO: make this a non looping function and maybe break it into several parts
     amount = $("amount_" + id).val(); etc...  */
    rows.each(function () {
        tdId = getTransactionId($("td:nth-child(3) input", this));
        amount = Number($("td:nth-child(3) input", this).val());
        cleared = $("td:nth-child(5) div button:nth-child(1)", this).hasClass("active");
        deposit = $("td:nth-child(5) div button:nth-child(3)", this).hasClass("active");
        date = new Date($("td:nth-child(4) input", this).val());
        month = date.getMonth() + 1;
        year = date.getFullYear();

        ledger_date = new Date(year + "-" + month + "-01");

        //origVal = Number(origVal);

        if (date_today >= ledger_date) {
            console.log("amount -> " + amount);
            console.log("origVal -> " + origVal);
            if (id == tdId && name == "cleared") {
                cleared = !cleared;
            }
            if (id == tdId && name == "deposit") {
                deposit = !deposit;
                // amount = amount * 2;      <--MAYBE SOMETHING WITH THIS
            }
            if (id == tdId && name == "amount") {
                if (deposit) {
                    ledgerBalance = amount - origVal;

                    if (cleared) {
                        bankBalance = amount - origVal;
                    }
                }
                else {
                    ledgerBalance = origVal - amount;

                    if (cleared) {
                        bankBalance = origVal - amount;
                    }
                }
            }

            if (id == tdId && name != "amount") {
                if (deposit) {
                    if (name == "deposit") {
                        ledgerBalance += amount * 2;
                    }

                    if (cleared) {
                        if (name == "deposit") {
                            bankBalance += amount * 2;
                        }
                        else {
                            bankBalance += amount;
                        }
                    }
                    else {
                        if (name == "cleared") {
                            bankBalance -= amount;
                        }
                    }
                }
                if (!deposit) {
                    if (name == "deposit") {
                        ledgerBalance -= amount * 2;
                    }

                    if (cleared) {
                        if (name == "deposit") {
                            bankBalance -= amount * 2;
                        }
                        else {
                            bankBalance -= amount;
                        }
                    }
                    else {
                        if (name == "cleared") {

                            bankBalance += amount;
                        }
                    }
                }
            }
        }
    });
    console.log("ledgerStartBal before add -> " + ledgerStartBal);
    console.log("bankStartBal before add -> " + bankStartBal);

    console.log("ledgerBalance before add -> " + ledgerBalance);
    console.log("bankBalance before add -> " + bankBalance);


    ledgerBalance = Number(ledgerStartBal + Number(ledgerBalance));
    bankBalance = Number(bankStartBal + Number(bankBalance));


    console.log("ledgerBalance -> " + ledgerBalance);
    console.log("bankBalance -> " + bankBalance);
    console.log("========================================================");

    $("#ledger-balance").html(currencyFormat(Number(ledgerBalance).toFixed(2).toString()))
        .data("balance", Number(ledgerBalance));
    $("#bank-balance").html(currencyFormat(Number(bankBalance).toFixed(2).toString()))
        .data("balance", Number(bankBalance));
}

function currencyFormat(str) {
    var formatted = str.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    formatted = (formatted === "$-0.00") ? "$0.00" : formatted;

    //TODO: find a regex that will do this
    if(formatted < 0){
        formatted = formatted.substring(0,1) + "$" + formatted.substring(1,formatted.length);
    }
    else{
        formatted = "$" + formatted;
    }



    return formatted;
}


function checkBoxStyleHandler(field, checked) {
    var name = $(field).prop("name");
    var child = $(field).children();

    if (!checked) {
        child.removeClass("icon-white");
    }
    else {
        child.addClass("icon-white")
    }

    if (name == "deposit" && !checked) {
        child.removeClass("icon-white").addClass("green");
    }
    else {
        child.addClass("icon-white").removeClass("green");
    }

    if (name == "recurring" && !checked) {
        child.removeClass("icon-white").addClass("blue");
    }
    else {
        child.addClass("icon-white").removeClass("blue");
    }
}