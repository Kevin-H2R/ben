# Kevin's 2nd round interview project @BEN Inc

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

![The architecture I am thinking about to solve that problem](./archi.png?raw=true "Archi")

When a user signs up, we create a row in **User_Quest** table, linking the new user to the 'si3t' quest.\
Everytime a user signs in we check if there are rows related to the user in the **User_Quest** table that has a null **date** property (this represents the on-going quest).\
If the 'si3t' quest is on going for the current user, we add a progress row for that quest, and we check wether he completed the quest or not (if there is 3 progress rows for that **User_Quest**).\
If they completed the quest, we add the date to the **User_Quest** row and we check how many times the user completed that quest, if that number is below **duplication**, we create a new **User_Quest** row for that user.

<!-- This is out of the scope I guess, but I think it would be a good idea to add a table **Quest Tree**, that would hold a OneToMany relationship between a quest A and 1 to n B quests, this would represent the fact that when we finish quest A, we unlock the B quest(s).\ -->

