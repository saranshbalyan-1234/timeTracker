const db = require("../Utils/dataBaseConnection");
const getError = require("../Utils/sequelizeError");
const fs = require("fs-extra");
const ActivityTracker = require("../ActivityTracker");
const getErrorOnly = require("../Utils/errorOnly");
const activityTracker = new ActivityTracker("tracking.json", 2000);

const Tracking = db.tracking;

var userData = {};

const start = (req, res) => {
  activityTracker.init();
  return res.status(200).json({ status: "started" });
};

const stop = (req, res) => {
  activityTracker.stop();
  saveOrUpdate(req, res);
  // return res.status(200).json({ status: "stopped" });
};

const saveOrUpdate = async (req, res) => {
  if (!userData.id)
    return res.status(400).json({ errors: ["User details not given"] });

  const newDate = new Date();

  let currentDay =
    newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();

  const dates = await activityTracker.findDataToPost();

  await dates.forEach(async (date) => {
    const chartData = await activityTracker.getChartData(date);
    const data = {
      user_id: userData.id,
      date: date,
      data: JSON.stringify(chartData),
    };

    // if (!chartData)
    //   return res.status(400).json({ errors: ["Tracking details not given"] });

    if (chartData) {
      await Tracking.findOne({
        where: { user_id: userData.id, date: data.date },
      })
        .then(async (resp) => {
          if (resp) {
            await Tracking.update(
              { data: data.data },
              {
                where: { user_id: userData.id, date: data.date },
              }
            ).catch((e) => {
              console.log(e);
            });
          } else {
            await Tracking.create(data).catch((e) => {
              console.log(e);
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (date.substring(8) !== currentDay) {
      await activityTracker.removeOldData(date);
    }
  });
  return res.status(200).json({ message: "Synced Tracking Data" });
};

module.exports = {
  saveOrUpdate,
  start,
  stop,
  userData,
};
