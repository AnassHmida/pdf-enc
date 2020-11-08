var express = require("express");
var app = express();
var CryptoJS = require('crypto-js');
var fs = require('fs');
var password = "rEISpHI9IohceN4wd7zLZhZwAkuKRddYisMf7hBJ/3Y="
var salt = "87TB4/tp7sQMaSUiS6gJ4w=="

app.get('/enc', function (req, res) {
//   res.sendFile(path.join(__dirname+'/index-dec.html'));
  startencrypt();
  //startEncryptionStream();
  //__dirname : It will resolve to your project folder.
});

app.get('/dec', function (req, res) {
  // res.sendFile(path.join(__dirname+'/index.html'));
 startdecrypt();
// startDecryptionStream();
  //__dirname : It will resolve to your project folder.
});




function encrypt(plainText, key, iv) {
  var C = CryptoJS;
  let keyLen = 256 / 32
  let ivLen = 128 / 16
  let keyiv = C.PBKDF2(key, iv, { keySize: keyLen + ivLen, iterations: 1000 })
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

function decrypt(encryptedText, key, iv) {
  var C = CryptoJS;
  let keyLen = 256 / 32
  let ivLen = 128 / 16
  let keyiv = C.PBKDF2(key, iv, { keySize: keyLen + ivLen, iterations: 1000 })
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

/*
function startDecryptionStream(){
  var stream;
  stream = fs.createReadStream("encryption/data-encrypted.pdf", {encoding: 'base64'});
  stream.on("data", function(data) {
      var chunk = data.toString();
      chunk = decrypt(chunk, password, salt);
      fs.writeFile("decryption/data-decrypted.pdf", data,{encoding: 'base64'}, function (err) {
        if (err) {
          return console.log(err)
        }

      })

  }); 
}

function startEncryptionStream() {

  var stream;
  stream = fs.createReadStream("encryption/data.pdf", {encoding: 'base64' });
  stream.on("data", function(data) {
      var chunk = data.toString();
      chunk = encrypt(chunk, password, salt);
     // fs.createWriteStream()
      console.log(chunk);
   
      fs.writeFile("encryption/data-encrypted.pdf", data,{encoding: 'base64'}, function (err) {
        if (err) {
          return console.log(err)
        }

      })
  }); 
}*/



function startencrypt() {

  fs.readFile('encryption/data.pdf', 'base64', function (cErr, data) {
    try {

      data = encrypt(data, password, salt)
      fs.writeFile("encryption/data-encrypted.pdf", data, {encoding: 'base64'} , function (err) {
        if (err) {
          return console.log(err)
        } else {
          fs.readFile('encryption/data-encrypted.pdf', 'base64', function (cErr, data) {

            try {
              data = decrypt(data, password, salt);
              fs.writeFile("encryption/data-decrypted.pdf", data,{encoding: 'base64'}, function (err) {
                if (err) {
                  return console.log(err)
                }

              })
            } catch (e) {
              console.log(e.message);
              console.log(e.stack);
            }
          });
         }
        });


        } catch (e) {
          console.log(e.message);
          console.log(e.stack);
        }
      });
    
      
    } 
    
    

function startdecrypt() {


    
          fs.readFile('decryption/data.pdf', 'base64', function (cErr, data) {

            try {
              data = decrypt(data, password, salt);
              fs.writeFile("decryption/data-decrypted.pdf", data,{encoding: 'base64'}, function (err) {
                if (err) {
                  return console.log(err)
                }

              })
            } catch (e) {
              console.log(e.message);
              console.log(e.stack);
            }
          });
         
   


     
    
      
    } 



//loading all files in public folder
//see instructions in https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

      app.listen(8080);

      console.log("Running at Port 8080");


