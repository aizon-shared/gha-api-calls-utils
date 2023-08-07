// Return the commit sha of a reference in the repository.
export default async (octokit, owner, repo, ref) => {
  // GET /repos/{owner}/{repo}/git/ref/{ref}
  const { data } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref,
  });

  return data.object.sha;
};