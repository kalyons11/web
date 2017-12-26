const assert = require("assert"),
      wcUtils = require("../utils/utils"),
      request = require("request")

const URL = 'https://kevinalyons.com'

describe('Utils', function() {
  describe('EncryptDecrypt', function() {
    it('Should correctly parse strings for encryption and decryption.', function() {
      var input = "test_encryption_string"
      var enc = wcUtils.encrypt(input)
      var dec = wcUtils.decrypt(enc)
      assert.equal(input, dec)
    })
  })

  describe('EncryptDecryptObject', function() {
    it('Should also correctly deal with objects in JSON format.', function() {
      var input = {
        key: "value",
        anotherKey: {
          deepKey: "deepValue"
        }
      }
      var enc = wcUtils.encryptObject(input)
      var dec = wcUtils.decryptObject(enc)
      assert.deepEqual(input, dec)
    })
  })
})

describe('WebStatus', function() {
  describe('MainPage', function() {
    it('Should return a good status code when getting the main page.', (done) => {
      var options = {
        url: URL,
        method: 'GET'
      }
      request(options, (err, res, body) => {
        assert.equal(res.statusCode, 200)
        done()
      })
    })
  })

  describe('CoursesPage', function() {
    let options = {
      url: URL + '/courses',
      method: 'GET'
    }

    it('Should return a good status code when getting the courses page.', (done) => {
      request(options, (err, res, body) => {
        assert.equal(res.statusCode, 200)
        done()
      })
    })

    it('Should have some good content in the page.', (done) => {
      request(options, (err, res, body) => {
        assert(res.body.indexOf('6.004') > -1)
        done()
      })
    })
  })

  describe('BadPage', function() {
    let options = {
      url: URL + '/random',
      method: 'GET'
    }

    it('Should return a bad status code when getting a random page.', (done) => {
      request(options, (err, res, body) => {
        assert.equal(res.statusCode, 404)
        done()
      })
    })

    it('Should have some good error message in the page.', (done) => {
      request(options, (err, res, body) => {
        let message = 'We were unable to find the requested resource at <b>/random</b>.'
        assert(res.body.indexOf(message) > -1)
        done()
      })
    })
  })
})
