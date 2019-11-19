/*
/   --> res = this is working
/   signin --> POST = success/fail      this is a POST because we don't want to pass sensitive information as a queryString (for GET)
/   register --> POST =  user
/   profile/:userId --> GET = user
/   
*/

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());        // DONT FORGET TO PARSE TO JSON
app.use(cors());

const database = {
    users:[
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            joined: new Date()
        }
    ]
}

// Get from the root yields a list of all users.
app.get('/', (req, res) => {
    res.send(database.users);
})

// SIGN-IN
app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0])
    } else {
        res.status(404).json('Error logging in.');
    }
});

// REGISTER
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    // TODO hash password
    database.users.push({
        id: '125',
        name: name,
        email: email,
        //password: password,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
});

//PROFILE
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    })
    if(!found){
        res.status(400).json('not found.');
    }
})


app.listen(3000, () => {
    console.log ('App is running on port 3000.');
});

