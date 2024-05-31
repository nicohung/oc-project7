module.exports = function (req, res, next) {
    const { user_email, user_name, user_password } = req.body;
    // console.log(req.body);
    // console.log(user_email, user_name, user_password);

    function validEmail(user_email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user_email);
    }

    if (req.path === "/register") {
        if (![user_email, user_name, user_password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");

        } else if (!validEmail(user_email)) {
            return res.status(401).json("Invalid Email");
        }
    } else if (req.path === "/login") {
        if (![user_email, user_password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
            
        } else if (!validEmail(user_email)) {
            return res.status(401).json("Invalid Email");
        }
    }

    next();
};