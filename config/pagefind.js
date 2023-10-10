async function indexContent() {
  const currentTime = new Date();
  const {createIndex, close} = await import('pagefind');
  const {index} = await createIndex();
  await index.addDirectory({path: 'dist'});
  await index.writeFiles({outputPath: 'dist/pagefind'});
  await close();

  console.log(`\n⚡️ indexContent done in ${new Date() - currentTime}ms\n` )
}

module.exports = {indexContent};
