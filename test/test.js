var assert = require("assert"),
    wcUtils = require("../utils/utils");

describe('Utils', function() {
  describe('EncryptDecrypt', function() {
    it('Should correctly parse strings for encryption and decryption.', function() {
      var input = "test_encryption_string";
      var enc = wcUtils.encrypt(input);
      var dec = wcUtils.decrypt(enc);
      assert.equal(input, dec);
    });
  });

  describe('EncryptDecryptObject', function() {
    it('Should also correctly deal with objects in JSON format.', function() {
      var input = {
        key: "value",
        anotherKey: {
          deepKey: "deepValue"
        }
      };
      var enc = wcUtils.encryptObject(input);
      var dec = wcUtils.decryptObject(enc);
      assert.deepEqual(input, dec);
    });
  });
});
