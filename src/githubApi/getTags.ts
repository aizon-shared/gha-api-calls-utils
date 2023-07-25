import { getOctokit } from "@actions/github";
import { GITHUB_API_VERSION } from "../../constants";

// It returns the tags of a repository.
export default async (token: string, owner: string, repo: string) => {
  const client = getOctokit(token);
  const { data } = await client.request('GET /repos/{owner}/{repo}/tags', {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': GITHUB_API_VERSION
    }
  });

  return data;
}