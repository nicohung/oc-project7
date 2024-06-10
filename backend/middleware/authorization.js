//this middleware checks whether or not the token sent to us is valid
const jwt = require('jsonwebtoken');
require('dotenv').config(); //to access the secret

//before hitting the route, we are going to do somewthing
module.exports = async (req, res, next) => {
    try {

        //destructure the token, which lives in the header
        const jwtToken = req.header('token');

        //if no token is found in the request, respond with 403 forbidden
        if(!jwtToken) {
            return res.status(403).json('Not Authorized');
        }

        //if there is a token, check if it is valid
        //if verified, it returns a payload we can use in our routes
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        // console.log('jwtSecret:', process.env.jwtSecret);

        req.user = payload.user; //to be used in dashboard.js

    } catch (err) {
        console.error(err.message);
        return res.status(403).json('Not Authorized');
    }

    next();
};