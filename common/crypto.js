const crypto = require('crypto');
const password = 'meoqi@123';
const encryption_type =  'aes-128-cbc';
const iv = crypto.randomBytes(16);
const key = crypto.pbkdf2Sync('meoquiTheBomb', 'mandragora', 100, 16, 'sha512');


let encrypt = (jwtToken) => {
    let cipher = crypto.createCipheriv(encryption_type, Buffer.from(key), iv);
    let encrypted = cipher.update(jwtToken);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

let decrypt = (encryptedToken) => {
    // let iv = Buffer.from(encryptedToken.iv, 'hex');
    // let encryptedText = Buffer.from(encryptedToken.encryptedData, 'hex');
    let textParts = encryptedToken.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(encryption_type, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    encrypt, decrypt
}