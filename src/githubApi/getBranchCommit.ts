import { Octokit } from "@octokit/rest";
import { GITHUB_API_VERSION } from "../../constants";

// It returns the commit sha of a branch (last commit).
export default async (client: Octokit, owner: string, repo: string, branch: string) => {
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