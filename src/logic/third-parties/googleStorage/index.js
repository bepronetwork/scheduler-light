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

    uploadFile = ({bucketName, file, name}) => {
        const fileNameCSV    = `${name}.csv`;
        const path           = 'balance/';

        return new Promise((resolve, reject) => {

            let columns = {
                id      : 'id',
                balance : 'balance'
            };

            stringify(file, { header: true, columns: columns }, async (err, output) => {
                fs.writeFileSync(`${path}${fileNameCSV}`, output, 'utf8');

                await this.storage.bucket(bucketName).upload(`${path}${fileNameCSV}`, {
                    gzip: true,
                    metadata: {
                    cacheControl: 'no-cache',
                    },
                });

                // Makes the file public
                await this.storage
                .bucket(bucketName)
                .file(fileNameCSV)
                .makePublic();

                // Remove File
                fs.unlinkSync(`${path}${fileNameCSV}`);
                resolve(`https://storage.googleapis.com/${bucketName}/${name}.csv`);
            });
        });
    }
}


let GoogleStorageSingleton = new GoogleStorage();

export default GoogleStorageSingleton;