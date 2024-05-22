const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { check } = require("express-validator");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
  "/register",
  [
    check("username", "Username can't be empty").notEmpty(),
    check(
      "password",
      "Password must consist minimum of 4 symbols and max 10"
    ).isLength({ min: 4, max: 10 }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(["ADMIN"]), controller.getUsers);

module.exports = router;
