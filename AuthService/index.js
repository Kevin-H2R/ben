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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})