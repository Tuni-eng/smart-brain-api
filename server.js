const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
  // Enter your own database information here based on what you created
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'redi',
    password : '',
    database : 'smart-brain'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());


//kjo esht per ne kompjuter
//app.get('/', (req, res) => {res.send(database.users)})


//per heroku 
app.get('/', (req, res) => {res.send('it is working')})
//kjo esht per sigin
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})
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