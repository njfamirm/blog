// import {tailwindConfig} from '@alwatr/style';

import {colorTheme} from '@alwatr/style/lib/colors.js';
import {elevationPlugin} from '@alwatr/style/lib/elevation.js';
import {screenTheme} from '@alwatr/style/lib/screen.js';
import {stateLayerPlugin} from '@alwatr/style/lib/state-layer.js';
import {typographyTheme} from '@alwatr/style/lib/typography.js';
import {zIndexTheme} from '@alwatr/style/lib/z-index.js';

const config = {
  content: ['**/*.njk'],
  darkMode: 'media',
  theme: {
    extend: {
      ...colorTheme,
      ...typographyTheme,
      ...zIndexTheme,
      ...screenTheme,
    },
  },
  plugins: [elevationPlugin, stateLayerPlugin],
};

// const config = {
//   ...tailwindConfig,
//   content: ['**/*.njk'],
// };

export default config;
