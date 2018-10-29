const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const app = express();

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'makisa123',
    database : 'postgres'
  }
});

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  db.select('email', 'password').from('login')
    .where('email', '=', email)
    .then(data => {
      //const isValid = bcrypt.compareSync(password, data[0].password);
      if (data[0].password === password) {
        return db.select('*').from('users')
          .where('email', '=', email)
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

//req will give date, which slot, and username
app.put('/bookslot', (req, res) => {
  const {date, slot, username} = req.body;

  db('slot').insert({date: date, slot: slot, username: username})
  .then(() => {return res.json("insert successful")})
  .catch(err => res.json("insert failed"))
})


app.delete('/bookslot', (req, res) => {
  const {date, slot, username} = req.body;
  db('slot')
  .where({
    date: date,
    slot: slot,
    username: username
  })
  .del()
  .then(() => {return res.json("delete successful")})
  .catch(err => res.json("delete failed"))
})

app.post('/dayview', (req, res) => {
  let {date} = req.body;
  db.select('*').from('slot')
  .where('date', '=', date)
  .then(data => {
    console.log(data);
    return res.json(data);
  })
})

//req will give username, email, password, and isAdmin
app.put('/adduser', (req, res) => {
  const {username, email, password, isAdmin} = req.body;

  db.transaction(trx => {
      trx.insert({
        email: email,
        username: username,
        admin: isAdmin
       
      })
      .into('users')
      .returning('email')
      .then(loginEmail => {
        return trx('login')
          .returning('*')
          .insert({
              password: password,
              email: loginEmail[0]
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register new user'))
})

app.listen(3001, () => console.log('Example app listening on port 3001!'))
