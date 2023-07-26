import { Octokit } from 'octokit';

// It returns the tags of a repository.
export default async (client: Octokit, owner: string, repo: string) => {
  const { data } = await client.rest.repos.listTags({
    owner,
    repo,
  });

  return data;
}