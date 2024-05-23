const User = require("../models/user.model");
const Role = require("../models/role.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");
const { validationResult } = require("express-validator");

const salt = parseInt(process.env.SALT || "3");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Field errors", fieldErrors: errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "There is already a user with this username" });
      }
      const hashedPassword = bcrypt.hashSync(password, salt);
      const userRole = await Role.findOne({ value: "USER" });
      const user = new User({
        username,
        password: hashedPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.status(200).json({ message: "Registered successfully" });
    } catch (error) {
      return res.status(400).json({ message: "Registration Error" });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Wrong password or username" });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Wrong password or username" });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (error) {
      return res.status(400).json({ message: "Login error" });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ message: "Users not found" });
    }
  }
  async checkAdmin(req, res) {
    try {
      return res.status(200).json({ message: "You are admin" });
    } catch (error) {
      return res.status(400).json({ message: "Uknown error" });
    }
  }
}

module.exports = new authController();
