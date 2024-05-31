CREATE DATABASE groupomania;

-- uuid_generate_v4() is a function that is running to create the uuid
CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), 
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE Post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    text_content TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_new BOOLEAN DEFAULT TRUE,
    user_name TEXT,
    title VARCHAR(255),
    image_alt TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE user_posts (
    user_id INT REFERENCES users(user_id),
    post_id INT REFERENCES posts(post_id),
    read_status BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, post_id)
);