const {build, transform} = require('esbuild');

async function esbuildBuild() {
  try {
    await build({
      entryPoints: ['site/_ts/*.ts'],
      logLevel: 'info',
      minify: true,
      bundle: true,
      splitting: false,
      charset: 'utf8',
      legalComments: 'none',
      outdir: 'dist/es',
      platform: 'browser',
      format: 'iife',
      mangleProps: /_$/,
      treeShaking: true,
      sourcemap: false,
      sourcesContent: false,
      target: [
        'es2018',
        'chrome62',
        'edge79',
        'firefox78',
        'safari11',
      ],
    });
  }
  catch (err) {
    console.error('esbuildBuild Error: ', err);
  }
}

async function esbuildFilter(content) {
  try {
    const result = await transform(content, {
      logLevel: 'info',
      minify: true,
      charset: 'utf8',
      legalComments: 'none',
      platform: 'browser',
      format: 'iife',
      mangleProps: /_$/,
      treeShaking: true,
      sourcemap: false,
      sourcesContent: false,
      target: [
        'es2018',
        'chrome62',
        'edge79',
        'firefox78',
        'safari11',
      ]
    });

    return result.code;
  }
  catch (err) {
    console.error('esbuildTransform Error: ', err);
    return content;
  }
}

module.exports = {esbuildBuild, esbuildFilter};
