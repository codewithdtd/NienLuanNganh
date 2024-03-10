const express = require("express");
const menu = require("../controllers/menu.controller");

const router = express.Router();

router.route("/category")
    .get(menu.findAllCategory)
    .post(menu.createCategory)
    .delete(menu.deleteCategory);
    
router.route("/category/:id")
    .get(menu.findOneCategory)
    .put(menu.updateCategory)
    .delete(menu.deleteCategory);

router.route("/")
    .get(menu.findAll)
    .post(menu.create)
    .delete(menu.deleteAll);


router.route("/:id")
    .get(menu.findOne)
    .put(menu.update)
    .delete(menu.delete);

module.exports = router;