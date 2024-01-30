const express = require('express')
const pgp = require('pg-promise')()
const redis = require('ioredis');

const app = express()
const port = 3000
const db = pgp('postgres://postgres:postgres@db-qcs:5432/qcs_db')

app.use(express.json());


app.post('/quest-detail', async (req, res) => {
  try {
    const redisClient = redis.createClient({
      host: 'redis',
      port: 6379
    });
    
    redisClient.on('error', (err) => {
      console.error(`Redis connection error: ${err}`);
    });

    const questKey = 'sign-in-quest' 
    redisClient.get(questKey, async (err, data) => {
      if (err) {
        console.log(err)
        res.status(500).json(err)
        return
      }
      if (data) {
        res.json(JSON.parse(data))
        return
      }
    const {name} = req.body
    const quest = await db.one('SELECT * FROM quests where name = $1', [name])
    redisClient.set(questKey, JSON.stringify(quest))
    res.json(quest)
    })
  } catch (e) {
    res.json(e.message)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})