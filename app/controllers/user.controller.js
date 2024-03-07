const UserService = require("../services/user.service");
const CartService = require("../services/cart.service")
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const jwt = require('jsonwebtoken');

const generateAccessToken = require("../middleware/generateAccessToken")
const generateRefreshToken = require("../middleware/generateRefreshToken")

require('dotenv').config()

exports.create = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.create(req.body);
        return res.send(document);
    } catch (error) { 
        return next(
            new ApiError(500, "Đã có lỗi xảy ra trong quá trình tạo tài khoản") 
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const userService = new UserService(MongoDB.client);
        const queryParams = req.query;
        if (Object.keys(queryParams).length > 0) {
            documents = await userService.findByQuery(queryParams);
        } else {
            documents = await userService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã có lỗi xảy ra")
        ); 
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "user not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving user with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "user not found"));
        }
        return res.send({ message: "Cập nhật thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving user with id=${req.params.id}`)
        );
    }
}


exports.delete = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "user not found"));
        }
        return res.send({ message: "Đã xóa" });
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Không thể xóa id=${req.params.id}`
            )
        );
    }
}


exports.deleteAll = async (_req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const deletedCount = await userService.deleteAll();
        return res.send({
            message: `${deletedCount} users were delete successfully`,
        })
    } catch (error) {
        return next (
            new ApiError(
                500, "Đã có lỗi xảy ra!"
            )
        )
    }
}

exports.login = async (req, res, next) => {
    try {
        const data = req.body;
        const userService = new UserService(MongoDB.client);
        const user = await userService.findUserLogin({ phone: data.phone });
    
        if(!user) {
            return next(new ApiError(404, "user not found"));
        }
        
        if(data.password !== user.password) {
            return res.send({
                message: `Sai mật khẩu`,
            })
        }
        if(user) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            })

            const {password, ...orther} = user;
            return res.json({accessToken: accessToken, ...orther});
        }
        // return res.send({
        //     user
        // })
    }catch(err) {
        return next (
            new ApiError(
                500, "Đã có lỗi xảy ra!"
            )
        )
    }
}

// exports.refreshToken = async (res, req, next) => {
//     const refreshToken = req.cookies.refreshToken;

//     if(!refreshToken) {
//         return next( new ApiError(403, "You're not authenticated"));
//     }
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=> {
//         if(err) {
//             console.log(err);
//         }
//         // tạo access token mới
//         const newAccessToken = generateAccessToken(user);
//         const newRefreshToken = generateRefreshToken(user);
//         res.cookie("newRefreshToken", newRefreshToken, {
//             httpOnly: true,
//             secure: false,
//             path: "/",
//             sameSite: "strict",
//         })
//     })
//     return next();
// }

// CART
exports.addCart = async (req,res,next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const cartService = new CartService(MongoDB.client);

        const data = req.body;
        const id = req.user._id;
            
        const cartItems = [];
        const cartItem = {
            product: data,
            quanlity: data.quanlity ?? 1,
            price: data.price,
        };
        cartItems.push(cartItem)
        const addCart = await userService.addCart(id, cartItems);
 
        const addtoCart = await cartService.create(id, cartItem);
  
        return res.json(addtoCart);
    } catch(err) {
        return next( new ApiError(
            500, "Đã có lỗi xảy ra!"
        ))
    }
}

exports.findAllCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const carts = await cartService.findAllCartUser(req.user._id)
        return res.json(carts)
    } catch (error) {
        return next( new ApiError(
            500, "Đã có lỗi xảy ra!"
        ))
    }
}

exports.updateCart = async (req, res, next) => {
    try {
        const cart = req.body;
        const user = req.user._id;

        const cartService = new CartService(MongoDB.client);
        const userService = new UserService(MongoDB.client);
   
        const updateCart = await cartService.updateQuanlity(cart)

        const carts = await cartService.findAllCartUser(user)
        
        const clearCart = await userService.deleteAllCart(user)
        const updateCartUser = await userService.updateCart(user,carts) 

        return res.json(updateCartUser)
    } catch (error) {
        return next( new ApiError(
            500, "Đã có lỗi xảy ra!"
        ))
    }
}