import { getOctokit } from "@actions/github";
import { GITHUB_API_VERSION } from "../../constants";

// It returns the commit sha of a branch (latest commit).
export default async (token: string , owner: string, repo: string, branch: string) => {
  const client = getOctokit(token);
  const { data } = await client.rest.repos.getBranch({
    owner,
    repo,
    branch,
  });

  return data.commit.sha;
}