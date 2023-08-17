# gha-api-calls-utils
Defines the actions involved in the release process

- [gha-api-calls-utils](#gha-api-calls-utils)
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
    - [Usage](#usage-3)
  - [get-latest-check-run-status](#get-latest-check-run-status)
    - [Inputs](#inputs-4)
    - [Outputs](#outputs-3)
    - [Usage](#usage-4)

## get-latest-tags
Takes repository names separated by comma (,) and outputs a json with the latest tag of each repository if it exists in the latest commit of the branch. The key of the json is the repository name and the value is the latest tag.

### Inputs

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| token | Github token | true | |
| repositories | Repository names separated by comma (,) | false | |
| owner | Owner of the repositories | false | `${{github.repository_owner}}` |
| branch | Branch to check for tags | false | main |

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
      - name: Step 1
        id: step1
        uses: aizon-shared/gha-api-calls-utils/get-latest-tags@v1
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
| repository | Repository name | false | `${{github.event.repository.name}}` |
| owner | Owner of the repository | false | `${{github.repository_owner}}` |
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
      - name: Step 1
        id: step1
        uses: aizon-shared/gha-api-calls-utils/get-latest-matching-tag@v1
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
| query | Query string to be run in Jira (JQL) | true | |
| fields | Fields to be returned by the query (separated by comma) | true | |
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
      - name: Step 1
        id: step1
        uses: aizon-shared/gha-api-calls-utils/jira-issues-query@v1
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
| owner | Owner of the repositories | false | `${{github.repository_owner}}` |

### Usage

```yaml
...
- name: Step 1
  id: step1
  uses: aizon-shared/gha-api-calls-utils/create-branches-from-tags@v1
  with:
    token: ${{ steps.get-token.outputs.token }}
    repositories: {"repo1":"v1.0.0", "repo2":"v1.0.1"}
    branch: ${{ env.BRANCH_NAME }}
...
```

## get-latest-check-run-status
Gets the latest check run status for the last commit that have a check run with the given name. If no check run name is given, it will get the latest check run status found (not in the last commit necessarily).

### Inputs

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| token | Jira auth token | true | |
| name | Name of the check run to get the status from | false | |
| branch | Name of the branch to get the check run status from | true | |
| owner | Owner of the repositories | false | `${{github.repository_owner}}` |
| repositories | Repository names separated by comma (,) | true | |

### Outputs
| Name | Description |
| --- | --- |
| runs | JSON with the repository as key and an array with jsons containing the name, status, conclusion, commit sha and url of the check runs found as value | 

### Usage

```yaml
...
- name: Step 1
  id: step1
  uses: aizon-shared/gha-api-calls-utils/get-latest-check-run-status@v1
  with:
    token: ${{ steps.get-token.outputs.token }}
    branch: ${{ env.BRANCH_NAME }}
    repositories: repo1,repo2,repo3
...
```