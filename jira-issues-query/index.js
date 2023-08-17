import * as core from '@actions/core';
import jqlSearch from '../src/helpers/jiraApi/jqlSearch.js';

async function run() {
  try {
    const token = core.getInput('token');
    const host = core.getInput('host');
    const query = core.getInput('query');
    const fields = core.getInput('fields');
    const filter = core.getInput('filter');

    let results = [];

    const limit = 100;
    let startAt = 0;

    const data = await jqlSearch(host, token, query, fields, limit, startAt);
    results = results.concat(data.issues || []);

    while (data.total > startAt + limit) {
      startAt += limit;

      const data = await jqlSearch(host, token, query, fields, limit, startAt);
      results = results.concat(data.issues || []);
    }

    if (filter) {
      results = results.filter(eval(filter));
    }

    core.setOutput('results', results);
  } catch (error) {
    core.setFailed(error);
  }
}

run();