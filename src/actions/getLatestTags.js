import * as core from '@actions/core';
import { getOctokit } from "@actions/github";

import getTags from '../helpers/githubApi/getTags';
import getBranchCommit from '../helpers/githubApi/getBranchCommit';

async function run() {
  try {
    const repositories = core.getInput('repositories').split(',');
    const token = core.getInput('token');
    const owner = core.getInput('owner');
    const branch = core.getInput('branch');

    const client = getOctokit(token);

    const repoTagPairs = await Promise.all(repositories.map(async (repo) => {
      const commit = await getBranchCommit(client, owner, repo, branch);
      const tags = await getTags(client, owner, repo);

      const tagInLatestCommit = tags.find((tag) => tag.commit.sha === commit)?.name;

      if (!tagInLatestCommit) {
        throw new Error(`Tag not found in latest commit (${commit}) for repository ${repo}`);
      }
      
      return [repo, tagInLatestCommit];
    }));

    const latestTags = Object.fromEntries(repoTagPairs);

    core.setOutput('latestTags', latestTags);
  } catch (error) {
    console.error(error);
    core.setFailed(error);
  }
}

run();