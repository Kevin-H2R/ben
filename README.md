# Kevin's 2nd round interview project @BEN Inc

## How to use
- `docker compose up --build` at the root of the project
- Two main endpoints to play with:
  - POST `localhost/api/signup` requires a JSON body like:
  ```
    {
      "email": "toto1@test.com",
      "username": "toto1",
      "password": "toto"
    }
  ```

  - POST `localhost/api/signin` requires a JSON body like:
  ```
    {
      "username": "toto1",
      "password": "toto"
    }
  ```
- Also added two endpoints to check the data directly:
  - GET `localhost/api/user/:username/quests/on-going`, replace `:username` with your username. Checks the on-going quests for the user
  - GET `localhost/api/user/:username/quests/done`, replace `:username` with your username. Checks the done quests for the user
- Or you can exec in the different database containers directly to query the data you want.
- `docker compose down --volumes` to empty all the databases and restart fresh.

## Context
We are building an english learn plateform with a gamification system that rewards (gold/diamond/...) users when they perfom given actions. Those given actions are called **quests**.
A user may have to perform the quest multiple times to get the reward. And, depending on the quest, a user may perform the whole quest multiple times.

For this short project we are going to focus only on a quest that rewards a user when he/she signs in 3 times.

## Given DB schema
![Given db schema](./dbschema.png?raw=true "Db")

*Kevin\'s note (K): I do not really like the fact that a quest is linked to only one reward through the FK reward_id. I would rather put a FK 'quest_id' on the Rewards entity, this would allow a quest to give multiple types of rewards (20 gold + 10 diamonds)*

## Task

Create 3 microservices:
- Authentication Service
- Quest Catalog Service
- Quest Processing Service

Create a "signup" endpoint (*K: I will expect that I need to create the signin endpoint too.*) and all the process behind it to handle a "sign-in-3-times" (si3t) quest, that give the user 10 diamonds if the user logs in 3 times and can be repeated twice.

## How I am thinking of doing it

### Signup
![The design for signup process I am thinking about to solve that problem](./signupProcess.jpg?raw=true "Archi")

### Signin
![The design for signin process I am thinking about to solve that problem](./signinProcess.jpg?raw=true "Archi")

When a user signs up, we create a row in **User_Quest** table, linking the new user to the 'si3t' quest.\
Everytime a user signs in we check if there are rows related to the user in the **User_Quest** table that has a null **date** property (this represents the on-going quest).\
If the 'si3t' quest is on going for the current user, we add a progress row for that quest, and we check wether he completed the quest or not (if there is 3 progress rows for that **User_Quest**).\
If they completed the quest, we add the date to the **User_Quest** row and we check how many times the user completed that quest, if that number is below **duplication**, we create a new **User_Quest** row for that user.

## Feedback on the project
I decided to go for an event-based microservice architecture with the API gateway acting as the event dispatcher. I feel there would have been a better way to handle events, like with an other event dispatcher service in the middle.\
I also went very basic for database request, did not use an ORM (I would have used Sequelize here as I made node app for the services).\
I feel that my cache usage is to 'too simple', maybe there is a more efficient way to use cache here.\
I changed a bit the database architecture that I was given, I hope it is ok.\
\
Overall I really enjoyed doing this mini-project, it was really fun and interesting to come up with an architecture like that.\
I wish I knew more about Kubernetes, I went with `docker compose` as I was more comfortable with it, but I know K8s offers interesting features, especially for scaling (that I skipped).