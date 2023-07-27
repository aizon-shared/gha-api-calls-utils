import { getOctokit } from "@actions/github";

// It returns the commit sha of a branch (latest commit).
export default async (client: ReturnType<typeof getOctokit>, owner: string, repo: string, branch: string) => {
  // GET /repos/{owner}/{repo}/branches/{branch}
  const { data } = await client.rest.repos.getBranch({
    owner,
    repo,
    branch,
  });

  return data.commit.sha;
}