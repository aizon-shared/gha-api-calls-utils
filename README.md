# gha-release-management
Defines the actions involved in the release process

- [gha-release-management](#gha-release-management)
  - [get-latest-tags](#get-latest-tags)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
    - [Usage](#usage)
  - [get-latest-matching-tag](#get-latest-matching-tag)
    - [Inputs](#inputs-1)
    - [Outputs](#outputs-1)
    - [Usage](#usage-1)
  - [jira-issues-query](#jira-issues-query)
    - [Inputs](#inputs-2)
    - [Outputs](#outputs-2)
    - [Usage](#usage-2)
  - [create-branches-from-tags](#create-branches-from-tags)
    - [Inputs](#inputs-3)

## get-latest-tags
Takes repository names separated by comma (,) and outputs a json with the latest tag of each repository if it exists in the latest commit of the branch. The key of the json is the repository name and the value is the latest tag.

### Inputs

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| token | Github token | true | |
| repositories | Repository names separated by comma (,) | false | |
| owner | Owner of the repositories | true | `${{github.repository_owner}}` |
| branch | Branch to check for tags | true | main |

### Outputs
| Name | Description |
| --- | --- |
| latestTags | JSON with the latest tag of each repository |

### Usage

```yaml
...

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - name: Parse json and get latest tag for each repository
        id: latest-tags
        uses: aizon-shared/gha-release-management/get-latest-tags@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          repositories: repository1,repository2,repository3
          owner: ${{ github.repository_owner }}
          branch: 'main'
...
```

## get-latest-matching-tag
Gets the latest tag matching the prefix input and outputs its name

### Inputs

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| token | Github token | true | |
| repository | Repository name | true | `${{github.event.repository.name}}` |
| owner | Owner of the repository | true | `${{github.repository_owner}}` |
| prefix | Prefix to match the tag against | false | |

### Outputs
| Name | Description |
| --- | --- |
| tag | Name of the latest tag matching the prefix input if any |

### Usage

```yaml
...

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - name: Get latest tag matxing the release version
        id: latest-matching-tag
        uses: aizon-shared/gha-release-management/get-latest-matching-tag@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          prefix: v2.
...
```

## jira-issues-query
Runs a query in Jira issues and run a filter upon the results if the filter is provided.

### Inputs

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| token | Jira auth token | true | |
| host | Jira host | true | |
| query | Query string to be run in Jira (JQL) | false | |
| fields | Fields to be returned by the query (separated by comma) | false | |
| filter | Filter function to be run upon the issues of the query (js filter) | false | |

### Outputs
| Name | Description |
| --- | --- |
| results | Final query results after applying the filter |

### Usage

```yaml
...

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - name: Check JIRA tickets pullrequests
        id: check-tickets-pullrequests
        uses: aizon-shared/gha-release-management/jira-issues-query@EX-179
        with:
          host: ${{ env.JIRA_HOST }}
          token: ${{ secrets.JIRA_API_TOKEN }}
          query: project = PROJECT_
          fields: key,self,customfield_10000
          filter: (i) => i.fields.customfield_10000.includes("dataType=pullrequest, state=MERGED")
...
```

## create-branches-from-tags
Takes a json where the keys are the repository names and the values are the tags to create branches from and creates a branch for each tag in the repository

### Inputs

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| token | Jira auth token | true | |
| repositories | JSON where the keys are the repository names and the values are the tags to create branches from | true | |
| branch | Name of the branch to create | true | |
| owner | Owner of the repositories | true | `${{github.repository_owner}}` |