const jwt = require("jsonwebtoken")

// const SignToken = {
const generateAccessToken = (user) => {
    const {password, ...orther} = user;
        return jwt.sign(
            {
                ...orther
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "1d"}
        )
    }

    // generateRefreshToken: (user) => { 
    //     jwt.sign(
    //         {
    //             id: user.id,
    //             role: user.role
    //         },
    //         process.env.REFRESH_TOKEN_SECRET,
    //         {expiresIn: "30d"}
    //     )
    // }
// }
module.exports =  generateAccessToken;