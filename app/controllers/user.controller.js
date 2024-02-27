const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error")

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

