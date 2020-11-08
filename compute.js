var CryptoJS = require('crypto-js');
var fs = require('browserify-fs');

global.start =  function() {
    
    fs.readFile("RIB_data.pdf", function (cErr, cData){
        try
        {
            
            console.log(cData);
        }
        catch(e)
        {
            console.log(e.message);
            console.log(e.stack);
        }
    });
    }
    
    
    
    global.encrypt = function (plainText,key,iv){
        var C = CryptoJS;
        let keyLen = 256/32
      let ivLen = 128/16
      let keyiv = C.PBKDF2(key, iv, {keySize:keyLen + ivLen, iterations:1000})
      let key1 = C.lib.WordArray.create(keyiv.words.slice(0, keyLen));
      let iv1 = C.lib.WordArray.create(keyiv.words.slice(keyLen, keyLen + ivLen));
        plainText = C.enc.Utf8.parse(plainText);
        var aes = C.algo.AES.createEncryptor(key1, {
          mode: C.mode.CBC,
          blocksize: 128,
          keysize: 256,
          padding: C.pad.Pkcs7,
          iv: iv1
        });
        
        var encrypted = aes.finalize(plainText);
        return C.enc.Base64.stringify(encrypted);
      }
      
      global.decrypt = function (encryptedText, key,iv){
        var C = CryptoJS;
        let keyLen = 256/32
      let ivLen = 128/16
      let keyiv = C.PBKDF2(key, iv, {keySize:keyLen + ivLen, iterations:1000})
      let key1 = C.lib.WordArray.create(keyiv.words.slice(0, keyLen));
      let iv1 = C.lib.WordArray.create(keyiv.words.slice(keyLen, keyLen + ivLen));
      encryptedText = C.enc.Base64.parse(encryptedText);
        var aes = C.algo.AES.createDecryptor(key1, {
          mode: C.mode.CBC,
          padding: C.pad.Pkcs7,
          blocksize: 128,
          keysize: 256,
          iv: iv1
        });
        var decrypted = aes.finalize(encryptedText);
       // console.log("decrypted text: "+decrypted) 
        return C.enc.Utf8.stringify(decrypted);
      }
    
