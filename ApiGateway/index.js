const { default: axios } = require('axios')
const express = require('express')
const app = express()
const port = 3000
require('dotenv').config()

app.get('/', async (req, res) => {
  const response = await axios.get(`http://${process.env.AUTH_SERVICE_NAME}:${process.env.AUTH_SERVICE_PORT}/`)
  res.json(response.data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})