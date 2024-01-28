const { default: axios } = require('axios')
const express = require('express')
const app = express()
const port = 3000
require('dotenv').config()

// `http://${process.env.AUTH_SERVICE_NAME}:${process.env.AUTH_SERVICE_PORT}/`

app.post('/api/signup', async (req, res) => {
  console.log("HERE")
  try {
    const response = await axios.post(
      `http://${process.env.AUTH_SERVICE_NAME}:${process.env.AUTH_SERVICE_PORT}/signup`,
      req,
      {
        headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
        }
      }
    )
    console.log(response)
    res.json(response.data)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
})

app.get('', (req, res) => {
  res.json("GOOD GOOD GOOD")
})

app.post('/api/signin', async (req, res) => {
  const response = await axios.get()
  res.json(response.data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})