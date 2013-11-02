var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , crypto = require('crypto')
  , mime = require('mime')
  , request = require('request')
  , s3 = require('s3')

module.exports = function (uploadDir) {
  
  var client = s3.createClient({
    secure: false,
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET
  });
  function put(file, callback) {

    async.waterfall([
      function (callback) {

        // Checking if the file is a path
        if (typeof file === 'string') {
          var fileType = mime.lookup(file)
            , size

          getFileHash(file, function (error, name) {
            if (error) return callback(error)

            fs.stat(file, function (error, stats) {
              if (error && error.code === 'ENOENT') {
                return callback(error)
              }

              size = stats.size
              file = fs.createReadStream(file)
              file.name = path.basename(file.path)
              file.type = fileType
              file.size = size
              callback(null, name)
            })
          })
        } else {
          getFileHash(file.path, callback)
        }
      },
      function (name, callback) {
        var tempLocation = file.path
          , destPath = path.join(uploadDir, name, file.name)
          
        var uploader = client.upload(tempLocation, destPath);
        uploader.on('error', callback);
        uploader.on('end', function(url) {
          callback(null, {
            size: file.size
          , type: file.type
          , path: name + '/'
          , basename: file.name
          , url: url//.substr(0,url.length-destPath.length)
          })
        });
      }
    ], callback)

  }

  function getFilePath(file) {
    return typeof file === 'string' ? file : path.join(file.path, file.basename)
  }
  function getFileURL(file) {
    return typeof file === 'string' ? file : file.url + '/' + path.join(uploadDir, file.path, file.basename)
  }

  function get(file, callback) {
    request(getFileURL(file), function(err, res, body){
      callback(err, body)
    });
  }

  function getAsReadStream(file, options) {
    return request(getFileURL(file), options)
  }

  function remove(file, callback) {
    client.knox.deleteFile(getFilePath(file))
  }

  return {
    put: put,
    get: get,
    getAsReadStream: getAsReadStream,
    'delete': remove
  }
}

module.exports.getFileHash = getFileHash

// Generate MD5 hash based on file content to stop double upload
function getFileHash(filePath, callback) {
  fs.readFile(filePath, 'utf-8', function (error, file) {
    if (error) return callback(error)

    callback(null, crypto.createHash('md5').update(file).digest('hex'))
  })
}