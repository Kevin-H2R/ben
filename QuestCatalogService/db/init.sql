CREATE TABLE IF NOT EXISTS "quests" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    duplication INT NOT NULL,
    streak INT NOT NULL,
    auto_claim BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS "rewards" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    item VARCHAR(32) NOT NULL,
    quantity INT NOT NULL,
    quest_id INT REFERENCES quests (id)
);

INSERT INTO quests (name, description, duplication, streak, auto_claim)
VALUES ('Sign in 3 times', 'Get diamonds for signing in 3 times', 2, 3, false);

INSERT INTO rewards (name, item, quantity, quest_id) 
VALUES ('Sign in reward', 'diamond', 10, (SELECT id from quests where name = 'Sign in 3 times'));