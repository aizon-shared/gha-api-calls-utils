// Return the tag info from the repo
export default async (octokit, owner, repo, tag) => {
  // GET /repos/{owner}/{repo}/git/ref/{ref}
  const { data } = await octokit.rest.git.getTag({
    owner,
    repo,
    tag,
  });

  return data;
};