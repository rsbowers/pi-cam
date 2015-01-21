var express = require('express'),
exphbs  = require('express3-handlebars'),
path = require('path'),
exec = require('child_process').exec,
s3 = require('s3'),
http = require('http');

var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: "AKIAJIBDGALJRXD7WNDA",
    secretAccessKey: "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",
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
});

var app = express();
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});

var io = require('socket.io').listen(server);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('home');
});

// Web Socket Connection
io.sockets.on('connection', function (socket) {

  // If we recieved a command from a client to start watering lets do so
  socket.on('snapPhoto', function(data) {

    var aws_path = 'media/pic-' + Date.now() + '.jpg',
        cmd = 'raspistill -o ' + aws_path,
        image_path = '',
        params = {
          localFile: aws_path,
          s3Params: {
            Bucket: "com.rbowers.picam",
            Key: aws_path,
            ACL: 'public-read'
            // other options supported by putObject, except Body and ContentLength.
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
          }
        },
        errorMessage = '';

    exec(cmd, function(error, stdout, stderr) {
      // output is in stdout
      if(error) {

        console.log('Error : ', error);

      } else {

        console.log('Image Saved @ : ', image_path);

        //Send to AWS
        var uploader = client.uploadFile(params);

        uploader.on('error', function(err) {
          console.error("unable to upload:", err.stack);
          errorMessage = "unable to upload:" + err.stack;
          socket.emit("returnPhotoError", { err: errorMessage });
        });

        uploader.on('progress', function() {
          console.log("progress", uploader.progressMd5Amount,
          uploader.progressAmount, uploader.progressTotal);
        });

        uploader.on('end', function() {
          console.log("done uploading");
          image_path = 'http://s3.amazonaws.com/com.rbowers.picam/'+aws_path;
          socket.emit("returnPhoto", { img: image_path });
        });
      }
    });

  });

});
