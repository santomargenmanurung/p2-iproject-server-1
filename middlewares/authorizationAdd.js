const authorizationNewEvent = (req, res, next) => {
  try {
    const { no_Identity } = req.user;
    if (no_Identity[0] !== "A") {
      throw { name: "ADMIN_ACCESS" };
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authorizationNewEvent;
