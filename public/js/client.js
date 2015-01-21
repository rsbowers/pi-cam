var socket = io.connect('http://192.168.1.107:3000/');

socket.on('returnPhoto', function (data) {
  console.log("returnPhoto");
});

$(document).ready(function() {
  $("#snap").click(function(){
    socket.emit('snapPhoto', { duration: 2 });
  });
});
