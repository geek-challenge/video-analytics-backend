"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const SECRET_KEY = "secretkey23456";
const database = new sqlite3.Database("./users.db");

const createUsersTable = () => {
  const sqlQuery = `
        CREATE TABLE IF NOT EXISTS users (
        id integer PRIMARY KEY,
        name text,
        email text UNIQUE,
        pin integer UNIQUE,
        password text)`;

  return database.run(sqlQuery);
}


const findUserByEmail = (email, cb) => {
  return database.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
    cb(err, row)
  });
}

const findUserByPin = (pin, cb) => {
  return database.get(`SELECT * FROM users WHERE pin = ?`, [pin], (err, row) => {
    cb(err, row)
  });
}

const createUser = (user, cb) => {
  return database.run('INSERT INTO users (name, email, password, pin) VALUES (?,?,?,?)', user, (err) => {
    cb(err)
  });
}

createUsersTable();
// router.get('/', function (req, res) {
//   res.send('respond with a resource');
// });
router.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password);
  const pin = req.body.pin;

  createUser([name, email, password, pin], (err) => {
    if (err) return res.status(500).send("Server error!");
    findUserByEmail(email, (err, user) => {
      if (err) return res.status(500).send('Server error!');
      const expiresIn = 24 * 60 * 60;
      const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: expiresIn
      });
      res.status(200).send({
        "user": user, "access_token": accessToken, "expires_in": expiresIn
      });
    });
  });
});


router.post('/login', (req, res) => {
  console.log("login")
  const pin = req.body.pin;
  const email = req.body.email;
  const password = req.body.password;

  if (pin) {
    findUserByPin(pin, cb);
  } else {
    findUserByEmail(email, cb);
  }

  function cb(err, user) {
    if (err) return res.status(500).send('Server error!');
    if (!user) return res.status(404).send('User not found!');
    if (pin) {
      const result = pin === user.pin;
      console.log(result, pin, user.pin);
      if (!result) return res.status(401).send('Pin not valid!');
    }
    if (password) {
      const result = bcrypt.compareSync(password, user.password);
      if (!result) return res.status(401).send('Password not valid!');
    }

    const expiresIn = 24 * 60 * 60;
    const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: expiresIn
    });
    res.status(200).send({ "user": user, "access_token": accessToken, "expires_in": expiresIn });
  }
});

module.exports = router;
