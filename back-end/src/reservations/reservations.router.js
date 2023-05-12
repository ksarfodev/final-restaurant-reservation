/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const methodNotAllowed = require("../errors/methodNotAllowed");

const router = require("express").Router();
const controller = require("./reservations.controller");
const cors = require("cors");

router.use(cors());

router.route("/:reservation_id([0-9]+)/status")
.put(controller.update)
.all(methodNotAllowed);

router.route("/:reservation_id([0-9]+)")
.get(controller.read)
.put(controller.updateReservation)
.all(methodNotAllowed);

router.route("/")
.get(controller.list)
.post(controller.create)
.all(methodNotAllowed);

module.exports = router;
