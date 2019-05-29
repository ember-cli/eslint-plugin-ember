# Release Instructions

Follow these steps to create a new release:

1) Check that notable PRs since the last release are labeled and have clear and consistent titles

2) `git pull` the latest master and ensure that `git status` shows no local changes

3) `lerna-changelog` – generates the changelog for the new release

4) Add the generated changelog to `CHANGELOG.md` (with a new version number)

5) `git commit -am "Update CHANGELOG"`

6) `yarn version` – updates the `version` property in the `package.json` file and creates a new git commit and tag for the release (note: do not update the version manually prior to running this command)

7) `git push upstream master --follow-tags` – pushes the release commit and tag to the `upstream` remote

8) Use GitHub to [publish](https://github.com/ember-cli/eslint-plugin-ember/releases/new) a new release for the pushed tag using the generated changelog (without the changelog title) as the description

9) `npm pack`

10) `npm publish`
