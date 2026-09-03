export default function AppModeStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      /* ===== APP MODE: FULL MOBILE LAYOUT ===== */
      html, body {
        -webkit-text-size-adjust: 100%;
        touch-action: manipulation;
        overscroll-behavior-y: none;
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }
      body {
        padding-bottom: 0 !important;
        margin: 0 !important;
        width: 100% !important;
      }
      * {
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      
      /* Force all containers to full width */
      .container, [class*="max-w-"], [class*="max-w-7xl"], [class*="max-w-6xl"], 
      [class*="max-w-5xl"], [class*="max-w-4xl"], [class*="max-w-3xl"] {
        max-width: 100% !important;
        width: 100% !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
        margin: 0 !important;
      }

      /* Force grids to single column on mobile */
      .grid, [class*="grid-cols"] {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }
      [class*="md:grid-cols"], [class*="lg:grid-cols"], [class*="xl:grid-cols"] {
        grid-template-columns: 1fr !important;
      }
      
      /* Force 2-col grids to 1-col for property cards */
      [class*="grid-cols-2"], [class*="sm:grid-cols-2"], [class*="md:grid-cols-2"] {
        grid-template-columns: 1fr !important;
      }
      [class*="grid-cols-3"], [class*="sm:grid-cols-3"], [class*="md:grid-cols-3"],
      [class*="grid-cols-4"], [class*="sm:grid-cols-4"], [class*="md:grid-cols-4"] {
        grid-template-columns: 1fr !important;
      }

      /* Flex rows to columns */
      [class*="flex-row"], [class*="md:flex-row"], [class*="lg:flex-row"] {
        flex-direction: column !important;
      }
      
      /* Hide desktop-only elements */
      .lg\\:block, .lg\\:flex, .lg\\:inline, .lg\\:visible,
      .md\\:block, .md\\:flex, .md\\:inline, .md\\:visible,
      .hidden { display: none !important; }
      
      /* Force hidden-on-mobile elements to show */
      [class*="md:hidden"], [class*="lg:hidden"] {
        display: block !important;
      }

      /* Sidebar to stacked */
      aside, [class*="sidebar"], .sidebar {
        position: static !important;
        width: 100% !important;
        float: none !important;
        display: block !important;
      }

      /* Full-width cards */
      .card, [class*="rounded-lg"], [class*="rounded-xl"], [class*="rounded-2xl"] {
        width: 100% !important;
        border-radius: 12px !important;
      }

      /* Tables to scroll */
      table { 
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap !important;
        width: 100% !important;
      }

      /* Images full width */
      img {
        max-width: 100% !important;
        height: auto !important;
      }

      /* Tap highlight off */
      a, button, [role="button"] { 
        -webkit-tap-highlight-color: transparent;
        min-height: 44px;
      }

      /* Smooth scroll off for WebView performance */
      html { scroll-behavior: auto; }
      
      /* Force padding to be mobile-friendly */
      [class*="px-8"], [class*="px-10"], [class*="px-12"], [class*="px-16"],
      [class*="p-8"], [class*="p-10"], [class*="p-12"], [class*="p-16"] {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      [class*="py-12"], [class*="py-16"], [class*="py-20"] {
        padding-top: 24px !important;
        padding-bottom: 24px !important;
      }
      
      /* Bottom nav spacing */
      #app-bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
      }
      
      /* Hide footer always in app mode */
      footer { display: none !important; }
      
      /* Hide desktop navbar always in app mode */
      nav[class*="desktop"], nav[class*="navbar"] { display: none !important; }
    `}} />
  )
}
