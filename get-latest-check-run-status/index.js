import * as core from '@actions/core';
import { getOctokit } from "@actions/github";


async function run() {
  try {
    const token = core.getInput('token');
    const name = core.getInput('name') || undefined;
    const branch = core.getInput('branch');
    const owner = core.getInput('owner');
    const repository = core.getInput('repository');

    const client = getOctokit(token);
    const runs = [];

    while (true) {
      const { data: commits } = await client.rest.repos.listCommits({
        owner,
        repo: repository,
        sha: branch,
        page,
      });

      for (var i = 0; i < commits.length; i++) {
        const sha = commits[i].sha;
        const { data: checkRuns } = await client.rest.checks.listForRef({
          owner,
          repo: repository,
          ref: sha,
          check_name: name,
        });

        checkRuns.check_runs.forEach(checkRun => {
          runs.push({
            name: checkRun.name,
            status: checkRun.status,
            conclusion: checkRun.conclusion,
            sha: sha,
          });
        });

        if (runs.length > 0) {
          break;
        }
      }

      if (commits.length === 0) {
        break;
      }
      page++;
    }

    core.setOutput('runs', runs);
  } catch (error) {
    core.setFailed(error);
  }
}

run();