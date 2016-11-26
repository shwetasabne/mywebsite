'use strict';

/* eslint-disable no-console */

const express = require('express');

const nodemailer = require('nodemailer');

const bodyParser = require('body-parser');

const bunyan = require('bunyan');

const app = express();

const log = bunyan.createLogger({
  name: 'mywebsite',
  streams: [{
    type: 'rotating-file',
    path: '/var/log/shwetasabne.log',
    period: '1d',
  }]
})

const PORT = process.env.PORT || 3000;

/* Adding the middleware for exposing public library */
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get('/', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  log.info(`Received connection request from ${ip}`);
  res.sendFile(`${__dirname}/views/index.html`);
});

app.post('/sendMail', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: req.body.email,
    to: process.env.GMAIL_USER,
    subject: 'Contact from ' + req.body.name,
    text: req.body.name + ' >>> ' + req.body.message
  };
  log.info(mailOptions, 'Attempting to send email')
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        log.info(error, 'Error sending email');
        throw error;
    }else{
        log.info(info, 'Successfully sent email');
        res.json({yo: info.response});
    };
});
});

app.listen(PORT, () => {
  console.log(`Started application on port ${PORT}`);
});
