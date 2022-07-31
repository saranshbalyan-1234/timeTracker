const { sign, verify } = require("jsonwebtoken");

const createToken = async (data, secret, expiration) => {
  return sign(data, secret, {
    expiresIn: expiration,
  });
};

const refreshToken = async (req, res) => {
  const token = req.body.refreshToken;
  if (!token)
    return res.status(401).json({ errors: ["Refresh token not found"] });

  try {
    const data = verify(token, process.env.JWT_REFRESH_SECRET);
    if (data) {
      let tokenData = { id: data.id, email: data.email };
      const accessToken = await createToken(
        tokenData,
        process.env.JWT_ACCESS_SECRET,
        process.env.JWT_ACCESS_EXPIRATION
      );
      const refreshToken = await createToken(
        tokenData,
        process.env.JWT_REFRESH_SECRET,
        process.env.JWT_REFRESH_EXPIRATION
      );
      return res.status(200).json({ accessToken, refreshToken });
    }
  } catch (e) {
    res.status(401).json({ errors: [getTokenError(e, "Refresh")] });
  }
};
const validateToken = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (token) {
      const data = verify(token, process.env.JWT_ACCESS_SECRET);
      if (data) {
        let temp = { ...data };
        delete temp.iat;
        delete temp.exp;
        req.user = temp;
        next();
      }
    } else {
      res.status(401).json({ errors: ["Access token not found"] });
    }
  } catch (e) {
    res.status(401).json({ errors: [getTokenError(e, "Access")] });
  }
};

const getTokenError = (e, type) => {
  switch (e.name) {
    case "TokenExpiredError":
      return `${type} Token Expired`;
    default:
      return `Invalid ${type} Found`;
  }
};
const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else return null;
};

module.exports = { createToken, refreshToken, validateToken, getTokenError };
