const express = require('express');
const next = require('next');
const spdy = require('spdy');

const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Adjust the cert directory path to point to scripts/certs
const certDir = path.join(__dirname, 'scripts', 'certs');

// Function to read certificate files with error handling
const readCertFiles = (filename) => {
  const filePath = path.join(certDir, filename);
  try {
    return fs.readFileSync(filePath);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    process.exit(1);
  }
};

// Use the same paths for both dev and production
const options = {
  key: readCertFiles('server.key'),
  cert: readCertFiles('server.cert'),
  spdy: {
    protocols: ['h2', 'http/1.1'],
    plain: false,
    'x-forwarded-for': true
  }
};

app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res) => handle(req, res));

  spdy.createServer(options, server).listen(3333, (err) => {
    if (err) {
      console.error('Failed to start server', err);
      process.exit(1);
    }
    console.log('HTTP/2 server running on https://localhost:3333');
  });
});
