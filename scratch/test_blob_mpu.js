const { put } = require('@vercel/blob');
const fs = require('fs');

async function testUpload() {
  try {
    const fileContent = fs.readFileSync('./dummy.bin');
    console.log('Uploading ' + fileContent.length + ' bytes...');
    const blob = await put('dummy.bin', fileContent, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      multipart: true
    });
    console.log('Success!', blob.url);
  } catch (error) {
    console.error('Upload failed:');
    console.error(error);
  }
}

testUpload();
