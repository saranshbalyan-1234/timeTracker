const express = require("express");
const app = express();
const parser = require("body-parser");
const { validateToken } = require("./Utils/jwt");
const authRoutes = require("./Routes/authRoutes");
const trackingRoutes = require("./Routes/trackingRoutes");
const ActivityTracker = require("./ActivityTracker");
const activityTracker = new ActivityTracker("tracking.json", 2000);

app.use(parser.json());
app.use("/auth", authRoutes);
app.use("/tracking", trackingRoutes);
app.post("/time/start", (req, res) => {
  activityTracker.init();
  return res.status(200).json({ status: "started" });
});
app.post("/time/pause", (req, res) => {
  activityTracker.stop();
  return res.status(200).json({ status: "stopped" });
});

app.post("/get-chart", async (req, res) => {
  const chartData = await activityTracker.getChartData();
  return res.status(200).json(chartData);
});

app.post("/save-tracking", async (req, res) => {
  const chartData = await activityTracker.getChartData();
  return res.status(200).json(chartData);
});

app.listen(3000, () => console.log(`Listening on port 3000!`));
