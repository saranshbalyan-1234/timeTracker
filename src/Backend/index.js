const express = require("express");
const app = express();
const parser = require("body-parser");
const { validateToken } = require("./Utils/jwt");
const authRoutes = require("./Routes/authRoutes");
const trackingRoutes = require("./Routes/trackingRoutes");
// const ActivityTracker = require("./ActivityTracker");
// const activityTracker = new ActivityTracker("tracking.json", 2000);

app.use(parser.json());
app.use("/auth", authRoutes);
app.use("/tracking", trackingRoutes);

app.listen(3000, () => console.log(`Listening on port 3000!`));
