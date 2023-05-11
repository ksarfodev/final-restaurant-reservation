/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const methodNotAllowed = require("../errors/methodNotAllowed");

const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/:table_id([0-9]+)/seat")
.put(controller.update)
.delete(controller.delete)
.all(methodNotAllowed);

router.route("/:table_id([0-9]+)")
.get(controller.read)
.all(methodNotAllowed);

router.route("/")
.get(controller.list)
.post(controller.create)
.all(methodNotAllowed);

module.exports = router;
