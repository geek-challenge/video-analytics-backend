"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { emailId, emailAppPassword } = require('../../secrets');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database("./users.db");


const updatePIN = (user) => {
  const data = [user.resetPIN, user.emailTo];
  const sql = `UPDATE users
            SET pin = ?
            WHERE email = ?`;

  database.run(sql, data, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
}

router.post('/', (req, res) => {
  const emailTo = req.body.emailTo; // use emailTo to identify the logged in user
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: emailId,
      pass: emailAppPassword
    }
  });

  const resetPIN = Math.ceil(Math.random(0, 9) * 1000000);
  console.log("resetPIN to ", resetPIN)
  updatePIN({ resetPIN, emailTo });

  var mailOptions = {
    from: emailId,
    to: 'nesulta1@in.ibm.com',
    subject: "Forgot your PIN? Let's get you a new one",
    text: 'Your new PIN is ' + resetPIN + '. Please login using the new PIN.'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send({ status:'success' });
    }
  });
});

module.exports=router;