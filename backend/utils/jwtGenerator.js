require('dotenv').config(); //allows access to all environment variables
const jwt = require('jsonwebtoken');

//take the user_id, make a payload, and sign it, use the secret and set an expiraiton date
//data returned is used in jwtAuth.js
function jwtGenerator(user_id){
    const payload = {
        user: user_id
    }

    // console.log(process.env.jwtSecret);
    return jwt.sign(payload, `${process.env.jwtSecret}`, {expiresIn: '1hr'})
}

module.exports = jwtGenerator;