const express = require('express');
const app = express(); //by calling express as a function, we creat an application, allowing us to setup the entire server
const cors = require('cors');
const pool = require('./db');


//MIDDLEWARE
app.use(cors());
app.use(express.json()); //req.body - Gives us access to req.body to get json data


//ROUTES

//register and login
app.use('/auth', require('./backend/routes/jwtAuth.js')); //using /auth will hit the route in jwtAuth.js

//dashboard route
app.use('/dashboard', require('./backend/routes/dashboard.js'));


//create post
app.post('/newpost', async (req, res) => {
    try {
        const { user_id, text_content, image_url, title, user_name } = req.body;
        // console.log(req.body);
        
        const newPost = await pool.query(
            "INSERT INTO posts (user_id, text_content, image_url, title, user_name) VALUES ($1, $2, $3, $4, $5)",
            [user_id, text_content, image_url, title, user_name]
        );

        res.json(newPost);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Get all posts with read_status for a specific user
app.get("/allposts/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const posts = await pool.query(
            `
            -- select all columns from posts table, and the read_status column from the user_posts table
            SELECT p.*, up.read_status
            
            -- assign posts table to alias p and specifies it as the primary table
            FROM posts p 

            -- left join, meaning return all columns from the posts table, with matching post_id and user_id
            LEFT JOIN user_posts up ON p.post_id = up.post_id AND up.user_id = $1

            -- order by latest post first (higher number first)
            ORDER BY p.post_id DESC`,
            [user_id],
        );

        res.json(posts.rows);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


//get a post. :id makes id the req.params
app.get('/allposts/post/:id', async(req, res) => {
    try {
        const { id } = req.params;

        const post = await pool.query("SELECT * FROM posts WHERE post_id = $1", [id]);

        res.json(post.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
})

//edit post
app.put('/allposts/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { user_id, text_content, image_url, title, image_alt } = req.body;
        
        // Check if the user is the owner of the post
        const post = await pool.query("SELECT user_id FROM posts WHERE post_id = $1", [id]);
        if (post.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.rows[0].user_id !== user_id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const updatePost = await pool.query("UPDATE posts SET user_id = $1, text_content = $2, image_url = $3, title = $4, image_alt = $5 WHERE post_id = $6", [user_id, text_content, image_url, title, image_alt, id]);

        res.json("Post was updated!");

    } catch (err) {
        console.error(err.message);
    }
})

//delete a post
app.delete('/allposts/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.body; // Parse user_id from request body
        // console.log(id);
        // console.log(user_id);

        // Check if the user is the owner of the post
        const post = await pool.query("SELECT user_id FROM posts WHERE post_id = $1", [id]);
        // console.log(post.rows[0].user_id);

        if (post.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.rows[0].user_id.toString() !== user_id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await pool.query("DELETE FROM user_posts WHERE post_id = $1", [id]);
        await pool.query("DELETE FROM posts WHERE post_id = $1", [id]);

        res.json("Post got deleted!");

    } catch (err) {
        console.error(err.message);
    }
})

//mark as read
app.post('/allposts/markAsRead', async (req, res) => {
    try {
        const { user_id, post_id } = req.body;
        //req.body format: { user_id: 18, post_id: 29 }

        await pool.query(
            `INSERT INTO user_posts (user_id, post_id, read_status) 
            VALUES ($1, $2, TRUE) 
            ON CONFLICT (user_id, post_id) 
            DO UPDATE SET read_status = TRUE`, 
            [user_id, post_id]
        );

        res.json({ message: 'Post marked as read' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



//make the server run, saying our server is listening on port 8000 for any requests
app.listen(8000, () => {
    // Log a message when the server is ready
    console.log('Server is running on http://localhost:8000');
});