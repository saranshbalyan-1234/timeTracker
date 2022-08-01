const db = require("../Utils/dataBaseConnection");
const getError = require("../Utils/sequelizeError");
const ActivityTracker = require("../ActivityTracker");
const activityTracker = new ActivityTracker("tracking.json", 2000);
const { userData } = require("../../index");
const Tracking = db.tracking;

const save = async (req, res) => {
  const chartData = await activityTracker.getChartData();
  const data = { user_id: userData.id, date: new Date(), data: chartData };
  if (!userData.id)
    return res.status(400).json({ errors: ["User details not given"] });
  if (!data)
    return res.status(400).json({ errors: ["Tracking data not found"] });
  await Tracking.create(data, {
    // fields: ["", "email"],
  })
    .then((resp) => {
      res.status(200).json(resp);
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
  save,
  update,
  findById,
  findByParam,
  findAll,
};
