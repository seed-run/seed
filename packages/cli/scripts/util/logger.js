"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "info";

log4js.configure({
  appenders: {
    console: { type: "console", layout: { type: "messagePassThrough" } },
  },
  categories: {
    default: { appenders: ["console"], level: "info" },
  },
});

module.exports = {
  logger,
};
