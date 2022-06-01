const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { ExpressPeerServer } = require('peer');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 9000;

app.get('/server-timestamp', (req, res, next) => res.json({serverTimestamp: Date.now}));

const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
    debug: true,
    generateClientId: crypto.randomUUID
});

app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/peerjs', peerServer);

server.listen(PORT);
