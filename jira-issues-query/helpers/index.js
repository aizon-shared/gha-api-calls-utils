import fetch from 'node-fetch';

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

  return data;
};