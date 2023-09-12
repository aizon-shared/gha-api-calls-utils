import * as core from '@actions/core';
import { getOctokit } from "@actions/github";


async function run() {
  try {
    const token = core.getInput('token');
    const name = core.getInput('name') || undefined;
    const branch = core.getInput('branch');
    const owner = core.getInput('owner');
    const repositories = core.getInput('repositories').split(',');
    const limit = core.getInput('limit');

    const client = getOctokit(token);

    const results = await Promise.all(repositories.map(async (repo) => {
      const runs = new Map();
      try {
        const { data: commits } = await client.rest.repos.listCommits({
          owner,
          repo,
          sha: branch,
          per_page: parseInt(limit),
        });

        for (var i = 0; i < commits.length; i++) {
          const sha = commits[i].sha;
          try {
            const { data: checkRuns } = await client.rest.checks.listForRef({
              owner,
              repo,
              ref: sha,
              check_name: name,
              per_page: 100,
            });

            checkRuns.check_runs.forEach(checkRun => {
              const latestRun = runs.get(run.name);
              if (!latestRun || new Date(run.completed_at) > new Date(latestRun.completed_at)) {
                runs.set(run.name, {
                  repository: repo,
                  name: checkRun.name,
                  status: checkRun.status,
                  conclusion: checkRun.conclusion,
                  sha: sha,
                  url: checkRun.html_url,
                  completed_at: checkRun.completed_at,
                });
              }
            });
          } catch (error) {
            core.error(`Failed to list check runs for repository: ${repo} ref: ${sha}`);
            throw error;
          }

          if (runs.size > 0) {
            break;
          }
        }
      } catch (error) {
        core.error(`Failed to list commits for repository: ${repo} ref: ${branch}`);
        throw error;
      }

      return [repo, Array.from(runs.values())];
    }));

    core.setOutput('runs', Object.fromEntries(results));
  } catch (error) {
    core.setFailed(error);
  }
}

run();