import * as core from '@actions/core';
import { getOctokit } from "@actions/github";

import getTags from '../src/helpers/githubApi/getTags';

async function run() {
  try {
    const repository = core.getInput('repository');
    const token = core.getInput('token');
    const owner = core.getInput('owner');
    const prefix = core.getInput('prefix');

    const client = getOctokit(token);
    let page = 1;

    while (true) {
      const tags = await getTags(client, owner, repository, page);
      const tagsStartingWithPrefix = tags.filter((tag) => tag.name.startsWith(prefix));
      const latestTag = tagsStartingWithPrefix[0]?.name;
      if (latestTag) {
        core.setOutput('tag', latestTag);
        break;
      } else if (tags.length === 0) {
        break;
      }
      page++;
    }
  } catch (error) {
    core.setFailed(error);
  }
}

run();