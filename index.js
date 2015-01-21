var exec = require('child_process').exec;

var image_path = './media/pic-' + Date.now() + '.jpg';

var cmd = 'raspivid -o ' + image_path + '';

exec(cmd, function(error, stdout, stderr) {
  // output is in stdout
  console.log('Image Saved @ : ', image_path);
});
