require('dotenv').config();
const { BlobServiceClient } = require('@azure/storage-blob');
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.CONTAINER_NAME;
const URL_BLOB_STORAGE = process.env.URL_BLOB_STORAGE;

const azureUploadImage = async (path, mimetype, filename) => {
    const options = { blobHTTPHeaders: { blobContentType: mimetype }};
    const blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerName = CONTAINER_NAME;
    const containerClient = await blobServiceClient.getContainerClient(containerName);
    const blobName = filename;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(path, options)

    return `${URL_BLOB_STORAGE}${blobName}`;
}

module.exports = azureUploadImage;

/* const { BlobServiceClient, ContainerClient } = require('@azure/storage-blob');
const sasToken = process.env.STORAGE_SAS_TOKEN || "";
const urlStorageAccount = process.env.URL_BLOB_STORAGE;
const containerName = process.env.CONTAINER_NAME;
const getStream = require('into-stream');

const blobServiceClient = new BlobServiceClient(`${urlStorageAccount}`);

const containerClient = blobServiceClient.getContainerClient(containerName);

// Upload images
// const azureUploadImage = async (file) => {
//     const {filename, mimetype, createReadStream} = await file;
//     const buffer = getStream(createReadStream);
//     const blobClient = containerClient.getBlockBlobClient(filename);
//     const options = { blobHTTPHeaders: { blobContentType: mimetype }};

//     console.log('¡==================== Uploading file ==================!');
//     const uploadBlobResponse = await blobClient.uploadFile(filename, options);
//     console.log('¡==================== File uploaded seccess! ==========!');
//     console.log(uploadBlobResponse);
//     // return `${process.env.URL_BLOB_STORAGE}${blobName}`;
// }

// Upload files text
const azureUploadImage = async (file) => {
    const {filename, createReadStream, mimetype} = await file;
    const blobName = filename;
    const stream = await createReadStream();
    const buffer = Buffer.from(JSON.stringify(stream));
    console.log( typeof buffer);
    const streamLength = Object.keys(buffer).length;
    const options = { blobHTTPHeaders: { blobContentType: mimetype }};

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log('¡==================== Uploading file ==================!');
    const uploadBlobResponse = await blockBlobClient.uploadStream(buffer, streamLength);
    console.log('¡==================== File uploaded seccess! ==========!');
    console.log(uploadBlobResponse);
    // return `${process.env.URL_BLOB_STORAGE}${blobName}`;
}

// get blob (files) from blob storage
const getBlob = async () => {
    for await (const blob of containerClient.listBlobsFlat()) {
        console.log('\t', blob.name);
    }
}

module.exports = azureUploadImage; */

/* const azureStorage = require('azure-storage')
const blobService = azureStorage.createBlobService();
const getStream = require('into-stream');
const containerName = process.env.CONTAINER_NAME;

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};

const azureUploadImage = async (file) => {
    const {filename, mimetype, createReadStream} = await file;
    const  blobName = filename;
    const stream = await createReadStream();
    const streamLength = Object.keys(stream).length;

    const options = { blobHTTPHeaders: { blobContentType: mimetype }};

    await blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, function(error, result, response) {
        if (!error) {
            console.log('File uploaded');
        } else {
            console.log('Error => ', error);
        }
      });

    

    // blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {

    //     if(err) {
    //         handleError(err);
    //         return;
    //     }

    //     console.log('File uploaded')
    // });
}

module.exports = azureUploadImage; */