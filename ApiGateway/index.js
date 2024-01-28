const { default: axios } = require('axios')
const express = require('express')
const app = express()
const port = 3000
require('dotenv').config()

// `http://${process.env.AUTH_SERVICE_NAME}:${process.env.AUTH_SERVICE_PORT}/`

app.post('/api/signup', async (req, res) => {
  try {
    const response = await axios.post(
      `http://${process.env.AUTH_SERVICE_NAME}:${process.env.AUTH_SERVICE_PORT}/signup`,
      req,
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
    res.json(response.data)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
})

app.post('/api/signin', async (req, res) => {
  const response = await axios.post(
    `http://${process.env.AUTH_SERVICE_NAME}:${process.env.AUTH_SERVICE_PORT}/signin`,
    req,
    {
      headers: {'Content-Type': 'application/json'}
    }
  )
  res.json(response.data)
})

app.get('', (req, res) => {
  res.json("GOOD GOOD GOOD")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})