const express = require("express");
const category = require("../controllers/category.controller");

const router = express.Router();

router.route("/")
    .get(category.findAll)
    .post(category.create)
    .delete(category.deleteAll);
    
router.route("/:id")
    .get(category.findOne)
    .put(category.update)
    .delete(category.delete);

module.exports = router;