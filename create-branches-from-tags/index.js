import * as core from '@actions/core';
import { getOctokit } from "@actions/github";

import getRefSha from '../src/helpers/githubApi/getRefSha.js';
import createRef from '../src/helpers/githubApi/createRef.js';

async function run() {
  try {
    const token = core.getInput('token');
    const repositories = Object.entries(JSON.parse(core.getInput('repositories')));
    const branch = core.getInput('branch');
    const owner = core.getInput('owner');

    const client = getOctokit(token);

    await Promise.all(repositories.map(async ([repo, tag]) => {
      const originTagRef = `tags/${tag}`;
      const finalBranchRef = `refs/heads/${branch}`;
      const originalRefSha = await getRefSha(client, owner, repo, originTagRef);
      console.log('sha: ', originalRefSha);
      console.log('token: ', token);
      await createRef(client, owner, repo, finalBranchRef, originalRefSha);
    }));
  } catch (error) {
    core.setFailed(error);
  }
}

run();