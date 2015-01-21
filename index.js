var exec = require('child_process').exec;
var s3 = require('s3');

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

var image_path = 'media/pic-' + Date.now() + '.jpg',
    cmd = 'raspistill -o ' + image_path;

exec(cmd, function(error, stdout, stderr) {
  // output is in stdout
  if(error) {
    console.log('Error : ', error);
  } else {
    console.log('Image Saved @ : ', image_path);
    var params = {
      localFile: image_path,
      s3Params: {
        Bucket: "com.rbowers.picam"
        Key: image_path,
        // other options supported by putObject, except Body and ContentLength.
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      },
    };
    var uploader = client.uploadFile(params);
    uploader.on('error', function(err) {
      console.error("unable to upload:", err.stack);
    });
    uploader.on('progress', function() {
      console.log("progress", uploader.progressMd5Amount,
      uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function() {
      console.log("done uploading");
    });
  }
});
