// open/close navigation drawer
const menuButton = document.querySelector('.menu-button') as HTMLElement | null;
const bodyOverlay = document.querySelector('.body-overlay') as HTMLElement | null;
const navigationDrawer = document.querySelector('.navigation-drawer') as HTMLElement | null;

if (menuButton != null && bodyOverlay != null && navigationDrawer != null) {
  // prettier-ignore
  menuButton.addEventListener('click', function () {
    if (document.documentElement.dir === 'ltr') navigationDrawer.style.transform = 'translateX(0)';
    else navigationDrawer.style.transform = 'translateX(0)';

    bodyOverlay.style.display = 'block';
    bodyOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    bodyOverlay.addEventListener(
      'click',
      () => {
        if (document.documentElement.dir === 'ltr') navigationDrawer.style.transform = 'translateX(-100%)';
        else navigationDrawer.style.transform = 'translateX(100%)';

        bodyOverlay.style.display = 'none';
        bodyOverlay.style.backgroundColor = 'transparent';
      },
      {once: true},
    );
  });
}
