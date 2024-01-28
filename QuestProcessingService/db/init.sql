CREATE TYPE claimed_status AS ENUM ('claimed', 'not_claimed');
CREATE TABLE IF NOT EXISTS "user_quest" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    quest_id INT NOT NULL,
    date timestamp,
    status claimed_status
);

CREATE TABLE IF NOT EXISTS "progress" (
    id SERIAL PRIMARY KEY,
    date timestamp,
    user_quest_id INT REFERENCES user_quest (id)
);