var socket = io.connect('http://10.0.0.36:3000/');

socket.on('returnPhotoEror', function (data) {
  console.log("returnPhotoEror");
  $(".alert").show().html(data.err);
  $(".photo").hide().html();
});

socket.on('returnPhoto', function (data) {
  console.log("returnPhoto");
  $(".alert").hide();
  $(".photo").show().html('<img src="'+data.img+'"/>');
});

$(document).ready(function() {

  console.log('sup');

  $(".alert").hide();

  $(".photo").hide();

  $("#snap").click(function(){

    $(".alert").show().text('Wait for it!');
    $("#snap").hide();
    socket.emit('snapPhoto', { duration: 2 });
  });
});
