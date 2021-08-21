const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  // connect to your own database here
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'aneagoie',
    password : '',
    database : 'smart-brain'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})
//kjo bohet per herokun 
app.listen(process.env.PORT || 3000, ()=> { 
	console.log(`app is running on port ${process.env.PORT}`);
})



//kjo esh per kur e kemi ne lepatop jo online
// app.listen(3000, ()=> { //kjo trregon se ne cfare porte do hapet ne cfar hosti
// 	console.log('app is running on port 3000');
// })

/* menyra se si do i rradhisim 
/ --> res = this is working
/ signin --> POST = success/fail
/ register --> POST = user
/ profile/:userId --> GET = user
/ image --> PUT --> user
*/

/* menyra e bcrypt per me roujt te dhenat 
/1 per regiter
bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});

/2 per signin
// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});
*/