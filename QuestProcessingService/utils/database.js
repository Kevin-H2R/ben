const insertUserQuest = async (db, user_id, quest_id) => {
  await db.none(
    "INSERT INTO user_quest (user_id, quest_id, status) VALUES ($1, $2, 'not_claimed')",
    [user_id, quest_id]
   )
}

const selectOnGoingQuest = async (db, user_id, quest_id) => {
  return await db.oneOrNone(
    "SELECT user_quest.id, COUNT(progress.id) FROM user_quest LEFT JOIN progress on progress.user_quest_id = user_quest.id WHERE user_id = $1 AND quest_id = $2 AND user_quest.date IS NULL GROUP BY user_quest.id",
    [user_id, quest_id]
  )
}

const insertProgress = async (db, user_quest_id) => {
  await db.none(
    "INSERT INTO progress (user_quest_id, date) VALUES ($1, NOW())",
    [user_quest_id]
   )
}

const finishQuest = async (db, user_quest_id) => {
  await db.none("UPDATE user_quest SET date = NOW() where id = $1", [user_quest_id])
}

const selectDoneQuests = async (db, user_id, quest_id) => {
  return await db.manyOrNone(
    "SELECT id  FROM user_quest WHERE user_id = $1 AND quest_id = $2 AND user_quest.date IS NOT NULL",
    [user_id, quest_id])
}

module.exports = {
  insertUserQuest,
  selectOnGoingQuest,
  insertProgress,
  finishQuest,
  selectDoneQuests
}