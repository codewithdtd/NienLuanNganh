const express = require("express");
const user = require("../controllers/user.controller");

const router = express.Router();

router.route("/")
    .get(user.findAll)
    .post(user.create)
    .delete(user.deleteAll);
 
router.route("/:id")
    .get(user.findOne)
    .put(user.update)
    .delete(user.delete);

module.exports = router;