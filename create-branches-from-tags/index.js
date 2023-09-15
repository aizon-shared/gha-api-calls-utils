import * as core from '@actions/core';
import { getOctokit } from "@actions/github";

async function run() {
  try {
    const token = core.getInput('token');
    const repositories = Object.entries(JSON.parse(core.getInput('repositories')));
    const branch = core.getInput('branch');
    const owner = core.getInput('owner');

    const client = getOctokit(token);

    await Promise.all(repositories.map(async ([repo, tag]) => {
      const { data: tagInfo } = await client.rest.git.getRef({
        owner,
        repo,
        ref: `tags/${tag}`,
      });

      try {
        await client.rest.git.getRef({
          owner,
          repo,
          ref: `heads/${branch}`,
        });
        core.info(`Skipping ${repo} because branch ${branch} already exists`);
      } catch (error) {
        if (error.status === 404) {
          core.info(`Creating branch ${branch} from in sha ${tagInfo.object.sha} in ${repo}`);
          await client.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branch}`,
            sha: tagInfo.object.sha,
          });
        } else {
          core.error(error);
          throw error;
        }
      }
    }));
  } catch (error) {
    core.setFailed(error);
  }
}

run();