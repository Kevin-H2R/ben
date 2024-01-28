const express = require('express')
const pgp = require('pg-promise')()

const app = express()
const port = 3000
const db = pgp('postgres://postgres:postgres@db-as:5432/as_db')

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    res.json("Quest Processing Service")
  } catch (e) {
    res.json(e.message)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})