# SAGECO EVERGREEN — Conversion Tracking Setup

## Google Ads Conversion Tracking

### 1. Google Tag Manager (GTM) Setup
```html
<!-- Add to pages/_app.js <Head> section -->
{process.env.NEXT_PUBLIC_GTM_ID && (
  <script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', process.env.NEXT_PUBLIC_GTM_ID);
  </script>
)}
```

### 2. Key Conversion Events to Track
- **property_view** — When user views a property detail page
- **booking_initiated** — When user starts booking flow (/book)
- **payment_success** — When PesaPal payment completes (/payment-success)
- **broker_registration** — When broker pays registration fee
- **whatsapp_click** — When user clicks WhatsApp button
- **contact_form** — When contact form is submitted
- **gps_tool_used** — When user uses GPS measuring tool
- **valuation_requested** — When user requests a valuation

### 3. Google Analytics 4 (GA4) Setup
```html
<!-- Add to pages/_app.js <Head> section -->
{process.env.NEXT_PUBLIC_GA4_ID && (
  <>
    <script async src={'https://www.googletagmanager.com/gtag/js?id=' + process.env.NEXT_PUBLIC_GA4_ID}></script>
    <script dangerouslySetInnerHTML={{ __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', {
        page_path: window.location.pathname,
      });
    `}} />
  </>
)}
```

### 4. Environment Variables Needed
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager container ID (e.g., GTM-XXXXXXX)
- `NEXT_PUBLIC_GA4_ID` — Google Analytics 4 measurement ID (e.g., G-XXXXXXXXXX)
- `NEXT_PUBLIC_FB_PIXEL_ID` — Meta/Facebook Pixel ID (e.g., 123456789012345)
- `GOOGLE_SITE_VERIFICATION` — Google Search Console verification code
- `BING_SITE_VERIFICATION` — Bing Webmaster verification code

## Facebook Pixel Setup
```html
<!-- Add to pages/_app.js <Head> section -->
{process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
  <>
    <script dangerouslySetInnerHTML={{ __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', process.env.NEXT_PUBLIC_FB_PIXEL_ID);
      fbq('track', 'PageView');
    `}} />
  </>
)}
```

## Conversion Actions in Google Ads
1. **Property Booking** — Category: Purchase, Value: UGX 30,000
2. **Broker Registration** — Category: Purchase, Value: UGX 32,000
3. **Contact Form** — Category: Lead, Value: UGX 0
4. **WhatsApp Click** — Category: Contact, Value: UGX 0
5. **Property View** — Category: Engagement, Value: UGX 0

## Phone Call Tracking
Use Google's call extensions:
- Phone: +256750414366
- Call-only ad campaign option for mobile users
