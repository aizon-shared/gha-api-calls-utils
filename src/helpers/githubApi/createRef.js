// Creates a ref in the repository.
export default async (octokit, owner, repo, ref, sha) => {
  // POST /repos/{owner}/{repo}/git/refs
  await octokit.rest.git.createRef({
    owner,
    repo,
    ref,
    sha,
  });
}