import fetch from 'node-fetch';
import * as core from '@actions/core';

export default async (host, token, query, fields, limit, startAt) => {
  const url = `${host}/rest/api/2/search?jql=${query}&fields=${fields}&maxResults=${limit}&startAt=${startAt}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  core.debug(JSON.stringify(data));

  return data;
};