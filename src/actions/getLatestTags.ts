import * as core from '@actions/core';
import { getOctokit } from "@actions/github";

import getTags from '../helpers/githubApi/getTags';
import getBranchCommit from '../helpers/githubApi/getBranchCommit';

type repository = string;
type tag = string;

async function run(): Promise<void> {
  try {
    const repositories: Array<string> = core.getInput('repositories').split(',');
    const token = core.getInput('token');
    const owner = core.getInput('repositoryOwner');
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

    const latestTags: Record<repository, tag> = Object.fromEntries(repoTagPairs);

    core.setOutput('latestTags', JSON.stringify(latestTags));
  } catch (error) {
    core.setFailed(error as Error);
  }
}

run();