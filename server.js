'use strict';

/* eslint-disable no-console */

const express = require('express');

const nodemailer = require('nodemailer');

var bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 3000;

/* Adding the middleware for exposing public library */
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get('/', (req, res) => {
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
    to: 'sheer.shweta@gmail.com',
    subject: 'Contact from ' + req.body.name,
    text: req.body.name + ' >>> ' + req.body.message
  };

  console.log('Recording mailing options ', mailOptions);

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
});
});

app.listen(PORT, () => {
  console.log(`Started application on port ${PORT}`);
});
