var exec = require('child_process').exec;

var image_path = 'media/pic-' + Date.now() + '.jpg';

var cmd = 'raspistill -o ' + image_path;

exec(cmd, function(error, stdout, stderr) {
  // output is in stdout
  if(error) {
    console.log('Error : ', error);
  } else {
    console.log('Image Saved @ : ', image_path);
  }
});
