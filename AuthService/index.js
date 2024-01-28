const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const pgp = require('pg-promise')()

const app = express()
const port = 3000
const db = pgp('postgres://postgres:postgres@db-as:5432/as_db')

app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.one(
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3)', [email, username, hashedPassword])
    res.json("good")
  } catch (e) {
    res.json(e.message)
  }
})

app.post('/signin', async (req, res) => {
  const {username, password} = req.body
  const user = await db.one(
  'SELECT * from users where username = $1', [username])
  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
  const token = jwt.sign({ userId: user._id }, 'my-secret', {
    expiresIn: '1h',
  });
  res.status(200).json({ token });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})