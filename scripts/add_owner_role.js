const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace session.user.role and user.role
  content = content.replace(/(session\.)?user\.role (!==|===) (['"])ADMIN\3/g, (match, p1, p2, p3) => {
    const prefix = p1 ? 'session.user.role' : 'user.role';
    if (p2 === '!==') return `(${prefix} !== 'ADMIN' && ${prefix} !== 'OWNER')`;
    if (p2 === '===') return `(${prefix} === 'ADMIN' || ${prefix} === 'OWNER')`;
  });

  // Replace token?.role
  content = content.replace(/token\?\.role (!==|===) (['"])ADMIN\2/g, (match, p1, p2) => {
    if (p1 === '!==') return `(token?.role !== 'ADMIN' && token?.role !== 'OWNER')`;
    if (p1 === '===') return `(token?.role === 'ADMIN' || token?.role === 'OWNER')`;
  });

  // Replace standalone role === 'ADMIN' (in places like `const isAdmin = role === "ADMIN";` if any)
  // We use negative lookbehind to avoid matching user.role or session.user.role or token?.role
  // Since js regex lookbehind requires ES2018, it's supported in Node 10+.
  content = content.replace(/(?<!user\.|token\?\.)role (!==|===) (['"])ADMIN\2/g, (match, p1, p2) => {
    if (p1 === '!==') return `(role !== 'ADMIN' && role !== 'OWNER')`;
    if (p1 === '===') return `(role === 'ADMIN' || role === 'OWNER')`;
  });

  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log('Updated:', filePath);
  }
}

walkDir('./src', processFile);
console.log('Done.');
