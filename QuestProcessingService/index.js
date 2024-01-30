const { default: axios } = require('axios')
const express = require('express')
const pgp = require('pg-promise')()
require('dotenv').config()

const app = express()
const port = 3000
const db = pgp('postgres://postgres:postgres@db-qps:5432/qps_db')
const dbUtils = require('./utils/database')

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
    await dbUtils.insertUserQuest(db, user_id, response.data.id)
    res.json("Quest Processing Service")
  } catch (e) {
    res.status(500).json(e.message)
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
    const user_quest = await dbUtils.selectOnGoingQuest(db, user_id, questResponse.data.id)
    // Sign in 3 times quest is not going on
    if (!user_quest) {
      res.json()
      return
    }
    await dbUtils.insertProgress(db, user_quest.id)
    // Finished one cycle
    if (parseInt(user_quest.count) === questResponse.data.streak - 1) {
      // Gotta check how many user_quests are done and if its bellow quest
      // duplication count. Gotta create a new user_quest if it is.
      await dbUtils.finishQuest(db, user_quest.id)
      const done_quest = await dbUtils.selectDoneQuests(db, user_id, questResponse.data.id)
      if (done_quest.length >= questResponse.data.duplication) {
        res.json()
        return
      }
      await dbUtils.insertUserQuest(db, user_id, questResponse.data.id)
    }
    res.json("Quest Processing Service")
  } catch (e) {
    console.log(e)
    res.status(500).json(e.message)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})