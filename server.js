const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

//dhe kto jan importe por nga filet q kemi kriju
const register = require('./controllers/register'); // kjo brenda kllapave quhet path
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({  //kte e kthejm ne function
	client: 'pg', //e lifhim me postgresin
    connection: {
	    host : '127.0.0.1',// trregojm se ku esh databse ne platforem host. esht si shpi locactioni
	    user : 'posgres',
	    password : '123',
	    database : 'smart-brain'
  }
});
 
const app = express();


// kjo esht midleware dhe bohert me aktivizu bodyparse
app.use(bodyParser.json()); 
//kjo perdoret me lidh front-end me back-end
app.use(cors());

app.get('/', (req, res) => {res.send(database.users)})
//kjo esht per sigin
app.post('/signin',  signin.handleSignin(db, bcrypt)) //metode e avancuar. i mer direkt request dhe response
//kjo esht per register
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)}) //kto mrena kllapes bohen qe te njefen ne register.js
// kjo esht per users. del lart id personale per cdo user
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
// image qe sa her fut foto te shenohet tek entries
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})


app.listen(process.env.PORT || 3000, ()=> { //kjo trregon se ne cfare porte do hapet ne cfar hosti
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