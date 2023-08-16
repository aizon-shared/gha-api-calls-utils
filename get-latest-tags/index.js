import * as core from '@actions/core';
import { getOctokit } from "@actions/github";

async function run() {
  try {
    const repositories = core.getInput('repositories').split(',');
    const token = core.getInput('token');
    const owner = core.getInput('owner');
    const branch = core.getInput('branch');

    const client = getOctokit(token);

    const repoTagPairs = await Promise.all(repositories.map(async (repo) => {
      const { data: branchInfo } = await client.rest.repos.getBranch({
        owner,
        repo,
        branch,
      });
      const commit = branchInfo.commit.sha;
      const { data: tags } = await client.rest.repos.listTags({
        owner,
        repo,
        page,
      });

      const tagInLatestCommit = tags.find((tag) => tag.commit.sha === commit)?.name;

      if (!tagInLatestCommit) {
        throw new Error(`Tag not found in latest commit (${commit}) for repository ${repo}`);
      }
      
      return [repo, tagInLatestCommit];
    }));

    const latestTags = Object.fromEntries(repoTagPairs);

    core.setOutput('latestTags', latestTags);
  } catch (error) {
    core.setFailed(error);
  }
}

run();