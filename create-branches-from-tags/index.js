import * as core from '@actions/core';
import { getOctokit } from "@actions/github";

async function run() {
  try {
    const token = core.getInput('token');
    const repositories = Object.entries(JSON.parse(core.getInput('repositories')));
    const branch = core.getInput('branch');
    const owner = core.getInput('owner');

    const client = getOctokit(token);

    await Promise.all(repositories.map(async ([repo, tag]) => {
      try {
        await client.rest.git.getRef({
          owner,
          repo,
          ref: `heads/${branch}`,
        });
        core.info(`Skipping ${repo} because branch ${branch} already exists`);
      } catch (error) {
        let commitSha;

        if (error.status === 404) {
          const { data: tagInfo } = await client.rest.git.getRef({
            owner,
            repo,
            ref: `tags/${tag}`,
          });

          if (tagInfo.object.type === 'tag') {
            // Annotated tag
            console.log('annotated tag')
            const { data: annotatedTagInfo } = await client.rest.git.getTag({
              owner,
              repo,
              tag_sha: tagInfo.object.sha,
            });

            commitSha = annotatedTagInfo.object.sha;
          } else if (tagInfo.object.type === 'commit') {
            // Lightweight tag
            commitSha = tagInfo.object.sha;
          }

          core.info(`Creating branch ${branch} from commit ${commitSha} in ${repo}`);
          await client.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branch}`,
            sha: commitSha,
          });
        } else {
          throw error;
        }
      }
    }));
  } catch (error) {
    core.setFailed(error);
  }
}

run();