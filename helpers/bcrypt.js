const bcrypt = require("bcryptjs");

const hashingPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  hashingPassword,
  comparePassword,
};
