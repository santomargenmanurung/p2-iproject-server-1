const errorHandler = (err, req, res, next) => {
  console.log(err.name);
  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "REQUIRED_EMAIL":
      res.status(400).json({ message: "email is required" });
      break;
    case "REQUIRED_PASSWORD":
      res.status(400).json({ message: "password is required" });
      break;
    case "USER_NOT_FOUND":
      res.status(401).json({ message: "invalid email/password" });
      break;
    default:
      res.status(500).json({ message: "Internal server error" });

      break;
  }
};

module.exports = errorHandler;
