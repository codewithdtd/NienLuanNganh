const jwt = require("jsonwebtoken")

const generateRefreshToken = (user) => { 
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "30d"}
    )
}

module.exports = generateRefreshToken;
