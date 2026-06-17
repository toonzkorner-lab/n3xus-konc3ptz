const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes(`handleUploadUrl: '/api/blob-upload'`)) {
    content = content.replace(/handleUploadUrl: '\/api\/blob-upload'/g, `handleUploadUrl: '/api/blob-upload',\n          multipart: true`);
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  }
});
