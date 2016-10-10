$(document).ready(function () {

  $('#dateOfBirth').daterangepicker({
          singleDatePicker: true,
          calender_style: "picker_4"
        }, function(start, end, label) {
          console.log(start.toISOString(), end.toISOString(), label);
        });

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
        if ($.trim(sEmail).length == 0 || $("#lastName").val()=="" || $("#firstName").val()=="" || $("#dateOfBirth").val()=="") {
        alert('All fields are mandatory');
        return false;
        }
        if (!validateEmail(sEmail)) {
            alert('Invalid Email Address');
            return false;
        }
        $('INPUT[type="file"]').change(function () {
          var ext = this.value.match(/\.(.+)$/)[1];
          switch (ext) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                $('#uploadButton').attr('disabled', false);
                break;
            default:
                alert('This is not an allowed file type.');
                this.value = '';
    }
});
  });

  $("#user_form").on("submit",function(e){
    e.preventDefault();
    var action = $(this).attr("action");
    var data = new FormData(this);

    console.log(action);

    $.ajax({
      type: 'POST',
      url: action,
      data: data, // or JSON.stringify ({name: 'jonas'}),
      contentType: false,       // The content type used when sending data to the server.
      cache: false,             // To unable request pages to be cached
      processData:false,
      success: function(data) { 
        if(data.status==200)
        {
          alert(data.message);
          if(data.message=="Record inserted!!")
            window.location.href="/admin/users/create"
          else
            window.location.href="/admin/users"
        } 
        else{
          $('#results').html(data.message);
        } 
      },
      error :  function (xhr, status, error) {},
      dataType: 'json'
    });
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