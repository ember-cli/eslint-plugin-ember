# Release Instructions

This project is using [TravisCI](https://travis-ci.org/) to automatically
publish git tags to [npm](https://www.npmjs.com/).

Follow these steps to create a new release:

1) `yarn changelog` – generates the changelog for the new release

2) Add generated changelog to `CHANGELOG.md` and commit with
   `Update CHANGELOG` message 

3) `yarn version` – updates the `version` property in the `package.json`
   file and creates a new git commit and tag for the release

4) `git push upstream master --follow-tags` – pushes the release commit and
   tag to the `upstream` remote

5) Wait for TravisCI to finish the build, tests and deployment

Note that for `yarn version` to work properly the `version` field should not
be adjusted manually before the release.
