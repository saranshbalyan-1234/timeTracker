const db = require("../Utils/dataBaseConnection");
const bcrypt = require("bcryptjs");
const { createToken } = require("../Utils/jwt");
const { userLoginValidation } = require("../Utils/hapiValidation");
const getError = require("../Utils/sequelizeError");
const User = db.users;
const e = require("express");
const login = async (req, res) => {
  const { error } = userLoginValidation.validate(req.body);
  // if (error)
  //   return res.status(400).json({ errors: [error.details[0].message] });

  const { email, password } = req.body;
  User.findOne({ where: { email } })
    .then((resp) => {
      if (!resp)
        return res.status(400).json({ errors: ["User Not Registered"] });
      bcrypt.compare(password, resp.password, async (err, result) => {
        if (!result)
          return res.status(400).json({ errors: ["Incorrect Password"] });
        const { id, email, name, verifiedAt } = resp;
        if (!verifiedAt)
          return res.status(400).json({ errors: ["Email Not Verified"] });

        let tokenData = { id, email };
        const accessToken = await createToken(
          tokenData,
          process.env.JWT_ACCESS_SECRET
          // process.env.JWT_ACCESS_EXPIRATION
        );

        res.status(200).json({ id, name, email, accessToken });
      });
    })
    .catch((e) => {
      getError(e, res);
    });
};

module.exports = {
  login,
};
