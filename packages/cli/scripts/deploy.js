"use strict";
const fetch = require('node-fetch');
const { logger } = require("./util/logger");

module.exports = async function (argv) {
  const { org, app, stage, commit } = argv;
  const domain = "apiv2.staging.seed.run";

  // Make request
  const basicAuth = Buffer.from(`${org}:${process.env.SEED_TOKEN}`, 'binary').toString('base64');
  const url = `https://${domain}/${org}/${app}/stages/${stage}/deploy_all_cli`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ commit_sha: commit }),
    headers: {
      Authorization: `Basic ${basicAuth}`
    },
  });

  // Parse response
  const data = await response.json();
  if (data.buildId) {
    logger.info(`Build v${data.buildId} started in ${stage}`);
    return process.exit(0);
  }
  else if (data.code) {
    logger.error(chalk.red(`Request failed with error: ${data.code}`));
  }
  else if (data.message === "Forbidden") {
    logger.error(chalk.red(`Authentication failed for "${org}"`));
  }
  else {
    logger.error(chalk.red(data));
  }

  return process.exit(1);
};
