var fs = require('fs');
var tar = require('tar')
var openpgp = require('openpgp')
var debug = require('debug')('encrypt-file')

var writeStream = fs.createWriteStream('tmp/outfile.bin')

async function pipe(reader, writer){
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        writer.write(value)
    }
}

var tarStream = tar.create({
        gzip: false,
        //file: 'tmp/infile.tar'
    }, ['tmp/testtar'])
    
    debug(tarStream)
        
        const options = {
            message: openpgp.message.fromBinary(tarStream), // input as Message object
            passwords: ['secret stuff'], // multiple passwords possible
            armor: false // don't ASCII armor (for Uint8Array output)
        };

       

        openpgp.encrypt(options).then(async function(ciphertext) {
            const encrypted = ciphertext.message.packets.write(); // get raw encrypted packets as ReadableStream<Uint8Array>
            debug(encrypted)
            const reader = openpgp.stream.getReader(encrypted);
            await pipe(reader, writeStream)
            debug("writing a block", ciphertext.message.packets.length)
        });
