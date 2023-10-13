async function indexContent() {
  if (process.env.NODE_ENV !== 'production') return;
  const currentTime = new Date();
  const {createIndex, close} = await import('pagefind');
  const {index} = await createIndex();
  await index.addDirectory({path: 'dist'});
  await index.writeFiles({outputPath: 'dist/pagefind'});
  await close();

  console.log(`\n⚡️ indexContent done in ${new Date() - currentTime}ms\n`);
}

module.exports = {indexContent};
