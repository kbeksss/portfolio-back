const { jwtSecret } = require("../config");
const jwt = require("jsonwebtoken");

module.exports = function (accessedRoles) {
  return function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(403).json({ message: "You are not authorized" });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(403).json({ message: "You are not authorized" });
      }

      const { roles } = jwt.verify(token, jwtSecret);

      if (!roles || !Array.isArray(roles)) {
        return res.status(403).json({ message: "You are not authorized" });
      }

      const hasRole = roles.some((role) => accessedRoles.includes(role));

      if (!hasRole) {
        return res.status(403).json({ message: "You don't have rights" });
      }

      next();
    } catch (e) {
      if (!res.headersSent) {
        return res.status(403).json({ message: "You are not authorized" });
      }
    }
  };
};
