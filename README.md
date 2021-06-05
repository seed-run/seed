# Seed CLI [![npm](https://img.shields.io/npm/v/@seed-run/cli.svg)](https://www.npmjs.com/package/@seed-run/cli)

A commandline tool for deploying [Seed](https://seed.run) apps.

## Getting Started

Install the `@seed-run/cli` CLI.

```bash
$ npm install -g @seed-run/cli
```

And trigger a deployment to your apps on Seed.

```bash
$ SEED_TOKEN=ACME_ORG_TOKEN seed deploy --org acme --app backend-api --stage dev --commit 700b9c2
```

### Options

You simply need to pass in the:

- Org name `--org`
- App name `--app`
- Stage name `--stage`
- Git commit SHA `--commit`
- And a Seed CLI token as an environment variable `SEED_TOKEN`

### Seed CLI Token

You can generate the `SEED_TOKEN` from your org settings in the [Seed console](https://console.seed.run).

## Community

[Follow us on Twitter](https://twitter.com/SEED_run), [join us on Slack](https://launchpass.com/serverless-stack), and [sign up for our newsletter](https://emailoctopus.com/lists/14c85084-324e-11ea-be00-06b4694bee2a/forms/subscribe).
