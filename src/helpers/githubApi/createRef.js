// Creates a ref in the repository.
export default async (octokit, owner, repo, ref, sha) => {
  console.log(`Creating ref ${ref} in ${owner}/${repo} pointing to ${sha}`);
  // POST /repos/{owner}/{repo}/git/refs
  await octokit.rest.git.createRef({
    owner,
    repo,
    ref,
    sha,
  });
}