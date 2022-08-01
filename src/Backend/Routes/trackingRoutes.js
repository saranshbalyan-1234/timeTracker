const express = require("express");
const Router = express.Router();
const tracking = require("../Controllers/trackingController");

Router.post("/save", tracking.save);
module.exports = Router;
