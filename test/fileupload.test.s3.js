var assert = require('assert')
  , path = require('path')
  , mime = require('mime')
  , s3Module = require('../lib/modules/s3')
  , temp = require('temp')
  , request = require('request')
  , adapter = 's3'
  
describe('fileupload (' + adapter + ')', function () {
  describe('#put()', function () {
    var filePath = __dirname + '/files/test1.gif'
      , uploadDir = 'test'

    it('successfully puts a file when given a file path', function (done) {
      var put = s3Module(uploadDir).put

      put(filePath, function (error, file) {
        console.log.apply(this, arguments)
        
        assert.equal('object', typeof file)
        request(file.url, function(err){
          assert.equal(null, err)
        });
      })
    })
/*
    it('returns the correct file mime type', function (done) {
      var put = s3Module(uploadDir).put

      put(filePath, function (error, file) {
        assert.equal(file.type, mime.lookup(filePath))
        done()
      })
    })

    it('returns the correct file size', function (done) {
      var put = s3Module(uploadDir).put

      put(filePath, function (error, file) {
        fs.stat(filePath, function (error, stats) {
          assert.equal(file.size, stats.size)
          done()
        })
      })
    })
*/
    it('returns an error if file doesnt exist', function (done) {
      var put = s3Module(uploadDir).put

      put('test-fake-file.gif', function (error) {
        assert.equal(false, error === null)
        assert(error instanceof Error)
        assert.equal('ENOENT', error.code)
        done()
      })
    })

    it('stores the file in a folder named as an md5 hash of the file', function (done) {
      var put = s3Module(uploadDir).put

      put(filePath, function (error, file) {
        s3Module.getFileHash(filePath, function (error, hash) {
          // Removing the trailing slash from the file path
          file.path = file.path.slice(0, -1)
          assert.equal(file.path, hash)
          done()
        })
      })
    })

  })
/*
  describe('#get()', function () {
    var options = helpers.defaultOptions('/get-test')
      , fileName = '/files/test1.gif'
      , filePath = __dirname + fileName
      , uploadDir = options
      , storedFile


    before(function (done) {
      var put = helpers.setupPut(options, adapter)

      put(filePath, function (error, file) {
        storedFile = file
        done()
      })
    })

    it('returns the file when passed a file object', function (done) {
      var get = helpers.setupGet(options, adapter)
      get(storedFile, function (error, file) {
        assert(file instanceof Buffer)
        done()
      })
    })

    it('returns the file when passed a file path', function (done) {
      var get = helpers.setupGet(options, adapter)

      get(path.join(storedFile.path, storedFile.basename), function (error, file) {
        assert(file instanceof Buffer)
        done()
      })
    })

    it('returns an error if file does not exist', function (done) {
      var get = helpers.setupGet(options, adapter)

      get('test-fake-file.gif', function (error) {
        assert.equal(false, error === null)
        assert(error instanceof Error)
        assert.equal('ENOENT', error.code)
        done()
      })
    })

    describe('Streams', function () {
      it('writes file data to a stream', function (done) {
        var getAsReadStream = helpers.setupGetAsReadStream(options, adapter)
          , writeStream = temp.createWriteStream()
          , readStream = getAsReadStream(storedFile)

        writeStream.on('close', function (err) {
          assert(typeof err === 'undefined')
          done()
        })

        assert(readStream instanceof fs.ReadStream)

        readStream.pipe(writeStream)
      })
    })

    after(helpers.afterEach(uploadDir))
  })

  describe('#delete()', function () {
    var options = helpers.defaultOptions('/delete-test')
      , filePath = __dirname + '/files/test1.gif'
      , uploadDir = options
      , storedFile
      , storedFilePath


    before(function (done) {
      var put = s3Module(uploadDir).put

      put(filePath, function (error, file) {
        storedFile = file
        storedFilePath = path.join(storedFile.path, storedFile.basename)

        done()
      })
    })

    it('deletes the file when passed a file object', function (done) {
      var remove = helpers.setupDelete(options, adapter)

      remove(storedFile, function () {
        fs.stat(storedFilePath, function (error) {
          assert.equal('ENOENT', error.code)
          done()
        })
      })
    })

    it('deletes the file when passed a file path', function (done) {
      var remove = helpers.setupDelete(options, adapter)

      remove(storedFilePath, function () {
        fs.stat(storedFilePath, function (error) {
          assert.equal('ENOENT', error.code)
          done()
        })
      })
    })

    after(helpers.afterEach(uploadDir))
  })
  */
})