const {existsSync} = require('node:fs');
const {readFile, writeFile, mkdir, readdir} = require('node:fs/promises');

const cssnano = require('cssnano');
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');
const postcssNesting = require('tailwindcss/nesting/index.js');

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
    await mkdir(outputDir, {recursive: true});
  }

  const dirFileList = await readdir(inputDir);

  for (const fileName of dirFileList) {
    if (!fileName.endsWith('.css')) {
      continue;
    }

    const inputFilePath = inputDir + fileName;
    const outputFilePath = outputDir + fileName;

    const fileContent = await readFile(inputFilePath, 'utf8');
    const output = cleanupOutput(await postCss.process(fileContent, {from: inputFilePath, to: outputFilePath}));
    await writeFile(outputFilePath, output, {encoding: 'utf8'});

    const fileSize = new Blob([output]).size / 1024;
    console.log(`⚡️ ${outputFilePath}\t${fileSize.toFixed(1)}kb`);
  }
}

async function postcssFilter(code) {
  return cleanupOutput(await postCss.process(code));
}

module.exports = {postcssFilter, postcssBuild};
