require('dotenv').config();
const router = require("express"). Router()
const pool = require('../../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo'); //the middleware
const authorization = require('../middleware/authorization');

//registering
router.post('/register', validInfo, async (req, res) => {
    try {
        //destructure the req.body (name, email, password)
        const { user_name, user_password, user_email } = req.body;

        //check if user exists 
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [user_email]);

        //if user exists (user.rows will have data), then throw error (401 - person is unAuthenticated)
        if (user.rows.length !== 0) {
            return res.status(401).send({ message: "User already exists" })
        } 

        //if user does not exist, Bcrypt the user password
        const saltRounds = 10; //bcrypt - how encrypted you want the password to be
        const salt = await bcrypt.genSalt(saltRounds); //takes time to do this function
        const bcryptPassword = await bcrypt.hash(user_password, salt); //takes time to do this function

        //enter the new user inside database
        const newUser = await pool.query("INSERT INTO users (user_name, user_password, user_email) VALUES ($1, $2, $3) RETURNING *", [user_name, bcryptPassword, user_email] );

        //generating jwt token 
        const token = jwtGenerator(newUser.rows[0].user_id);

        //Return token, user_id, and user_name in the response
        res.json({ 
            token, 
            user_id: newUser.rows[0].user_id, 
            user_name: newUser.rows[0].user_name 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

//login
router.post('/login', validInfo, async (req, res) => {
    try {

        //destrucutre the req.body
        const { user_password, user_email } = req.body;

        //check if the user exist (if not, throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [user_email]);
        
        if (user.rows.length === 0) {
            return res.status(401).send({ message: "Password or Email is incorrect" })
        } 

        //check if incoming password is the same as the database password
        const validPassword = await bcrypt.compare(user_password, user.rows[0].user_password); //returns TRUE or FALSE

        if (!validPassword) {
            return res.status(401).send({ message: "Password or Email is incorrect" });
        }

        //give them the jwt token + user_id + user_name
        const token = jwtGenerator(user.rows[0].user_id);
        const user_id = user.rows[0].user_id;
        const user_name = user.rows[0].user_name;

        res.json({ token, user_id, user_name });


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//use authorization middleware to check token, if token is valid, return a true statement
router.get('/is-verify', authorization, async (req, res) => {
    try {
        res.json(true);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

//delete account
router.delete('/delete/:id', authorization, async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM user_posts WHERE user_id = $1", [id]);
        await pool.query("DELETE FROM posts WHERE user_id = $1", [id]);
        await pool.query("DELETE FROM users WHERE user_id = $1", [id]);

        res.json("User got deleted!");

    } catch (err) {
        console.error(err.message);
    }
})
 
module.exports = router;