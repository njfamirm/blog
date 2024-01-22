import {logger} from './logger.js';

export function loadComments() {
  if (document.querySelector('.giscus') == null) return;
  logger.logMethod?.('loadComments');

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.dataset.repo = 'njfamirm/blog';
  script.dataset.repoId = 'R_kgDOKGE2Wg';
  script.dataset.category = 'Blog';
  script.dataset.categoryId = 'DIC_kwDOKGE2Ws4CZie1';
  script.dataset.mapping = 'title';
  script.dataset.strict = '0';
  script.dataset.reactionsEnabled = '1';
  script.dataset.emitMetadata = '0';
  script.dataset.inputPosition = 'top';
  script.dataset.theme = 'noborder_dark';
  script.dataset.lang = 'en';
  script.crossOrigin = 'anonymous';
  script.defer = true;
  script.async = true;
  document.body.appendChild(script);
}
