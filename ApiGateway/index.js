const { default: axios } = require('axios')
const express = require('express')
const app = express()
const port = 3000
require('dotenv').config()

// `http://${process.env.AUTH_SERVICE_NAME}:${process.env.AUTH_SERVICE_PORT}/`

app.post('/api/signup', async (req, res) => {
  try {
    const response = await axios.post(
      `http://${process.env.AUTH_SERVICE_ENDPOINT}/signup`,
      req,
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
    res.json(response.data)
  } catch (e) {
    console.log(e)
    res.status(e.response.status).json(e.response.data)
  }
})

app.post('/api/signin', async (req, res) => {
  try {
    const response = await axios.post(
      `http://${process.env.AUTH_SERVICE_ENDPOINT}/signin`,
      req,
      {headers: {'Content-Type': 'application/json'}}
    )
    res.json(response.data)
  } catch (e) {
    res.status(e.response.status).json(e.response.data)
  }
})

app.get('/api/user/:username/quests/on-going', async (req, res) => {
  try {
    const username = req.params.username
    const userResponse = await axios.get(
      `http://${process.env.AUTH_SERVICE_ENDPOINT}/users/${username}`
    )
    const questResponse = await axios.post(
      `http://${process.env.QUEST_PROCESSING_SERVICE_ENDPOINT}/on-going`,
      {user_id: userResponse.data.id},
      {headers: {'Content-Type': 'application/json'}}
    )
    if (!questResponse.data) {
      res.json("No on-going quest")
      return
    }
    res.json(`1 on-going quest, progress: ${questResponse.data.count} / ${questResponse.data.streak}`)
  } catch (e) {
    res.status(e.response.status).json(e.response.data)
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})