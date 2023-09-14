set -ex

npm ci
npm run tsc
npm run build

VERSION=$(cat package.json | jq .version -r)
gh release create "v${VERSION}" dist/show-tweet-engagements.user.js --notes "release v${VERSION}"
