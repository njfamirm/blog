const postcss = require('postcss');
const postcssPresetEnv = require('postcss-preset-env');
const postcssImport = require('postcss-import');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss');
const postcssNesting = require('tailwindcss/nesting/index.js');
const {readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync} = require('fs');

const postCss = postcss([
  postcssImport({root: 'site/_css'}),
  postcssNesting,
  tailwindcss,
  postcssPresetEnv,
  cssnano({
    preset: [
      'default',
      {
        discardComments: {
          removeAll: true,
        },
      },
    ],
  }),
]);

function cleanupOutput(content) {
  return content.css.replaceAll('--tw-', '--alw-');
}

async function postcssBuild() {
  const inputDir = 'site/_css/';
  const outputDir = 'dist/css/';

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, {recursive: true});
  }

  const dirFileList = readdirSync(inputDir);

  for (const fileName of dirFileList) {
    if (!fileName.endsWith('.css')) {
      continue;
    }

    const inputFilePath = inputDir + fileName;
    const outputFilePath = outputDir + fileName;

    const fileContent = readFileSync(inputFilePath, 'utf8');
    const output = cleanupOutput(await postCss.process(fileContent));
    writeFileSync(outputFilePath, output, {encoding: 'utf8'});

    const fileSize = new Blob([output]).size / 1024;
    console.log(`⚡️ ${outputFilePath}\t${fileSize.toFixed(1)}kb`);
  }
}

async function postcssFilter(code) {
  return cleanupOutput(await postCss.process(fileContent));
}

module.exports = {postcssFilter, postcssBuild};
