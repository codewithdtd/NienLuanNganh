const MenuService = require("../services/menu.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error")

exports.create = async (req, res, next) => {
    try {
        const menuService = new MenuService(MongoDB.client);
        const document = await menuService.create(req.body);
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
        const menuService = new MenuService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await menuService.findByName(name);
        } else {
            documents = await menuService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving menus")
        ); 
    }
    return res.send(documents);
};

// Find a sigle menu with an id
exports.findOne = async (req, res, next) => {
    try {
        const menuService = new MenuService(MongoDB.client);
        const document = await menuService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "menu not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving menu with id=${req.params.id}`
            )
        );
    }
};


// Update a menu by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const menuService = new MenuService(MongoDB.client);
        const document = await menuService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "menu not found"));
        }
        return res.send({ message: "menu was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving menu with id=${req.params.id}`)
        );
    }
}


// Delete a menu with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const menuService = new MenuService(MongoDB.client);
        const document = await menuService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "menu not found"));
        }
        return res.send({ message: "menu was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Could not delete menu with id=${req.params.id}`
            )
        );
    }
}


exports.findAllFavorite = async (_req, res, next) => {
    try {
        const menuService = new MenuService(MongoDB.client);
        const documents = await menuService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next (
            new ApiError(
                500, "An error while retrieving favorite menus"
            )
        )
    }
}


exports.deleteAll = async (_req, res, next) => {
    try {
        const menuService = new MenuService(MongoDB.client);
        const deletedCount = await menuService.deleteAll();
        return res.send({
            message: `${deletedCount} menus were delete successfully`,
        })
    } catch (error) {
        return next (
            new ApiError(
                500, "An error while retrieving favorite menus"
            )
        )
    }
}

