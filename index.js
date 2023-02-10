require('dotenv').config()
const express = require('express');
const body_parser = require('body-parser');
const handler = require('./handler/index');
const morgan = require('morgan');
const {
  PORT, 
  API
} = process.env

const app = express().use(body_parser.json());
// morgan logger
app.use(morgan('dev'))

app.listen(PORT, () => { console.log('Listening on Port '  + PORT)});

app.get('/webhook', handler.webhook.callbackUrl);
app.post('/webhook', handler.webhook.listenToCustomer);

