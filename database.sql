CREATE DATABASE groupomania_db;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, 
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    text_content TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_new BOOLEAN DEFAULT TRUE,
    user_name TEXT,
    title VARCHAR(255),
    image_alt TEXT
);

CREATE TABLE user_posts (
    user_id INT REFERENCES users(user_id),
    post_id INT REFERENCES posts(post_id),
    read_status BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, post_id)
);