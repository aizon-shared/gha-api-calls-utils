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
      const { data: commitInfo } = await client.rest.git.getTag({
        owner,
        repo,
        tag_sha: tagInfo.object.sha,
      });
      await client.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha: commitInfo.object.sha,
      });
    }));
  } catch (error) {
    core.setFailed(error);
  }
}

run();