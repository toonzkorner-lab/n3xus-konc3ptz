const { upload } = require('@vercel/blob/client');
const fs = require('fs');

async function testClientUpload() {
  try {
    const fileContent = fs.readFileSync('./dummy.bin');
    // Mock a File object (Node fetch doesn't have File by default, we can just use a Buffer/Blob if supported, or simulate browser)
    // Actually, in Node 18+, we can use a Blob
    const blobData = new Blob([fileContent]);
    blobData.name = 'dummy.bin';
    
    console.log('Client uploading 6MB file...');
    const blob = await upload('dummy.bin', fileContent, {
      access: 'public',
      handleUploadUrl: 'http://localhost:3001/api/blob-upload',
      multipart: true
    });
    console.log('Success!', blob.url);
  } catch (error) {
    console.error('Client upload failed:');
    console.error(error);
  }
}

testClientUpload();
