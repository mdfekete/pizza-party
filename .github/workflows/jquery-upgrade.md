---
name: jQuery Upgrade
description: Checks daily for new jQuery 3.x releases and creates a PR to upgrade if a newer version is found.
on:
  schedule: daily
  skip-if-match: "is:pr is:open label:jquery"
permissions:
  contents: read
  pull-requests: read
  issues: read
tools:
  github:
    toolsets: [default]
  web-fetch:
  edit:
  bash: true
network:
  allowed:
    - releases.jquery.com
    - jquery.com
    - blog.jquery.com
    - node-cdns
    - github
safe-outputs:
  create-pull-request:
    title-prefix: "[jquery-upgrade] "
    labels: [dependencies, jquery]
    draft: false
    if-no-changes: ignore
---

# jQuery Upgrade Checker

You are an automated agent that checks whether there is a newer jQuery 3.x release than the version currently used in this repository, and if so, upgrades it and creates a pull request.

## Step 1: Detect Current jQuery Version

The current jQuery version is stored in `lib/jquery/jquery.slim.js`. Read the first few lines of that file to extract the version number from the comment header (e.g., `jQuery JavaScript Library v3.6.4`).

## Step 2: Find the Latest jQuery 3.x Release

Use the GitHub MCP server to list the releases from the `jquery/jquery` repository. Find the most recent release whose tag starts with `3.` (e.g., `3.7.1`). Ignore any release candidates or alpha/beta versions (tags containing `-rc`, `-beta`, `-alpha`).

Compare the latest stable 3.x version with the current version. If the current version is already up to date, stop here with a message: "jQuery is already up to date at version X.Y.Z."

## Step 3: Research the Upgrade

Fetch the release page for the new jQuery version at `https://github.com/jquery/jquery/releases/tag/<version>`. Look for:
- A link to a changelog or blog post (usually at `https://blog.jquery.com/` or `https://jquery.com/upgrade-guide/`)
- Breaking changes listed in the release notes
- Any deprecations or removed APIs

If a blog post URL is found, fetch it with the web-fetch tool to read the full changelog and breaking changes section.

## Step 4: Plan the Upgrade

Based on what you've read:
1. List the breaking changes from the current version to the new version.
2. Search the repository's HTML and JavaScript files for usage of any APIs that have been removed or changed in the new version. Use the bash tool to search with `grep` for patterns matching deprecated jQuery APIs (e.g., `.size()`, `$.type()`, `jQuery.isFunction()`, `$.parseJSON`, `.error()`, `.load()` event, `.bind()`, `.unbind()`, `.live()`, `.die()`, `.delegate()`, `.undelegate()`, etc.) in `index.html` and the `js/` directory.
3. Determine what code changes (if any) are needed in the project to be compatible with the new version.

## Step 5: Download the New jQuery Slim Files

The repository uses the jQuery slim build (without Ajax and effects), stored under `lib/jquery/`. Download the new jQuery slim files using `https://code.jquery.com/` as the CDN source:
- Download the following files:
  - `https://code.jquery.com/jquery-<version>.slim.js` → save to `lib/jquery/jquery.slim.js`
  - `https://code.jquery.com/jquery-<version>.slim.min.js` → save to `lib/jquery/jquery.slim.min.js`
  - `https://code.jquery.com/jquery-<version>.slim.min.map` → save to `lib/jquery/jquery.slim.min.map`

You can verify the file is available at `https://releases.jquery.com/jquery/` to see a list of all available jQuery versions and their CDN URLs.

Use the web-fetch tool to fetch each file's content, then use the edit tool to write the content to the appropriate file path (replacing the existing content).

## Step 6: Fix Breaking Changes

If you identified any breaking changes that affect code in this repository in Step 4, make the necessary code changes to `index.html` or files in the `js/` directory to ensure compatibility with the new jQuery version.

## Step 7: Create a Pull Request

Create a pull request with:
- **Title**: `Upgrade jQuery from <old-version> to <new-version>`
- **Body**: Include:
  - A summary of what changed (brief description of the new version)
  - A list of breaking changes from the changelog
  - Any code changes made in this repository to handle breaking changes
  - A link to the official release notes or blog post

Output the pull request using the `create-pull-request` safe output.