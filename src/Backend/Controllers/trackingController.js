const db = require("../Utils/dataBaseConnection");
const getError = require("../Utils/sequelizeError");
const fs = require("fs-extra");
const ActivityTracker = require("../ActivityTracker");
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

  // const newDate = new Date();
  // let currentYear = newDate.getFullYear();
  // let currentMonth =
  //   newDate.getMonth() + 1 < 10
  //     ? `0${newDate.getMonth() + 1}`
  //     : `${newDate.getMonth() + 1}`;
  // let currentDay =
  //   newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();

  const dates = await activityTracker.findDataToPost();

  dates.forEach(async (date) => {
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
            )
              .then(async (resp) => {
                if (resp[0]) {
                  res.status(200).json({ message: "Tracking Updated" });
                } else {
                  res.status(400).json({ errors: ["Record not found"] });
                }
              })
              .catch((e) => {
                getError(e, res);
              });
          } else {
            await Tracking.create(data)
              .then((resp) => {
                res.status(200).json({ message: "Tracking Saved" });
              })
              .catch((e) => {
                getError(e, res);
              });
          }
        })
        .catch((e) => {
          getError(e, res);
        });
    }
  });
};

module.exports = {
  saveOrUpdate,
  start,
  stop,
  userData,
};
