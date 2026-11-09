// All content remains visible in the HTML. Animation starts only on viewport entry.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const selector = [
    '.section-heading',
    '.ecosystem-image',
    '.journey-labels',
    '.recovery-section > div',
    '.lia-layout > div',
    '.lia-showcase',
    '.adoption-campaign',
    '.unlimited-patients',
    '.enterprise-card',
    '.care-grid > article',
    '.price-card',
    '.connect-strip',
    '.booking-heading',
    '.lia-action-copy',
    '.lia-action-demo',
    '.customer-story-heading',
    '.customer-identity',
    '.customer-quote-card',
    '.customer-benefits > article',
    '.customer-case-section',
    '.customer-case-final',
    '.customer-case-cta',
    '.feature-section',
  ].join(',');
  const tracked = new Set();
  const animations = new Set();
  let stopped = false;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      tracked.delete(element);
      if (stopped || !element.isConnected || typeof element.animate !== 'function') continue;
      const animation = element.animate(
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 820, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
      );
      animations.add(animation);
      animation.finished.then(
        () => animations.delete(animation),
        () => animations.delete(animation),
      );
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  function observeContent() {
    for (const element of tracked) {
      if (!element.isConnected) {
        observer.unobserve(element);
        tracked.delete(element);
      }
    }
    for (const element of document.querySelectorAll(selector)) {
      // Animate one container at a time to avoid stacking parent and child fades.
      if (element.parentElement?.closest(selector)) continue;
      if (tracked.has(element) || element.dataset.fadeObserved) continue;
      element.dataset.fadeObserved = 'true';
      tracked.add(element);
      observer.observe(element);
    }
  }

  observeContent();
  const root = document.getElementById('root');
  const mountObserver = root ? new MutationObserver(observeContent) : null;
  // React replaces only the root's direct child during its initial mount.
  mountObserver?.observe(root, { childList: true });

  motionPreference.addEventListener('change', event => {
    if (!event.matches) return;
    stopped = true;
    observer.disconnect();
    mountObserver?.disconnect();
    tracked.clear();
    for (const animation of animations) animation.cancel();
    animations.clear();
  });
}
