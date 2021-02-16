const express = require('express');

const dbRouter = require('./accounts/account-router.js');

const server = express();

server.use(express.json());

server.use('/api/accounts', dbRouter)

module.exports = server;