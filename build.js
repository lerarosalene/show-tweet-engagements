const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');
const Header = require('userscript-header-format');

const fsp = fs.promises;

async function main() {
  const package = JSON.parse(await fsp.readFile('package.json', 'utf-8'));

  const header = Header.fromObject({
    name: "Show tweet Likes, Retweets and Quotes",
    namespace: "https://lerarosalene.github.io/",
    version: package.version,
    description: "Show tweet Likes, Retweets and Quotes",
    author: package.author,
    match: "*://*.twitter.com/*",
  });

  await esbuild.build({
    entryPoints: [path.join('src', 'index.tsx')],
    bundle: true,
    minify: false,
    outfile: path.join('dist', 'twitter-show-engagements.user.js'),
    banner: {
      js: header.toString() + "\n",
    }
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
