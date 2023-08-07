// Return the tag info from the repo
export default async (octokit, owner, repo, tagSha) => {
  // GET /repos/{owner}/{repo}/git/tags/{tag_sha}
  const { data } = await octokit.rest.git.getTag({
    owner,
    repo,
    tag_sha: tagSha,
  });

  return data;
};