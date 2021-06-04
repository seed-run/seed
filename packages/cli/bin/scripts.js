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

require("source-map-support").install();

const yargs = require("yargs");
const chalk = require("chalk");

const args = process.argv.slice(2);

const script = args[0];
const scriptArgs = args.slice(1);

const cmd = {
  s: "seed",
  deploy: "deploy",
};

const internals = {
  [cmd.deploy]: require("../scripts/deploy"),
};

function addOptions(currentCmd) {
  return function (yargs) {
    yargs
      .option("stage", {
        type: "string",
        describe: "The stage you want to deploy to",
      })
      .option("commit", {
        type: "string",
        describe: "The commit hash you want to deploy",
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
    addOptions(cmd.deploy)
  )

  .example([
    [
      `$0 ${cmd.deploy} --stage dev --commit 15292b4289b5a565025938ee27c5554cc4a2c41e`,
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
  process.env.DEBUG = "true";
}

switch (script) {
  case cmd.deploy: {
    internals[script](argv).catch((e) => {
      console.error(e.message);
      process.exit(1);
    });
    break;
  }
  default:
    console.log('Unknown script "' + script + '".');
    break;
}
