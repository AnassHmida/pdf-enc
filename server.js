var express = require("express");
var app = express();
var CryptoJS = require('crypto-js');
var mcrypt = require('js-rijndael');
var fs = require('fs');
var filedata;
var password = "H2n97wHwJ6bFYBPIJjtyNFeiR3JGwSoCfQH6Z19yiks="
var salt = "dBi+jmP3tLgHvTVn9hwuKg=="

app.get('/enc', function (req, res) {
//   res.sendFile(path.join(__dirname+'/index-dec.html'));
  startencrypt();
  //startEncryptionStream();
  //__dirname : It will resolve to your project folder.
});

app.get('/dec', function (req, res) {
  // res.sendFile(path.join(__dirname+'/index.html'));
 
  startdecrypt();
//startdecrypt();
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
  plainText = C.enc.Latin1.parse(plainText);
  var aes = C.algo.AES.createEncryptor(key1, {
    mode: C.mode.CBC,
    blocksize: 128,
    keysize: 256,
    padding: C.pad.Pkcs7,
    iv: iv1
  });
  var encrypted = aes.finalize(plainText);
  return C.enc.Latin1.stringify(encrypted);
}

function decrypt(encryptedText, key, iv) {
  var C = CryptoJS;
  let keyLen = 256 / 32
  let ivLen = 128 / 16
  let keyiv = C.PBKDF2(key, iv, { keySize: keyLen + ivLen , iterations: 1000})
  let key1 = C.lib.WordArray.create(keyiv.words.slice(0, keyLen));
  let iv1 = C.lib.WordArray.create(keyiv.words.slice(keyLen, keyLen + ivLen));
  encryptedText = C.enc.Latin1.parse(encryptedText);
  var aes = C.algo.AES.createDecryptor(key1, {
    mode: C.mode.CBC,
    padding: C.pad.Pkcs7,
    blocksize: 128,
    keysize: 256,
    iv: iv1
  });
  var decrypted = aes.finalize(encryptedText);
  return C.enc.Latin1.stringify(decrypted);
}


function handleChunk(value,chunk){
 // data = decrypt(data, password, salt);
  // chunk = decrypt(chunk, password, salt);
  if(value){
 /* fs.writeFile("decryption/data-decrypted.pdf", chunk,{encoding: 'base64'}, function (err) {
        if (err) {
          return console.log(err)
        }
      })*/
      var buf = Buffer.from(filedata);
      buf = buf.toString()
      console.log

  }else{
    console.log(chunk)
    filedata =+ chunk
  }
   
    
}
const readBufferBytes = (buffer, callback, index=0) => {
 // console.log("text wkahaw");
  if(!Buffer.isBuffer(buffer)) return callback(new Error('Invalid value for buffer has been provided'));
  if (typeof callback !== 'function') return callback(new Error('The callback is not a function'));
  try {
    
    return process.nextTick(()=>{
        if(buffer.length<index){
        callback(null, buffer.readUInt8(index));
        readBufferBytes(buffer,callback,index+1);
      }else{
       // callback(e);
      }
    });
  } catch(e) {
     return process.nextTick(()=>{
      //console.log("done") 
      //callback(e);
    });
  }

}

function decryptTest(encryptedText, key, iv) {
 // encryptedByteArray = mcrypt.encrypt(clearMessage, iv, key, cipherName, mode);
 
 encryptedText = mcrypt.decrypt(encryptedText, iv, key, "rijndael-256", 'cbc');
  return encryptedText;
}

function startDecryptionStream(){
  var stream;
  stream = fs.createReadStream("encryption/data-encrypted.pdf", {encoding: 'base64'});
  stream.on("data", function(data) {
      var chunk = data.toString();
      //console.log(chunk)
      const buffer = new Buffer(chunk, 'base64')
      console.log(buffer)
      readBufferBytes(buffer,handleChunk,0);;

    //  chunk = decrypt(chunk, password, salt);
    /*  fs.writeFile("decryption/data-decrypted.pdf", data,{encoding: 'base64'}, function (err) {
        if (err) {
          return console.log(err)
        }
      })*/

  }); 
}
/*
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

  fs.readFile('encryption/data.pdf', {encoding: 'binary'}, function (cErr, data) {
    try {

      data = encrypt(data, password, salt)
      fs.writeFile("encryption/data-encrypted.pdf", data, {encoding: 'binary'} , function (err) {
        if (err) {
          return console.log(err)
        } else {
          fs.readFile('encryption/data-encrypted.pdf', {encoding: 'binary'}, function (cErr, data) {
            try {
              data = decrypt(data, password, salt);
              fs.writeFile("encryption/data-decrypted.pdf", data,{encoding: 'binary'}, function (err) {
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
     
          fs.readFile('decryption/data.pdf', {encoding: 'binary'}, function (cErr, data) {

            try {
              //console.log("binary",data)
              data = decrypt(data, password, salt);
              fs.writeFile("decryption/data-decrypted.pdf", data,{encoding: 'binary'}, function (err) {
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



function decryptTesting() {
    
  fs.readFile('decryption/data.pdf', {encoding: 'binary'}, function (cErr, data) {

    try {
      //console.log("My data : ",data)
      data = startDecryptionStream();
     // data = decryptTest(data, password, salt);
      fs.writeFile("decryption/data-decrypted.pdf", data,{encoding: 'binary'}, function (err) {
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


