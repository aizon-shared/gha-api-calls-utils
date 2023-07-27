import { getOctokit } from "@actions/github";

// It returns the tags of a repository.
export default async (client: ReturnType<typeof getOctokit>, owner: string, repo: string) => {
  // GET /repos/{owner}/{repo}/tags
  const { data } = await client.rest.repos.listTags({
    owner,
    repo,
  });

  return data;
}