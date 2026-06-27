export default function AppModeStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      html, body {
        -webkit-text-size-adjust: 100%;
        touch-action: manipulation;
        overscroll-behavior-y: none;
      }
      /* Bottom safe area */
      body { padding-bottom: env(safe-area-inset-bottom, 16px); }
      /* Tap highlight off */
      a, button, [role="button"] { -webkit-tap-highlight-color: transparent; }
      /* Smooth scroll off for WebView performance */
      html { scroll-behavior: auto; }
    `}} />
  )
}
