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
        var sPrice = $('#price').val();
        if ($("#itemName").val()=="" || $("#price").val()=="" || $("#description").val()=="") {
        alert('All fields are mandatory');
        return false;
        }
        if (!validatePrice(sPrice)) {
            alert('Invalid Price');
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
            window.location.href="/admin/items/create"
          else
            window.location.href="/admin/items"
        }        
      },
      error :  function (xhr, status, error) {},
      dataType: 'json'
    });
  });

 });

        // Function that validates email address through a regular expression.
function validatePrice(sPrice) {
var filter = /^(\d*([.,](?=\d{3}))?\d+)+((?!\2)[.,]\d\d)?$/;
if (filter.test(sPrice)) {
return true;
}
else {
return false;
}
}