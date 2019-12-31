"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
const router = express.Router();
app.use(cors())
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

app.use(require('./routes'));

/// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// const database = new sqlite3.Database("./users.db");

// const createUsersTable = () => {
//   const sqlQuery = `
//         CREATE TABLE IF NOT EXISTS users (
//         id integer PRIMARY KEY,
//         name text,
//         email text UNIQUE,
//         pin integer UNIQUE,
//         password text)`;

//   return database.run(sqlQuery);
// }

// const findUserByEmail = (email, cb) => {
//   return database.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
//     cb(err, row)
//   });
// }

// const findUserByPin = (pin, cb) => {
//   return database.get(`SELECT * FROM users WHERE pin = ?`, [pin], (err, row) => {
//     cb(err, row)
//   });
// }

// const createUser = (user, cb) => {
//   return database.run('INSERT INTO users (name, email, password, pin) VALUES (?,?,?,?)', user, (err) => {
//     cb(err)
//   });
// }

// createUsersTable();

// router.get('/', (req, res) => {
//   res.status(200).send('This is an authentication server');
// });

// router.post('/register', (req, res) => {

//   const name = req.body.name;
//   const email = req.body.email;
//   const password = bcrypt.hashSync(req.body.password);
//   const pin = req.body.pin;

//   createUser([name, email, password, pin], (err) => {
//     if (err) return res.status(500).send("Server error!");
//     findUserByEmail(email, (err, user) => {
//       if (err) return res.status(500).send('Server error!');
//       const expiresIn = 24 * 60 * 60;
//       const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
//         expiresIn: expiresIn
//       });
//       res.status(200).send({
//         "user": user, "access_token": accessToken, "expires_in": expiresIn
//       });
//     });
//   });
// });


// router.post('/login', (req, res) => {
//   const pin = req.body.pin;
//   const email = req.body.email;
//   const password = req.body.password;

//   if (pin) {
//     findUserByPin(pin, cb);
//   } else {
//     findUserByEmail(email, cb);
//   }

//   function cb(err, user) {
//     if (err) return res.status(500).send('Server error!');
//     if (!user) return res.status(404).send('User not found!');
//     if (pin) {
//       const result = pin===user.pin;
//       console.log(result, pin, user.pin);
//       if (!result) return res.status(401).send('Pin not valid!');
//     }
//     if (password) {
//       const result = bcrypt.compareSync(password, user.password);
//       if (!result) return res.status(401).send('Password not valid!');
//     }

//     const expiresIn = 24 * 60 * 60;
//     const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
//       expiresIn: expiresIn
//     });
//     res.status(200).send({ "user": user, "access_token": accessToken, "expires_in": expiresIn });
//   }
// });

// router.get('/mail', (req, res) => {
//   var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     requireTLS: true,
//     auth: {
//       user: 'neelofar.261@gmail.com',
//       pass: 'byewdgyqdytzymwc'
//     }

//   });

//   var mailOptions = {
//     from: 'neelofar.261@gmail.com',
//     to: 'nesulta1@in.ibm.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// })

app.use(router);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('Server listening at http://localhost:' + port);
}); 