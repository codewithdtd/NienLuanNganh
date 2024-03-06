const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

const AuthToken = {

    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if(err){
                        return next(new ApiError(403, "Token is not valid!"));
                    }
                    req.user = user;
                    return next();
            })
        }
        else{
            return next(new ApiError(401, "You're not authentication!"));
        }
    },

    verifyTokenAdmin: (req, res, next) => {
        AuthToken.verifyToken(req, res, () => {
            if(req.user.id == req.params.id || req.user.role == "admin"){
                return next();
            }
            else {
                return next(new ApiError(403, "You're not allowed!"));
            }
        })
    }
    
}

module.exports = AuthToken;