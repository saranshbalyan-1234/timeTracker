const express = require("express");
const Router = express.Router();
const tracking = require("../Controllers/trackingController");

Router.post("/save", tracking.saveOrUpdate);
Router.post("/start", tracking.start);
Router.post("/stop", tracking.stop);
module.exports = Router;
