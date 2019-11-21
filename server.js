/*
/   --> res = this is working
/   signin --> POST = success/fail      this is a POST because we don't want to pass sensitive information as a queryString (for GET)
/   register --> POST =  user
/   profile/:userId --> GET = user
/   
*/

const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');

// Controllers
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',       // equals to home
      user : 'postgres',
      password : 'test',
      database : 'greener-light'
    }
  });

  db.select('*').from('users').then(data => {         // don't need to do JSON b/c we are not sending it through http
    //console.log(data);
  });

const app = express();
app.use(express.json());        // DONT FORGET TO PARSE TO JSON
app.use(cors());


// Get from the root -> yields a list of all users.
app.get('/', (req, res) => { res.send(database.users) })

app.post('/signin', signin.handleSignin(db, bcrypt))

// dependency injection, we're injecting whatever dependencies handleRegister function needs to be able to run
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })


app.listen(3000, () => {
    console.log ('App is running on port 3000.');
});

