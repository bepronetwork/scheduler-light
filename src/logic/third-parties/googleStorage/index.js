// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import stringify from 'csv-stringify';
const crypto = require('crypto');
const {Base64Encode} = require('base64-stream');

require('dotenv').config();

class GoogleStorage{
    constructor(){
        this.storage = new Storage({keyFilename : 'keys.json'});
    }

    // Creates the new bucket
    createBucket = async ({bucketName}) => {
        return await this.storage.createBucket(bucketName);
    }

    _streamCSVToCryptoAsync = (fileNameCSV, fileNameCRYPTO, path = 'balance/')=>{
        return new Promise((resolve)=>{
            const read   = fs.createReadStream(`${path}${fileNameCSV}`);
            const write  = fs.createWriteStream(`${path}${fileNameCRYPTO}`);
            const cipher = crypto.createCipher('aes192', process.env.PASSWORD_CRYPTO);
            read
            .pipe(cipher)
            .pipe(new Base64Encode())
            .pipe(write)
            .on('finish', resolve);
        });
    }

    uploadFile = ({bucketName, file, name}) => {
        const fileNameCSV    = `${name}.csv`;
        const fileNameCRYPTO = `${name}.crypto`;
        const path           = 'balance/';

        return new Promise((resolve, reject) => {

            let columns = {
                id      : 'id',
                balance : 'balance'
            };

            stringify(file, { header: true, columns: columns }, async (err, output) => {
                fs.writeFileSync(`${path}${fileNameCSV}`, output, 'utf8');
                console.log('>>>>>>>>>>>>>>>>>>>>>>>');

                await this._streamCSVToCryptoAsync(fileNameCSV, fileNameCRYPTO);

                await this.storage.bucket(bucketName).upload(`${path}${fileNameCRYPTO}`, {
                    gzip: true,
                    metadata: {
                    cacheControl: 'public, max-age=31536000',
                    },
                });

                // Makes the file public
                await this.storage
                .bucket(bucketName)
                .file(fileNameCRYPTO)
                .makePublic();

                // Remove File
                fs.unlinkSync(`${path}${fileNameCSV}`);
                fs.unlinkSync(`${path}${fileNameCRYPTO}`);
                resolve(`https://storage.googleapis.com/${bucketName}/${name}.crypto`);
            });
        });
    }
}


let GoogleStorageSingleton = new GoogleStorage();

export default GoogleStorageSingleton;