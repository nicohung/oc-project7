const router = require('express').Router();
const pool = require('../../db');
const authorization = require('../middleware/authorization');

//leave as '/' since it's gonna be /dashboard/
router.get('/', authorization, async(req, res) => {
    try {
        //req.user has the payload
        //res.json(req.users);
        // console.log(req.user);

        const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [req.user]);

        //the user data lives within the first item in the rows array. 
        res.json(user.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
})

module.exports = router;