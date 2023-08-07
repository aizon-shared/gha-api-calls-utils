// Return the ref info from the repo
export default async (octokit, owner, repo, ref) => {
  // GET /repos/{owner}/{repo}/git/ref/{ref}
  const { data } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref,
  });

  return data;
};