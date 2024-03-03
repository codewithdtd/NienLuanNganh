const express = require("express");
const menu = require("../controllers/menu.controller");

const router = express.Router();

router.route("/")
    .get(menu.findAll)
    .post(menu.create)
    .delete(menu.deleteAll);
    
router.route("/:id")
    .get(menu.findOne)
    .put(menu.update)
    .delete(menu.delete);

module.exports = router;