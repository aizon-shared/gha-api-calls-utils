import * as core from '@actions/core';
import { getOctokit } from "@actions/github";

import getTag from '../src/helpers/githubApi/getTag.js';
import getRef from '../src/helpers/githubApi/getRef.js';
import createRef from '../src/helpers/githubApi/createRef.js';

async function run() {
  try {
    const token = core.getInput('token');
    const repositories = Object.entries(JSON.parse(core.getInput('repositories')));
    const branch = core.getInput('branch');
    const owner = core.getInput('owner');

    const client = getOctokit(token);

    await Promise.all(repositories.map(async ([repo, tag]) => {
      const tagInfo = await getRef(client, owner, repo, `tags/${tag}`);
      console.log(`tagInfo: ${tagInfo.object.sha}`);
      const commitInfo = await getTag(client, owner, repo, tagInfo.object.sha);
      console.log(`commitInfo: ${commitInfo.object.sha}`);
      await createRef(client, owner, repo, `refs/heads/${branch}`, commitInfo.object.sha);
    }));
  } catch (error) {
    core.setFailed(error);
  }
}

run();