import { Octokit } from "@octokit/rest";
import { GITHUB_API_VERSION } from "../../constants";

// It returns the tags of a repository.
export default async (client: Octokit, owner: string, repo: string) => {
  const { data } = await client.request('GET /repos/{owner}/{repo}/tags', {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': GITHUB_API_VERSION
    }
  });

  return data;
}