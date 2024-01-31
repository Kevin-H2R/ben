const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
const pgp = require('pg-promise')()
require('dotenv').config()

const app = express()
const port = 3000
const db = pgp('postgres://postgres:postgres@db-as:5432/as_db')

app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await db.oneOrNone(
      'SELECT id from users where email = $1 or username = $2', 
      [email, username]
    )
    if (existingUser) {
      res.status(401).json('User already exists')
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await db.one(
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id',
      [email, username, hashedPassword])
    axios.post(
      `http://${process.env.QUEST_PROCESSING_SERVICE_ENDPOINT}/user-signed-up`,
      {user_id: data.id},
      {headers: {'Content-Type': 'application/json'}}
    )
    res.json()
  } catch (e) {
    res.status(500).json(e.message)
  }
})

app.post('/signin', async (req, res) => {
  const {username, password} = req.body
  const user = await db.oneOrNone(
  'SELECT * from users where username = $1', [username])
  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json('Authentication failed');
  }
  const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET, {
    expiresIn: '1h',
  });
  const response = axios.post(
    `http://${process.env.QUEST_PROCESSING_SERVICE_ENDPOINT}/user-signed-in`,
    {user_id: user.id},
    {headers: {'Content-Type': 'application/json'}}
  )
  res.status(200).json({ token });
})

app.get('/users/:username', async (req, res) => {
  const username = req.params.username
  const id = await db.oneOrNone(
    "SELECT id from users where username = $1", [username]
  )
  if (!id) {
    res.status(404).json("User not found")
    return
  }
  res.json(id)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})