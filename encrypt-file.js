var fs = require('fs');
var openpgp = require('openpgp')
var readStream = fs.createReadStream('tmp/infile.tar');
var writeStream = fs.createWriteStream('tmp/outfile.bin')

const options = {
    message: openpgp.message.fromBinary(readStream), // input as Message object
    passwords: ['secret stuff'],                         // multiple passwords possible
    armor: false                                         // don't ASCII armor (for Uint8Array output)
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