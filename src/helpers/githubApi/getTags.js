// Returns the tags of a repository.
export default async (octokit, owner, repo, page = 1) => {
  // GET /repos/{owner}/{repo}/tags
  const { data } = await octokit.rest.repos.listTags({
    owner,
    repo,
    page,
  });

  return data;
}