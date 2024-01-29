const { default: axios } = require('axios')
const express = require('express')
const pgp = require('pg-promise')()
require('dotenv').config()

const app = express()
const port = 3000
const db = pgp('postgres://postgres:postgres@db-qps:5432/qps_db')

app.use(express.json());

app.post('/user-signed-up', async (req, res) => {
  try {
    const {user_id} = req.body
    // Should be a get with a query on the name, but as the name as space inside it will be faster for
    // me to just make a post
    const response = await axios.post(
      `http://${process.env.QUEST_CATALOG_SERVICE_NAME}:${process.env.QUEST_CATALOG_SERVICE_PORT}/quest-detail`,
      {name: 'Sign in 3 times'},
      {headers: {'Content-Type': 'application/json'}}
    )
    await db.one(
      "INSERT INTO user_quest (user_id, quest_id, status) VALUES ($1, $2, 'not_claimed')",
      [user_id, response.data.id]
     )
    res.json("Quest Processing Service")
  } catch (e) {
    res.json(e.message)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})