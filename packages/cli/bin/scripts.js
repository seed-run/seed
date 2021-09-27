#!/usr/bin/env node

"use strict";

process.on("uncaughtException", (err) => {
  // Format any uncaught exceptions
  console.error("\n" + (err ? err.stack || err : "Uncaught exception") + "\n");
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  throw err;
});

const yargs = require("yargs");
const chalk = require("chalk");
const { logger } = require("../scripts/util/logger");

const args = process.argv.slice(2);

const script = args[0];

const cmd = {
  s: "seed",
  deploy: "deploy",
};

const internals = {
  [cmd.deploy]: require("../scripts/deploy"),
};

function addOptions() {
  return function (yargs) {
    yargs
      .option("org", {
        type: "string",
        describe: "The organization you want to deploy to",
        demandOption: true,
      })
      .option("app", {
        type: "string",
        describe: "The application you want to deploy to",
        demandOption: true,
      })
      .option("stage", {
        type: "string",
        describe: "The stage you want to deploy to",
        demandOption: true,
      })
      .option("commit", {
        type: "string",
        describe: "The commit hash you want to deploy",
        demandOption: true,
      })
      .option("force", {
        default: false,
        desc: "Force deploy even if there are no changes.",
        type: "boolean",
      });
  };
}

const argv = yargs
  .usage(`${cmd.s} <command>`)
  .demandCommand(1)

  .option("no-color", {
    default: false,
    type: "boolean",
    desc: "Remove colors and other style from console output",
  })
  .option("verbose", {
    default: false,
    type: "boolean",
    desc: "Show more debug info in the output",
  })

  .command(
    cmd.deploy,
    "Deploy your Seed app",
    addOptions()
  )

  .example([
    [
      `$0 ${cmd.deploy} --org acme --app backend-api --stage dev --commit 15292b4289b5a565025938ee27c5554cc4a2c41e`,
      "Deploy a commit to a stage",
    ],
  ])

  .version()
  .alias("version", "v")
  .help("help")
  .alias("help", "h")
  .epilogue("For more information, visit www.seed.run")

  .wrap(yargs.terminalWidth())

  .fail((msg, err) => {
    if (err) throw err;

    console.log(chalk.red(msg) + "\n");

    yargs.showHelp();

    process.exit(1);
  })
  .parse();

// Disable color
if (!process.stdout.isTTY || argv.noColor) {
  chalk.level = 0;
}

// Set debug flag
if (argv.verbose) {
  logger.level = "debug";
}

switch (script) {
  case cmd.deploy: {
    internals[script](argv).catch((e) => {
      logger.error(e.message);
      process.exit(1);
    });
    break;
  }
  default:
    logger.log('Unknown script "' + script + '".');
    break;
}
