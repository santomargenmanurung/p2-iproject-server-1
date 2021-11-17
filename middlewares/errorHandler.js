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
    case "INVALID_TOKEN":
    case "JsonWebTokenError":
      res.status(401).json({ message: "invalid token" });
      break;
    case "ADMIN_ACCESS":
      res.status(403).json({ message: "Can't access" });
      break;
    case "ImageSIzeToBig":
      res.status(400).json({ message: "Image size Max 255 KB" });
      break;
    case "INFALID_FORMAT":
      res.status(400).json({ message: "Only jpeg, jpg, png format to Upload" });
      break;
    case "EVENT_NOT_FOUND":
    case "EVENT_NOT_FOUND":
      res.status(404).json({ message: "Event Not Found" });
      break;
    case "TIKET_NOT_FOUND":
      res.status(404).json({ message: "Tiket Not Found" });
      break;
    case "CANT_DELETE":
      res.status(409).json({ message: "status does not meet criteria" });
      break;
    default:
      res.status(500).json({ message: "Internal server error" });
      break;
  }
};

module.exports = errorHandler;
