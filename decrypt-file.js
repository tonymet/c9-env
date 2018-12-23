var fs = require('fs');
var tar = require('tar')
var openpgp = require('openpgp')
var debug = require('debug')('encrypt-file')


const encryptedFileName = 'tmp/outfile.bin'
var encryptedReadStream = fs.createReadStream(encryptedFileName)

async function pipe(reader, writer){
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        writer.write(value)
    }
}

(async () => {
    
var encryptedTarStream = tar.extract({
        gzip: false,
        cwd: 'tmp/'
        //file: 'tmp/infile.tar'
    })
    debug('encryptedTarStream', encryptedTarStream)
        
        const options = {
            message: await openpgp.message.read(encryptedReadStream), // input as Message object
            passwords: ['secret stuff'], // multiple passwords possible
            armor: false // don't ASCII armor (for Uint8Array output)
        };

       

        openpgp.decrypt(options).then(async function(plaintext) {
            encryptedTarStream.write(plaintext.data)
            debug('written')
        });
    
    
    
    
})()