import {PagefindUI} from '@pagefind/default-ui';

new PagefindUI({
  element: '#search',
  baseUrl: '/',
  showSubResults: true,
  showImages: false,
  debounceTimeoutMs: 250,
  translations: {
    placeholder: 'Search',
    zero_results: 'No result found...',
  },
});

const input = document.querySelector('.pagefind-ui__search-input') as HTMLInputElement;

input.addEventListener('input', () => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('query', input.value);
  window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
});

const searchParams = new URLSearchParams(window.location.search);
input.value = searchParams.get('query') || '';

// Trigger an input event on the input field
const inputEvent = new Event('input', {bubbles: true});
input.dispatchEvent(inputEvent);
