const db = require("../Utils/dataBaseConnection");
const bcrypt = require("bcryptjs");

const { userLoginValidation } = require("../Utils/hapiValidation");
const getError = require("../Utils/sequelizeError");
const User = db.users;

const login = async (req, res) => {
  const { error } = userLoginValidation.validate(req.body);
  if (error)
    return res.status(400).json({ errors: [error.details[0].message] });

  const { email, password } = req.body;
  User.findOne({ where: { email } })
    .then((resp) => {
      if (!resp)
        return res.status(400).json({ errors: ["User Not Registered"] });
      bcrypt.compare(password, resp.password, async (err, result) => {
        if (!result)
          return res.status(400).json({ errors: ["Incorrect Password"] });
        const { id, verifiedAt } = resp;
        if (!verifiedAt)
          return res.status(400).json({ errors: ["Email Not Verified"] });

        res.status(200).json({ id });
      });
    })
    .catch((e) => {
      getError(e, res);
    });
};

module.exports = {
  login,
};
