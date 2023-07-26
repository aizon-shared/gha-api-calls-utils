import { getOctokit } from "@actions/github";
import { GITHUB_API_VERSION } from "../../constants";

// It returns the tags of a repository.
export default async (token: string, owner: string, repo: string) => {
  const client = getOctokit(token);
  const { data } = await client.rest.repos.listTags({
    owner,
    repo,
  });

  return data;
}