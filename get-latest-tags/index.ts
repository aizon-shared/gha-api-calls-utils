import core from '@actions/core';

import getTags from '../src/githubApi/getTags';
import getBranchCommit from '../src/githubApi/getBranchCommit';

type repository = string;
type tag = string;

export default async () => {
  try {
    const repositories: Array<string> = JSON.parse(core.getInput('repositories'));
    const token = core.getInput('githubToken');
    const owner = core.getInput('repositoryOwner');
    const branch = core.getInput('branch');

    console.log('repositories', repositories);
    console.log('token', token);
    console.log('owner', owner);
    console.log('branch', branch);

    const repoTagPairs = await Promise.all(repositories.map(async (repo) => {
      const commit = await getBranchCommit(token, owner, repo, branch);
      const tags = await getTags(token, owner, repo);

      const tagInLatestCommit = tags.find((tag) => tag.commit.sha === commit)?.name;

      if (!tagInLatestCommit) {
        throw new Error(`Tag not found in latest commit (${commit}) for repository ${repo}`);
      }
      
      return [repo, tagInLatestCommit];
    }));

    const latestTags: Record<repository, tag> = Object.fromEntries(repoTagPairs);

    core.setOutput('latestTags', JSON.stringify(latestTags));
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}