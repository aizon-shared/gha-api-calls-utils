import * as core from '@actions/core';
import { getOctokit } from "@actions/github";


async function run() {
  try {
    const token = core.getInput('token');
    const name = core.getInput('name') || undefined;
    const branch = core.getInput('branch');
    const owner = core.getInput('owner');
    const repositories = core.getInput('repositories').split(',');

    const client = getOctokit(token);

    const results = await Promise.all(repositories.map(async (repo) => {
      const runs = [];
      let page = 1;

      while (true) {
        const { data: commits } = await client.rest.repos.listCommits({
          owner,
          repo,
          sha: branch,
          per_page: 100,
          page,
        });

        for (var i = 0; i < commits.length; i++) {
          const sha = commits[i].sha;
          const { data: checkRuns } = await client.rest.checks.listForRef({
            owner,
            repo,
            ref: sha,
            check_name: name,
            per_page: 100,
          });

          checkRuns.check_runs.forEach(checkRun => {
            runs.push({
              repository: repo,
              name: checkRun.name,
              status: checkRun.status,
              conclusion: checkRun.conclusion,
              sha: sha,
              url: checkRun.html_url,
            });
          });

          if (runs.length > 0) {
            break;
          }
        }

        if (runs.length > 0 || commits.length === 0) {
          break;
        }
        page++;
      }

      return [repo, runs];
    }));

    core.setOutput('runs', Object.fromEntries(results));
  } catch (error) {
    core.setFailed(error);
  }
}

run();