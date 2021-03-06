const express = require('express');
const passport = require('passport');
// const SocketIo = require('socket.io');
const initLogger = require('lib/utils/logger');

// helper functions to ensure configuration is applied before loading
const configPassport = require('lib/utils/passport');
const initRouting = require('lib/router');
const initMiddleware = require('lib/middleware');
const configDb = require('lib/utils/db').initDb;
const { initConfig } = require('config');

let server;

const startServer = (app, config) => (
  new Promise((resolve, reject) => {
    // supertest assigns ephemeral ports
    if (__TEST__) {
      return resolve(app);
    }
    const { info } = initLogger('server');
    const { apiPort, apiHost, env } = config;
    return app.listen(apiPort, (err) => {
      if (err) { reject(err); }
      info({ color: ['bold', 'cyan'] },
        `API is listening to address ${apiHost}:%${apiPort}% in %${env}% mode `);
      resolve(app);
    });
  })
);

const initComponents = (config) => {
  const app = express();
  const { debug } = initLogger('server');
  debug('Initializing API Proxy Server');
  return configDb(config)
    .then(models => configPassport(passport, models))
    .then(models => initMiddleware(app, passport, models))
    .then(() => initRouting(app))
    .then(() => startServer(app, config));
};

/* eslint-disable no-console */
const initServer = () => {
  if (!server) {
    server = initConfig()
      .then(config => initComponents(config))
      .then(app => app)
      .catch(console.error);
  }
  return server;
};
/* eslint-enable no-console */

module.exports = initServer;

/*
  *
  * HU: Disabling socket.io server for now
  *
import http from 'http';
const server = new http.Server(app);
const io = new SocketIo(server);
io.path('/ws');
const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

io.on('connection', (socket) => {
  socket.emit('news', {msg: `'Hello World!' from server`});

  socket.on('history', () => {
    for (let index = 0; index < bufferSize; index++) {
      const msgNo = (messageIndex + index) % bufferSize;
      const msg = messageBuffer[msgNo];
      if (msg) {
        socket.emit('msg', msg);
      }
    }
  });

  socket.on('msg', (data) => {
    data.id = messageIndex;
    messageBuffer[messageIndex % bufferSize] = data;
    messageIndex++;
    io.emit('msg', data);
  });
});
io.listen(runnable);
*/
