const express = require("express");
const apps = express();
const path = require("path");
const ActivityTracker = require("./ActivityTracker");
const activityTracker = new ActivityTracker("tracking.json", 2000);

apps.post("/login", async (req, res) => {
  return res.status(200).json({ id: 1 });
});

apps.post("/start", (req, res) => {
  activityTracker.init();
  return res.status(200).json({ status: "started" });
});
apps.post("/stop", (req, res) => {
  activityTracker.stop();
  return res.status(200).json({ status: "stopped" });
});

apps.get("/get-chart", async (req, res) => {
  const chartData = await activityTracker.getChartData();
  return res.status(200).json(chartData);
});

apps.listen(3000, () => console.log(`Listening on port 3000!`));
