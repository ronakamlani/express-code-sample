$(document).ready(function () {

  
  $(".stars").starrr();

        $('.stars-existing').starrr({
          rating: 4
        });

        $('.stars').on('starrr:change', function (e, value) {
          $('.stars-count').html(value);
        });

        $('.stars-existing').on('starrr:change', function (e, value) {
          $('.stars-count-existing').html(value);
        });

  $('#btnValidate').click(function() {
        var sEmail = $('#email').val();
        if ($.trim(sEmail).length == 0 || $("#password").val()=="") {
        alert('All fields are mandatory');
        return false;
        }
        if (!validateEmail(sEmail)) {
            alert('Invalid Email Address');
            return false;
        }        
  }); 

 });

        // Function that validates email address through a regular expression.
function validateEmail(sEmail) {
var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
if (filter.test(sEmail)) {
return true;
}
else {
return false;
}
}