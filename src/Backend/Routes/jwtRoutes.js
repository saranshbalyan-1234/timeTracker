const express = require("express");
const Router = express.Router();
const jwt = require("../Utils/jwt");

Router.post("/refreshToken", jwt.refreshToken);
module.exports = Router;
