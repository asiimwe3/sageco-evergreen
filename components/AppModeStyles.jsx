export default function AppModeStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      html, body {
        -webkit-text-size-adjust: 100%;
        touch-action: manipulation;
        overscroll-behavior-y: none;
      }
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.05ms !important;
        scroll-behavior: auto !important;
      }
      /* Hero: compress padding in app mode */
      .app-hero-section { padding-top: 20px !important; padding-bottom: 20px !important; }
      /* Bottom safe area */
      body { padding-bottom: env(safe-area-inset-bottom, 16px) !important; }
      /* Tap highlight off */
      a, button, [role="button"] { -webkit-tap-highlight-color: transparent; }
      html { scroll-behavior: auto !important; }
    `}} />
  )
}
