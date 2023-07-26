import { getOctokit } from "@actions/github";
import { GITHUB_API_VERSION } from "../../constants";

// It returns the commit sha of a branch (latest commit).
export default async (token: string , owner: string, repo: string, branch: string) => {
  const client = getOctokit(token);
  const { data } = await client.request('GET /repos/{owner}/{repo}/branches/{branch}', {
    owner,
    repo,
    branch,
    headers: {
      'X-GitHub-Api-Version': GITHUB_API_VERSION
    }
  })  

  return data.commit.sha;
}