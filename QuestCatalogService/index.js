const express = require('express')
const pgp = require('pg-promise')()

const app = express()
const port = 3000
const db = pgp('postgres://postgres:postgres@db-qcs:5432/qcs_db')

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    res.json("Quest Catalog Service")
  } catch (e) {
    res.json(e.message)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})