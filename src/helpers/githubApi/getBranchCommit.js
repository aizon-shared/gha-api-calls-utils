// Returns the commit sha of a branch (latest commit).
export default async (octokit, owner, repo, branch) => {
  // GET /repos/{owner}/{repo}/branches/{branch}
  const { data } = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch,
  });

  return data.commit.sha;
}