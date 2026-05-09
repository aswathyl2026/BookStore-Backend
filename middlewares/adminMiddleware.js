const jwt = require('jsonwebtoken')

const adminMiddleware = (req, res, next) => {
    console.log("inside admin authentication method");
    const token = req.headers['authorization'].split(" ")[1]
    console.log(token);
    if (token) {
        try {
            const jwtResponse = jwt.verify(token, process.env.JWTSECRET)
            console.log(jwtResponse);
            req.payload = jwtResponse.userMail
            const role = jwtResponse.role

            if (role == 'admin') {
                next()
            } else {
                res.status(401).json("Authorization failed")
            }

        } catch (err) {
            res.status(401).json("invalid token....plz")
        }
    } else {
        res.status(401).json("Authorization failed")
    }



}

module.exports = adminMiddleware