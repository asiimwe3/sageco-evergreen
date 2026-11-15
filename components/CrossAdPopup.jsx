// DeryCode cross-promotion popup: randomly advertises one network site
// (custom-domain sites only), never the site the visitor is on.
// Photo + small text. Shows after 6s, dismissible, remembered 3 days.
import { useEffect } from "react";

const SITES = [
  { n: "Tropical Gardens Hotel", t: "Rooms, restaurant & wedding gardens, Kyenjojo", u: "https://tropicalgardenshotelkyenjojo.com", i: "https://tropicalgardenshotelkyenjojo.com/assets/hero/slide3_gate.jpg" },
  { n: "Steady Company (U) Ltd", t: "Phones & electronics dealer, Fort Portal", u: "https://steadycompanyltd.com", i: "https://media.base44.com/images/public/69f8f20192eecc9587b7eca6/56a6adb90_generated_image.png" },
  { n: "Bagu Legacy Homes", t: "Comfortable homestays, Fort Portal", u: "https://bagulegacyhomes.online", i: "https://bagulegacyhomes.online/images/g01.jpg" },
  { n: "DeryCode Technologies", t: "Software, AI & blockchain company, Uganda", u: "https://derycode.online", i: "https://derycode.online/favicon.png" },
  { n: "Peters Medicare Services", t: "Quality, affordable clinic in Kyenjojo", u: "https://petersmedicare.online", i: "https://petersmedicare.online/assets/gal-compound-aerial-BKe9V-oH.webp" },
  { n: "DeryCode Spin & Win", t: "Pay UGX 2,000, spin & win up to UGX 1M instantly", u: "https://derycode-spin-win.vercel.app", i: "https://derycode-spin-win.vercel.app/assets/logo.png" },
];

export default function CrossAdPopup() {
  useEffect(() => {
    try {
      const hide = localStorage.getItem("dcx_hide_until");
      const force = window.location.search.indexOf('showad') > -1; const hu = hide ? parseInt(hide) : 0; if (!force && hu && Date.now() < hu && hu - Date.now() < 90000000) return;
      const sites = SITES.filter((s) => !s.u.includes(window.location.hostname));
      if (!sites.length) return;
      const s = sites[Math.floor(Math.random() * sites.length)];

      const wrap = document.createElement("div");
      wrap.id = "dcx-popup";
      wrap.style.cssText = "display:none;position:fixed;bottom:18px;right:16px;z-index:99999;max-width:260px;width:calc(100% - 32px);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";
      wrap.innerHTML = `
<div style="position:relative;background:#0b1220;color:#fff;border:1px solid #22314e;border-radius:14px;overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,.35)">
<button id="dcx-close" aria-label="Close" style="position:absolute;top:6px;right:6px;background:rgba(11,18,32,.75);border:none;color:#fff;font-size:14px;line-height:1;cursor:pointer;padding:5px 7px;border-radius:8px">&times;</button>
<img src="${s.i}" alt="${s.n}" style="display:block;width:100%;height:78px;object-fit:cover">
<div style="padding:10px 12px 12px">
<div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#00d4ff;margin:0 0 2px">You may also like</div>
<div style="font-size:13px;font-weight:700;margin:0 0 2px;line-height:1.3">${s.n}</div>
<div style="font-size:11px;color:#aab7cc;line-height:1.4;margin:0 0 9px">${s.t}</div>
<a href="${s.u}" target="_blank" rel="noopener" style="display:block;background:#0a84ff;color:#fff;text-align:center;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:700;text-decoration:none">Visit Website</a>
<div style="margin-top:7px;font-size:10px;color:#66788f;text-align:center">Ads by DeryCode Technologies</div>
</div>
</div>`;

      const close = wrap.querySelector("#dcx-close");
      close.onclick = () => {
        wrap.style.display = "none";
        localStorage.setItem("dcx_hide_until", String(Date.now() + 1 * 24 * 3600 * 1000));
      };
      document.body.appendChild(wrap);
      const t = setTimeout(() => { wrap.style.display = "block"; }, 6000);
      return () => { clearTimeout(t); wrap.remove(); };
    } catch (e) {}
  }, []);
  return null;
}
