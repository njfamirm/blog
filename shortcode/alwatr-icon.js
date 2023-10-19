const {readFile} = require('node:fs/promises');

async function alwatrIcon(iconName, customClass = '') {
  let icon;

  try {
    icon = await readFile(`node_modules/@alwatr/icon-set-material/svg/outline/${iconName}.svg`, 'utf8');
  }
  catch {
    const err = new Error(`alwatrIcon, icon not found: ${iconName}`);

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
