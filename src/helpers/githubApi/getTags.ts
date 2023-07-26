import { getOctokit } from "@actions/github";

// It returns the tags of a repository.
export default async (token: string, owner: string, repo: string) => {
  const client = getOctokit(token);
  const { data } = await client.rest.repos.listTags({
    owner,
    repo,
  });

  return data;
}