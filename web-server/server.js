const express = require('express');
const next = require('next');
const spdy = require('spdy');

const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
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
