var tar = require('tar')
var openpgp = require('openpgp')
var fs = require('fs');

var debug = require('debug')('encrypt-file');
var encryptedFileName = 'tmp/outfile.bin';
var encryptedReadStream = fs.createReadStream(encryptedFileName);


(async() => {
    var encryptedTarStream = tar.extract({
        gzip: false,
        cwd: 'tmp/',
        strict: true,
        onentry: debug
    })
    debug('encryptedTarStream', encryptedTarStream)
    const options = {
        message: await openpgp.message.read(encryptedReadStream), // input as Message object
        passwords: ['secret stuff'], // multiple passwords possible
        armor: false // don't ASCII armor (for Uint8Array output)
    };
    openpgp.decrypt(options).then(async function(plaintext) {
        debug(plaintext.data)
        plaintext.data.unpipe()
        await plaintext.data.pipe(encryptedTarStream)
        debug('written')
    });

})()
