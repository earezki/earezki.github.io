// Global type declarations used to satisfy inline analytics snippets
// and other global script integrations.

// This file is intentionally a module to ensure project-wide inclusion.
// We augment the global scope using `declare global` so the inlined
// scripts in `.astro` files (which are checked by the TypeScript analyzer)
// will see these declarations.

declare global {
  interface Window {
    // The Google Analytics dataLayer is an array used by gtag
    dataLayer?: any[];
    // Optional gtag function attached to window
    gtag?: (...args: any[]) => void;
  }

  // Also declare global symbols sometimes referenced without `window.`
  var dataLayer: any[] | undefined;
  function gtag(...args: any[]): void;
}

export {};
