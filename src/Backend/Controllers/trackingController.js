const db = require("../Utils/dataBaseConnection");
const getError = require("../Utils/sequelizeError");
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

  const chartData = await activityTracker.getChartData();
  const newDate = new Date();
  const data = {
    user_id: userData.id,
    date: `${newDate.getFullYear()}-${
      newDate.getMonth() + 1
    }-${newDate.getDate()}`,
    data: JSON.stringify(chartData),
  };
  if (!data)
    return res.status(400).json({ errors: ["Tracking details not given"] });

  // return console.log("saransh", { date: data.date });
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
};

const update = async (req, res) => {
  await Tracking.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(async (resp) => {
      if (resp[0]) {
        await User.findByPk(req.params.id)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((e) => {
            res.status(500).json(e);
          });
      } else {
        res.status(400).json({ errors: ["Record not found"] });
      }
    })
    .catch((e) => {
      getError(e, res);
    });
};
const findById = async (req, res) => {
  await Tracking.findByPk(req.params.id)
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((e) => {
      getError(e, res);
    });
};
const findAll = async (req, res) => {
  //   User.scope(["name"]).findAll;
  await Tracking.findAll({
    // order: [["title", "DESC"]],
    // where: {
    //   [Op.and]: [{ id: 1 }, { name: "saransh" }],
    // },
    // attributes: ["username"],
    //   include: [{ model: Car, attributes: ["name"], as: "nameChange" }],
  })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((e) => {
      getError(e, res);
    });
};

const findByParam = async (req, res) => {
  await Tracking.findOne({
    // order: [["title", "DESC"]],
    // attributes: ["username"],
    where: req.body,
  })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((e) => {
      getError(e, res);
    });
};

module.exports = {
  saveOrUpdate,
  update,
  findById,
  findByParam,
  findAll,
  start,
  stop,
  userData,
};
