# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/



$(document).ready(
  /* use autocomplete to start searching for a match after 3 letters. */
  /* if nothing is found then add the entry on save. */
  $.ajax({
    url: 'ajax/test.html',
    success: function(data) {

    }
  })
);