const express = require('express')
const pgp = require('pg-promise')()

const app = express()
const port = 3000
const db = pgp('postgres://postgres:postgres@db-qcs:5432/qcs_db')

app.use(express.json());

app.post('/quest-detail', async (req, res) => {
  try {
    const {name} = req.body
    console.log("name of the quest: " + name)
    const quest = await db.one('SELECT * FROM quests where name = $1', [name])
    res.json(quest)
  } catch (e) {
    res.json(e.message)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})