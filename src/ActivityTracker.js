// var screenshot = require("desktop-screenshot");

// screenshot("screenshot.png", function (error, complete) {
//   if (error) console.log("Screenshot failed", error);
//   else console.log("Screenshot succeeded");
// });

const activeWin = require("active-win");
const fs = require("fs-extra");
const _ = require("lodash");

let intervalId;
class ActivityTracker {
  constructor(filePath, interval) {
    this.filePath = filePath;
    this.interval = interval;
    this.start = null;
    this.app = null;
  }

  async storeData() {
    const content = await fs.readJson(this.filePath);
    const time = {
      start: this.start,
      end: new Date(),
    };
    const {
      url,
      owner: { name },
      title,
    } = this.app;

    _.defaultsDeep(content, { [name]: { [title]: { time: 0, url } } });

    content[name][title].time += Math.abs(time.start - time.end) / 1000;

    await fs.writeJson(this.filePath, content, { spaces: 2 });
  }

  track() {
    console.log("started tracking");
    intervalId = setInterval(async () => {
      const window = await activeWin();

      if (!this.app) {
        this.start = new Date();
        this.app = window;
      }

      if (window.title !== this.app.title) {
        await this.storeData();
        this.app = null;
      }
    }, this.interval);
  }

  async getChartData() {
    const data = await fs.readJson(this.filePath);
    const formatedData = [];

    Object.entries(data).forEach(([key, val]) => {
      const programs = [];
      let totalTimeOnApp = 0;

      Object.entries(val).forEach(([prop, meta]) => {
        totalTimeOnApp += meta.time;
        programs.push({
          name: prop,
          url: meta.url,
          time: meta.time,
        });
      });

      formatedData.push({
        title: key,
        total: Math.floor(totalTimeOnApp),
        data: programs,
      });
    });

    return formatedData;
  }

  async init() {
    const fileExists = await fs.pathExists(this.filePath);

    if (!fileExists) {
      await fs.writeJson(this.filePath, {});
    }
    console.log("initialised tracking.json");
    this.track();
  }
  async stop() {
    console.log("stopped interval ==>", intervalId);
    clearInterval(intervalId);
  }
}

module.exports = ActivityTracker;
