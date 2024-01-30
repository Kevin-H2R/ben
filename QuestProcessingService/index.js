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
      `http://${process.env.QUEST_CATALOG_SERVICE_ENDPOINT}/quest-detail`,
      {name: 'Sign in 3 times'},
      {headers: {'Content-Type': 'application/json'}}
    )
    await db.none(
      "INSERT INTO user_quest (user_id, quest_id, status) VALUES ($1, $2, 'not_claimed')",
      [user_id, response.data.id]
     )
    res.json("Quest Processing Service")
  } catch (e) {
    res.json(e.message)
  }
})

app.post('/user-signed-in', async (req, res) => {
  try {
    const {user_id} = req.body
    // Should be a get with a query on the name, but as the name as space inside it will be faster for
    // me to just make a post
    const questResponse = await axios.post(
      `http://${process.env.QUEST_CATALOG_SERVICE_ENDPOINT}/quest-detail`,
      {name: 'Sign in 3 times'},
      {headers: {'Content-Type': 'application/json'}}
    )
    // Grabing the on going user_quest for that user, grabing also the progress count in the same query
    const user_quest = await db.oneOrNone(
      "SELECT user_quest.id, COUNT(progress.id) FROM user_quest LEFT JOIN progress on progress.user_quest_id = user_quest.id WHERE user_id = $1 AND quest_id = $2 AND user_quest.date IS NULL GROUP BY user_quest.id",
      [user_id, questResponse.data.id]
    )
    // Sign in 3 times quest is not going on
    if (!user_quest) {
      res.json()
      return
    }
    await db.none(
      "INSERT INTO progress (user_quest_id, date) VALUES ($1, NOW())",
      [user_quest.id]
     )
    // Finished one cycle
    if (parseInt(user_quest.count) === questResponse.data.streak - 1) {
      // Gotta check how many user_quests are done and if its bellow quest
      // duplication count. Gotta create a new user_quest if it is.
      await db.none("UPDATE user_quest SET date = NOW() where id = $1", [user_quest.id])
      const done_quest = await db.manyOrNone(
        "SELECT id  FROM user_quest WHERE user_id = $1 AND quest_id = $2 AND user_quest.date IS NOT NULL",
        [user_id, questResponse.data.id])
        console.log(typeof done_quest.length, typeof questResponse.data.duplication)
        console.log(done_quest.length, questResponse.data.duplication)
      if (done_quest.length >= questResponse.data.duplication) {
        res.json()
        return
      }
      await db.none(
        "INSERT INTO user_quest (user_id, quest_id, status) VALUES ($1, $2, 'not_claimed')",
        [user_id, questResponse.data.id]
       )
    }
    res.json("Quest Processing Service")
  } catch (e) {
    console.log(e)
    res.json(e.message)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})