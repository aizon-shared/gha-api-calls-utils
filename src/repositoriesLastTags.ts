import core from '@actions/core';

import getTags from './githubApi/getTags';
import getBranchCommit from './githubApi/getBranchCommit';

type repository = string;
type tag = string;

export default async () => {
  try {
    const repositories: Array<string> = JSON.parse(core.getInput('repositories'));
    const token = core.getInput('token');
    const owner = core.getInput('owner');
    const branch = core.getInput('branch');

    const repoTagPairs = await Promise.all(repositories.map(async (repo) => {
      const commit = await getBranchCommit(token, owner, repo, branch);
      const tags = await getTags(token, owner, repo);

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