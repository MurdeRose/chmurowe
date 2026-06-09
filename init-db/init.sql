CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(16) UNIQUE NOT NULL,
    pass VARCHAR(16) NOT NULL
);

INSERT INTO users(username,pass) VALUES 
('user1', 'abc'),
('user2', 'def'),
('user3', 'ghi');