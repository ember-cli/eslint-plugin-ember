# Release Instructions

1. Check that notable PRs since the last release are labeled and have clear and consistent titles

2. `git pull` the latest master and ensure that `git status` shows no local changes

3. `export GITHUB_AUTH="..."` with a [GitHub access token](https://github.com/settings/tokens/new?scopes=repo&description=release-it) with "repo" access so [release-it](https://github.com/release-it/release-it) can conduct a GitHub release and [lerna-changelog](https://github.com/lerna/lerna-changelog) can download the change history

4. `export EDITOR="vim"` to choose an editor for editing the changelog

5. `yarn release` (uses [release-it-lerna-changelog](https://github.com/rwjblue/release-it-lerna-changelog) to handle versioning, the changelog, publishing to GitHub and NPM, etc)
