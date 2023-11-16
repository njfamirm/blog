const {readFile} = require('node:fs/promises');

async function alwatrIcon(icon, customClass = '') {
  if (icon.indexOf('/') === -1) {
    icon = 'material/' + icon;
  }

  if (icon.indexOf(':') === -1) {
    icon = icon + ':main';
  }

  // icon = material/home:main
  const [iconPack, iconExtra] = icon.split('/');
  const [iconName, iconType] = iconExtra.replaceAll('_', '-').split(':');

  const path = `node_modules/@alwatr/icon-set-${iconPack}/svg/${iconType}/${iconName}.svg`;

  try {
    icon = await readFile(path, 'utf8');
  }
  catch {
    const err = new Error(`alwatrIcon, icon not found: ${icon, path}`);

    if (process.env.NODE_ENV === 'production') {
      throw err;
    }

    console.error(err);
    icon = 'N!';
  }

  // eslint-disable-next-line max-len
  return `<div class="h-[1em] w-[1em] box-content align-middle self-center grow-0 shrink-0 [contain:size_layout_paint_style] [&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current ${customClass}">${icon}</div>`;
}

module.exports = {alwatrIcon};
