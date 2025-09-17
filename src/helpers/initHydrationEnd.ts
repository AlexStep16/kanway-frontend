export default function initHydrationEnd() {
  const loader = document.getElementById('globalLoader');
  if (loader) {
    setTimeout(() => {
      loader.classList.remove('block-loader_show');
    }, 1000);
  }
}

export function initHydrationEndNoDelay() {
  const loader = document.getElementById('globalLoader');
  if (loader) {
    loader.classList.remove('block-loader_show');
  }
}