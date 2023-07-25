import core from '@actions/core';
import { Octokit } from '@octokit/rest';

import getTags from './githubApi/getTags';
import getBranchCommit from './githubApi/getBranchCommit';

type repository = string;
type tag = string;

export default async () => {
  try {
    const client = new Octokit({ auth: core.getInput('token') });
    const repositories: Array<string> = JSON.parse(core.getInput('repositories'));
    const owner = core.getInput('owner');
    const branch = core.getInput('branch');

    const repoTagPairs = await Promise.all(repositories.map(async (repo) => {
      const commit = await getBranchCommit(client, owner, repo, branch);
      const tags = await getTags(client, owner, repo);

      const tagInLastCommit = tags.find((tag) => tag.commit.sha === commit)?.name;

      if (!tagInLastCommit) {
        throw new Error(`Tag not found in latest commit (${commit}) for repository ${repo}`);
      }
      
      return [repo, tagInLastCommit];
    }));

    const latestTags: Record<repository, tag> = Object.fromEntries(repoTagPairs);

    return latestTags;
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}