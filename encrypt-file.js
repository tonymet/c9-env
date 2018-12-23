var fs = require('fs');
var tar = require('tar')
var openpgp = require('openpgp')

var writeStream = fs.createWriteStream('tmp/outfile.bin')


var tarPromise = tar.create({
        gzip: false,
        //file: 'tmp/infile.tar'
    }, ['tmp/testtar'])
    
    console.log(tarPromise)
        
        const options = {
            message: openpgp.message.fromBinary(tarPromise), // input as Message object
            passwords: ['secret stuff'], // multiple passwords possible
            armor: false // don't ASCII armor (for Uint8Array output)
        };

        openpgp.encrypt(options).then(async function(ciphertext) {
            const encrypted = ciphertext.message.packets.write(); // get raw encrypted packets as ReadableStream<Uint8Array>
            console.log(encrypted)
            const reader = openpgp.stream.getReader(encrypted);
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                writeStream.write(value)
            }
            console.log("writing a block", ciphertext.message.packets.length)
        });

       

        openpgp.encrypt(options).then(async function(ciphertext) {
            const encrypted = ciphertext.message.packets.write(); // get raw encrypted packets as ReadableStream<Uint8Array>
            console.log(encrypted)
            const reader = openpgp.stream.getReader(encrypted);
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                writeStream.write(value)
            }
            console.log("writing a block", ciphertext.message.packets.length)
        });
