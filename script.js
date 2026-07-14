const UL = (id) => `Products/SKU-${String(id).padStart(4,'0')}.jpg`;

(async function checkSiteStatus() {
  try {
    const SB_URL_CHK = 'https://sinzmodmefkyjkzzitjy.supabase.co';
    const SB_KEY_CHK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbnptb2RtZWZreWprenppdGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjQ4MzYsImV4cCI6MjA5NTcwMDgzNn0.Ft88pQEKbSVP_yb7UTRVq2fLa_TScR97_jvJmgAMlSc';
    const res = await fetch(SB_URL_CHK + '/rest/v1/capslock_settings?key=eq.site_disabled&select=value', {
      headers: { 'apikey': SB_KEY_CHK, 'Authorization': 'Bearer ' + SB_KEY_CHK }
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.length && data[0].value === 'true') {
      const overlay = document.createElement('div');
      overlay.id = 'siteClosedOverlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:#0c1a2e;z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:Inter,sans-serif;';
      overlay.innerHTML = `
        <div style="text-align:center;padding:40px 24px;max-width:460px">
          <div style="font-size:64px;margin-bottom:20px">🚧</div>
          <div style="font-size:26px;font-weight:900;color:#fff;margin-bottom:10px">Site Temporarily Closed</div>
          <div style="font-size:15px;color:rgba(255,255,255,0.55);margin-bottom:28px;line-height:1.7">
            We are currently performing maintenance.<br>We'll be back shortly. Thank you for your patience.
          </div>
          <div style="font-size:15px;font-weight:800;color:#c8151b;line-height:1.3">CAPSLOCK COMPUTERS</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.3);margin-top:6px;">Kuwait — Laptop Repairing Center</div>
        </div>`;
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
    }
  } catch(e) {}
})();

// ── SEO SETTINGS (editable in admin → SEO tab) ────────────────────────────
// Overrides the title/description/keywords/OG tags baked into index.html for
// crawlers that don't run JS — lets the owner edit them from admin without
// touching code or redeploying. Runs standalone (own SB constants) since it
// executes before the module-level SB_URL/SB_KEY consts below are initialized.
(async function applySEOSettings() {
  try {
    const SB_URL_SEO = 'https://sinzmodmefkyjkzzitjy.supabase.co';
    const SB_KEY_SEO = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbnptb2RtZWZreWprenppdGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjQ4MzYsImV4cCI6MjA5NTcwMDgzNn0.Ft88pQEKbSVP_yb7UTRVq2fLa_TScR97_jvJmgAMlSc';
    const res = await fetch(SB_URL_SEO + '/rest/v1/capslock_settings?key=eq.seo_settings&select=value', {
      headers: { 'apikey': SB_KEY_SEO, 'Authorization': 'Bearer ' + SB_KEY_SEO }
    });
    if (!res.ok) return;
    const data = await res.json();
    if (!data || !data.length || !data[0].value) return;
    const seo = JSON.parse(data[0].value);
    if (seo.title) {
      document.title = seo.title;
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (ogTitle) ogTitle.setAttribute('content', seo.title);
      if (twTitle) twTitle.setAttribute('content', seo.title);
    }
    if (seo.description) {
      const desc   = document.querySelector('meta[name="description"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (desc)   desc.setAttribute('content', seo.description);
      if (ogDesc) ogDesc.setAttribute('content', seo.description);
      if (twDesc) twDesc.setAttribute('content', seo.description);
    }
    if (seo.keywords) {
      const kw = document.querySelector('meta[name="keywords"]');
      if (kw) kw.setAttribute('content', seo.keywords);
    }
  } catch(e) { /* Network error — static meta tags in index.html remain as fallback */ }
})();

function getProductSku(id) {
  try {
    var map = JSON.parse(localStorage.getItem('capslock_sku_map') || '{}');
    var val = map[String(id)];
    return 'SKU-' + String(val !== undefined ? val : id).padStart(4, '0');
  } catch(e) { return 'SKU-' + String(id).padStart(4, '0'); }
}

const SB_URL = 'https://sinzmodmefkyjkzzitjy.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbnptb2RtZWZreWprenppdGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjQ4MzYsImV4cCI6MjA5NTcwMDgzNn0.Ft88pQEKbSVP_yb7UTRVq2fLa_TScR97_jvJmgAMlSc';
const SB_H = { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY };

async function sbFetch(url, options) {
  try {
    options = options || {};
    // Always fetch fresh — never serve a cached order/stock response
    options.cache = 'no-store';
    options.headers = Object.assign({}, options.headers || {}, { 'Cache-Control':'no-cache', 'Pragma':'no-cache' });
    const res  = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { data: null, error: (data && (data.error || data.message)) || ('HTTP ' + res.status) };
    return { data, error: null };
  } catch (e) { return { data: null, error: e.message }; }
}

let _sbStock    = {};
let _sbPhotos   = {};
let _customProds = [];
let _hiddenIds   = new Set();
// Per-product SEO overrides (description + keywords) set in admin → SEO tab.
// Keyed by product id, e.g. { "12": { desc: "...", keywords: "a, b, c" } }.
let _sbProductSEO = {};
// Homepage featured strip — ordered array of { id, sale } set in
// admin → Featured tab. sale (0-95) discounts the price only in the strip.
let _sbFeatured = [];

async function loadSBData() {
  const [s, p, c, h, seo, fo] = await Promise.all([
    sbFetch(SB_URL + '/rest/v1/capslock_stock?select=*',           { headers: SB_H }),
    sbFetch(SB_URL + '/rest/v1/capslock_photos?select=*',          { headers: SB_H }),
    sbFetch(SB_URL + '/rest/v1/capslock_products?select=*',        { headers: SB_H }),
    sbFetch(SB_URL + '/rest/v1/capslock_hidden?select=product_id', { headers: SB_H }),
    sbFetch(SB_URL + '/rest/v1/capslock_settings?key=eq.product_seo&select=value', { headers: SB_H }),
    sbFetch(SB_URL + '/rest/v1/capslock_settings?key=eq.featured_offers&select=value', { headers: SB_H })
  ]);
  if (s.error) {
    try { _sbStock  = JSON.parse(localStorage.getItem('capslock_stock')  || '{}'); } catch(_) {}
    try { _sbPhotos = JSON.parse(localStorage.getItem('capslock_photos') || '{}'); } catch(_) {}
  } else {
    if (Array.isArray(s.data)) s.data.forEach(r => { _sbStock[r.product_id]  = r.qty; });
    if (Array.isArray(p.data)) p.data.forEach(r => { _sbPhotos[r.product_id] = r.url; });
    if (Array.isArray(c.data) && c.data.length > 0) _customProds = c.data.filter(r => !r.hidden);
    if (Array.isArray(h.data)) {
      var hidSet = new Set(h.data.map(r => r.product_id));
      if (hidSet.size < 55) _hiddenIds = hidSet;
    }
  }
  if (!seo.error && Array.isArray(seo.data) && seo.data[0] && seo.data[0].value) {
    try { _sbProductSEO = JSON.parse(seo.data[0].value); } catch(_) {}
  }
  if (!fo.error && Array.isArray(fo.data) && fo.data[0] && fo.data[0].value) {
    try {
      var raw = JSON.parse(fo.data[0].value) || [];
      _sbFeatured = raw.map(x => (typeof x === 'number') ? { id: x, sale: 0 } : { id: x.id, sale: x.sale || 0 });
    } catch(_) {}
  }
  renderProducts();
  initFeaturedTicker();
  _injectProductSchema();
}

function normalizeCategory(raw) {
  const c = (raw || '').toLowerCase().replace(/[\s_]+/g, '-').trim();
  return c;
}

function getAllProducts() {
  const baseIds = new Set(PRODUCTS.map(p => p.id));
  const base  = PRODUCTS.filter(p => !_hiddenIds.has(p.id)).map(p => {
    const seo = _sbProductSEO[p.id];
    return (seo && (seo.desc || seo.keywords)) ? Object.assign({}, p, { desc: seo.desc || p.desc, keywords: seo.keywords || '' }) : p;
  });
  const extra = _customProds.filter(p => !baseIds.has(p.id) && p.id > 60).map(p => {
    const seo = _sbProductSEO[p.id] || {};
    return {
      id: p.id, name: p.name, category: normalizeCategory(p.category),
      price: parseFloat(p.price), img: p.img_url || p.img || `https://picsum.photos/seed/pc${p.id}/420/320`,
      desc: seo.desc || p.description || p.desc || '', keywords: seo.keywords || '', badge: p.badge || null, stock: 'in-stock'
    };
  });
  return [...base, ...extra];
}

// ── PRODUCT STRUCTURED DATA ───────────────────────────────────────────────
// Injects/updates a Product ItemList JSON-LD block so Google can understand
// and potentially show rich results for the actual catalog — rebuilt from
// the real live product data each time it loads (see loadSBData) rather than
// a static, easily-stale snapshot.
function _injectProductSchema() {
  const products = getAllProducts();
  if (!products.length) return;
  // Offer prices are always current (fetched live from Supabase), so a
  // far-future validity date is the standard convention for a perpetual
  // catalog rather than a real expiry — set once per page load.
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': products.map(function(p, i) {
      const photo = (_sbPhotos[p.id] && (_sbPhotos[p.id].startsWith('http') || _sbPhotos[p.id].startsWith('data:'))) ? _sbPhotos[p.id] : p.img;
      const liveStatus = getLiveStock(p.id) || p.stock;
      return {
        '@type': 'ListItem',
        'position': i + 1,
        'item': {
          '@type': 'Product',
          'name': p.name,
          'description': p.desc || undefined,
          'sku': getProductSku(p.id).replace(/^SKU[-:]\s*/, ''),
          'category': p.category,
          'keywords': p.keywords || undefined,
          'image': (photo && photo.startsWith('http')) ? photo : undefined,
          'offers': {
            '@type': 'Offer',
            'priceCurrency': 'KWD',
            'price': p.price,
            'priceValidUntil': priceValidUntil,
            'itemCondition': 'https://schema.org/NewCondition',
            'availability': liveStatus === 'out-of-stock' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'
          }
        }
      };
    })
  };
  let tag = document.getElementById('productListSchema');
  if (!tag) {
    tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.id = 'productListSchema';
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(itemList);
}

const PRODUCTS = [
  // ── GPU (1-10) ───────────────────────────────────────────────────────────────
  { id:1,  name:'ASUS Dual RTX 5060 Ti OC 8GB',              category:'gpu',          price:150.000, img:UL(1),  desc:'8GB GDDR7, 2.65GHz boost, PCIe 5.0, DLSS 4 Multi-Frame Gen, perfect 1080p/1440p gaming card.', badge:'Popular', stock:'in-stock' },
  { id:2,  name:'MSI RTX 5060 Ti Gaming Trio OC 16GB',       category:'gpu',          price:175.000, img:UL(2),  desc:'16GB GDDR7, 2.72GHz boost, Tri Frozr 4 cooling, DLSS 4 — extra VRAM for heavy 1440p titles.', badge:'Best Seller', stock:'in-stock' },
  { id:3,  name:'Gigabyte RTX 5070 WindForce OC 12GB',       category:'gpu',          price:215.000, img:UL(3),  desc:'12GB GDDR7, 2.6GHz boost, triple WindForce fans, DLSS 4, excellent 1440p performance.', badge:null, stock:'in-stock' },
  { id:4,  name:'ASUS TUF Gaming RTX 5070 Ti OC 16GB',       category:'gpu',          price:310.000, img:UL(4),  desc:'16GB GDDR7, 2.85GHz boost, military-grade TUF build, DLSS 4 — strong 4K entry point.', badge:'New', stock:'in-stock' },
  { id:5,  name:'MSI RTX 5080 Gaming Trio OC 16GB',          category:'gpu',          price:435.000, img:UL(5),  desc:'16GB GDDR7, 2.78GHz boost, Tri Frozr 4 cooling, flagship-class 4K gaming with DLSS 4.', badge:null, stock:'in-stock' },
  { id:6,  name:'ZOTAC RTX 5090 Solid OC 32GB',              category:'gpu',          price:950.000, img:UL(6),  desc:'32GB GDDR7, 2.69GHz boost, IceStorm 3.0 cooling — the fastest consumer GPU on the planet.', badge:'🔥 Flagship', stock:'in-stock' },
  { id:7,  name:'Sapphire Pulse RX 9060 XT 16GB',            category:'gpu',          price:185.000, img:UL(7),  desc:'16GB GDDR6, 3.13GHz boost, RDNA 4, FSR 4 — unbeatable value 1440p AMD card.', badge:'Best Value', stock:'in-stock' },
  { id:8,  name:'XFX Swift RX 9070 16GB',                    category:'gpu',          price:265.000, img:UL(8),  desc:'16GB GDDR6, 2.97GHz boost, RDNA 4, FSR 4 AI upscaling — smooth 1440p and entry 4K.', badge:null, stock:'in-stock' },
  { id:9,  name:'Sapphire Nitro+ RX 9070 XT 16GB',          category:'gpu',          price:310.000, img:UL(9),  desc:'16GB GDDR6, 3.06GHz boost, premium Nitro+ cooling, RDNA 4 flagship — rivals RTX 5070 Ti.', badge:'Popular', stock:'in-stock' },
  { id:10, name:'PowerColor Red Devil RX 9070 XT 16GB',     category:'gpu',          price:325.000, img:UL(10), desc:'16GB GDDR6, 3.1GHz boost, Red Devil triple-fan OC design — top-binned RDNA 4 silicon.', badge:null, stock:'in-stock' },
  // ── CPU (11-20) ──────────────────────────────────────────────────────────────
  { id:11, name:'Intel Core i9-14900K',                      category:'cpu',          price:195.000, img:UL(11), desc:'24-core (8P+16E), 6.0GHz max turbo, LGA1700, 36MB cache, DDR5 support — flagship Intel desktop CPU.', badge:'Best Seller', stock:'in-stock' },
  { id:12, name:'Intel Core i9-14900KF',                     category:'cpu',          price:180.000, img:UL(12), desc:'24-core (8P+16E), 6.0GHz max turbo, LGA1700, no iGPU — same performance, lower price.', badge:null, stock:'in-stock' },
  { id:13, name:'Intel Core i7-14700K',                      category:'cpu',          price:154.000, img:UL(13), desc:'20-core (8P+12E), 5.6GHz max turbo, LGA1700, 33MB cache — best mid-high gaming CPU.', badge:'Popular', stock:'in-stock' },
  { id:14, name:'Intel Core i7-14700KF',                     category:'cpu',          price:145.000, img:UL(14), desc:'20-core (8P+12E), 5.6GHz max turbo, LGA1700, no iGPU — killer value for gaming builds.', badge:null, stock:'in-stock' },
  { id:15, name:'Intel Core i5-14600K',                      category:'cpu',          price:110.000, img:UL(15), desc:'14-core (6P+8E), 5.3GHz max turbo, LGA1700, 24MB cache — best gaming CPU per KWD.', badge:'Popular', stock:'in-stock' },
  { id:16, name:'AMD Ryzen 9 7950X3D',                       category:'cpu',          price:310.000, img:UL(16), desc:'16-core/32-thread, 5.7GHz boost, AM5, 128MB 3D V-Cache — fastest gaming CPU available.', badge:'Best Seller', stock:'in-stock' },
  { id:17, name:'AMD Ryzen 9 7950X',                         category:'cpu',          price:240.000, img:UL(17), desc:'16-core/32-thread, 5.7GHz boost, AM5, 64MB L3 cache, 170W — creator/workstation powerhouse.', badge:null, stock:'in-stock' },
  { id:18, name:'AMD Ryzen 9 7900X',                         category:'cpu',          price:122.000, img:UL(18), desc:'12-core/24-thread, 5.6GHz boost, AM5, 64MB L3 — great balance of gaming and productivity.', badge:null, stock:'in-stock' },
  { id:19, name:'AMD Ryzen 7 7700X',                         category:'cpu',          price:95.000,  img:UL(19), desc:'8-core/16-thread, 5.4GHz boost, AM5, 32MB L3, 105W TDP — strong mid-range gaming CPU.', badge:'Popular', stock:'in-stock' },
  { id:20, name:'AMD Ryzen 5 7600X',                         category:'cpu',          price:71.000,  img:UL(20), desc:'6-core/12-thread, 5.3GHz boost, AM5, 32MB L3 — best budget AM5 CPU for gaming.', badge:null, stock:'in-stock' },
  // ── MOTHERBOARDS (21-30) ─────────────────────────────────────────────────────
  { id:21, name:'ASUS ROG Maximus Z790 Hero',                category:'motherboards', price:214.000, img:UL(21), desc:'ATX, LGA1700, DDR5, PCIe 5.0, WiFi 6E, BT 5.3, 5x M.2 slots, 2.5GbE — premium Intel Z790.', badge:'Popular', stock:'in-stock' },
  { id:22, name:'ASUS ROG Maximus Z790 Extreme',             category:'motherboards', price:370.000, img:UL(22), desc:'ATX, LGA1700, DDR5, PCIe 5.0, WiFi 6E, dual Thunderbolt 4, 10GbE — absolute flagship board.', badge:null, stock:'in-stock' },
  { id:23, name:'ASUS ROG Maximus Z790 Dark Hero WiFi 7',    category:'motherboards', price:285.000, img:UL(23), desc:'ATX, LGA1700, DDR5, WiFi 7, PCIe 5.0, 5x M.2, premium 20+1 power stages.', badge:'New', stock:'in-stock' },
  { id:24, name:'MSI MEG Z790 Godlike',                      category:'motherboards', price:430.000, img:UL(24), desc:'E-ATX, LGA1700, DDR5, PCIe 5.0, WiFi 6E, 10GbE, 5x M.2 — MSI top-of-the-line board.', badge:null, stock:'in-stock' },
  { id:25, name:'MSI MAG Z790 Tomahawk WiFi',                category:'motherboards', price:145.000, img:UL(25), desc:'ATX, LGA1700, DDR5, PCIe 5.0, WiFi 6E, 4x M.2, 2.5GbE — best value Z790 motherboard.', badge:'Best Seller', stock:'in-stock' },
  { id:26, name:'Gigabyte Z790 AORUS Master',                category:'motherboards', price:230.000, img:UL(26), desc:'ATX, LGA1700, DDR5, PCIe 5.0, WiFi 6E, 4x M.2, Thunderbolt 4 — reliable high-end build.', badge:null, stock:'in-stock' },
  { id:27, name:'ASUS ROG Strix X670E-E Gaming WiFi',        category:'motherboards', price:176.000, img:UL(27), desc:'ATX, AM5, DDR5, PCIe 5.0, WiFi 6E, BT 5.3, 4x M.2, 2.5GbE — premium AMD Ryzen board.', badge:'Popular', stock:'in-stock' },
  { id:28, name:'MSI MEG X670E ACE',                         category:'motherboards', price:290.000, img:UL(28), desc:'ATX, AM5, DDR5, PCIe 5.0, WiFi 6E, 6x M.2, 10GbE — top AMD flagship motherboard.', badge:null, stock:'in-stock' },
  { id:29, name:'Gigabyte X670E AORUS Master',               category:'motherboards', price:210.000, img:UL(29), desc:'ATX, AM5, DDR5, PCIe 5.0, WiFi 6E, 4x M.2, USB 3.2 Gen 2x2 — solid AMD high-end pick.', badge:null, stock:'in-stock' },
  { id:30, name:'ASUS TUF Gaming B650-Plus WiFi',            category:'motherboards', price:88.000,  img:UL(30), desc:'ATX, AM5, DDR5, WiFi 6, 4x M.2, 2.5GbE — best budget AM5 motherboard for Ryzen 7000.', badge:'Popular', stock:'in-stock' },
  // ── MONITORS (31-40) ─────────────────────────────────────────────────────────
  { id:31, name:'ASUS ROG Swift OLED PG27AQDM 27"',          category:'monitors',     price:264.000, img:UL(31), desc:'2K QHD, 240Hz, 0.03ms, OLED panel, G-Sync Compatible, HDR400 True Black — stunning visuals.', badge:'Best Seller', stock:'in-stock' },
  { id:32, name:'ASUS ROG Swift QD-OLED PG27UCDM 27"',       category:'monitors',     price:361.000, img:UL(32), desc:'4K UHD, 240Hz, 0.03ms, QD-OLED, G-Sync + FreeSync Premium Pro — best gaming monitor available.', badge:null, stock:'in-stock' },
  { id:33, name:'Samsung Odyssey G80SD 32" 4K OLED',         category:'monitors',     price:420.000, img:UL(33), desc:'4K UHD, 240Hz, 0.03ms OLED, HDMI 2.1, Smart TV features built-in — luxury gaming display.', badge:null, stock:'in-stock' },
  { id:34, name:'Samsung Odyssey G7 28" 4K 144Hz',           category:'monitors',     price:175.000, img:UL(34), desc:'4K UHD, 144Hz, 1ms IPS, G-Sync Compatible, HDR400 — premium 4K at a reasonable price.', badge:'Popular', stock:'in-stock' },
  { id:35, name:'LG UltraGear 27GR95QE 27" OLED 240Hz',     category:'monitors',     price:220.000, img:UL(35), desc:'1440p QHD, 240Hz, 0.03ms OLED, G-Sync Compatible, HDR400 — brilliant contrast and speed.', badge:null, stock:'in-stock' },
  { id:36, name:'LG UltraGear 27GP950-B 27" 4K 160Hz',      category:'monitors',     price:210.000, img:UL(36), desc:'4K UHD, 160Hz, 1ms NanoIPS, HDMI 2.1 for console+PC — versatile high-refresh 4K display.', badge:null, stock:'in-stock' },
  { id:37, name:'MSI MAG 274QRF-QD 27" 1440p 165Hz',        category:'monitors',     price:120.000, img:UL(37), desc:'1440p QHD, 165Hz, 1ms IPS Quantum Dot, FreeSync Premium, HDR400 — great value mid-range.', badge:null, stock:'in-stock' },
  { id:38, name:'Gigabyte M27Q X 27" 1440p 240Hz',           category:'monitors',     price:145.000, img:UL(38), desc:'1440p QHD, 240Hz, 0.5ms IPS, KVM switch, FreeSync Premium — excellent 1440p gaming value.', badge:'Popular', stock:'in-stock' },
  { id:39, name:'BenQ MOBIUZ EX2710S 27" 1080p 165Hz',      category:'monitors',     price:72.000,  img:UL(39), desc:'1080p FHD, 165Hz, 1ms IPS, FreeSync Premium, HDRi — best budget entry gaming monitor.', badge:null, stock:'in-stock' },
  { id:40, name:'ASUS ProArt Display PA32UCG 32" 4K',        category:'monitors',     price:580.000, img:UL(40), desc:'4K UHD, 120Hz, IPS, HDR1000, Thunderbolt 3 — professional creator/studio reference display.', badge:null, stock:'in-stock' },
  // ── LAPTOPS (41-50) ──────────────────────────────────────────────────────────
  { id:41, name:'ASUS ROG Strix G16 2025 RTX 4080',          category:'laptops',      price:890.000, img:UL(41), desc:'16" QHD 240Hz, Intel Core Ultra 9 275HX, RTX 4080 16GB, 32GB DDR5, 1TB SSD — top gaming laptop.', badge:'Best Seller', stock:'in-stock' },
  { id:42, name:'ASUS ROG Strix G18 2025 RTX 4090',          category:'laptops',      price:1150.000,img:UL(42), desc:'18" QHD 240Hz, Ryzen 9 8945HX, RTX 4090 16GB, 32GB RAM, 1TB SSD — ultimate gaming powerhouse.', badge:null, stock:'in-stock' },
  { id:43, name:'ASUS ROG Zephyrus G16 OLED RTX 4070',       category:'laptops',      price:850.000, img:UL(43), desc:'16" WQXGA OLED 240Hz, Core Ultra 9 185H, RTX 4070 8GB, 16GB RAM, 1TB SSD — slim gaming beast.', badge:'Popular', stock:'in-stock' },
  { id:44, name:'MSI Raider GE78 HX i9-14900HX RTX 4090',   category:'laptops',      price:1300.000,img:UL(44), desc:'17" QHD 240Hz, Core i9-14900HX, RTX 4090 16GB, 32GB DDR5, 2TB SSD — absolute top laptop.', badge:null, stock:'in-stock' },
  { id:45, name:'Lenovo Legion Pro 7i Gen 9 RTX 4080',       category:'laptops',      price:920.000, img:UL(45), desc:'16" WQXGA 240Hz, Core i9-14900HX, RTX 4080 16GB, 32GB DDR5, 1TB SSD — Lenovo flagship.', badge:null, stock:'in-stock' },
  { id:46, name:'Lenovo Legion 5 Pro Gen 9 RTX 4070',        category:'laptops',      price:500.000, img:UL(46), desc:'16" WQXGA 165Hz, Ryzen 9 8945H, RTX 4070 8GB, 16GB DDR5, 512GB SSD — best mid-range gaming.', badge:'Popular', stock:'in-stock' },
  { id:47, name:'Razer Blade 16 2024 RTX 4090 OLED',         category:'laptops',      price:1400.000,img:UL(47), desc:'16" UHD+ OLED 240Hz, Core i9-14900HX, RTX 4090 16GB, 32GB, 2TB — premium gaming laptop.', badge:null, stock:'in-stock' },
  { id:48, name:'HP OMEN 16 2024 i7-13700HX RTX 4070',       category:'laptops',      price:480.000, img:UL(48), desc:'16" QHD 165Hz IPS, Core i7-13700HX, RTX 4070 8GB, 16GB, 512GB SSD — solid HP gaming laptop.', badge:null, stock:'in-stock' },
  { id:49, name:'MSI Stealth 16 Mercedes-AMG RTX 4070 OLED', category:'laptops',      price:990.000, img:UL(49), desc:'16" UHD 120Hz OLED, Core i9-13980HX, RTX 4070 8GB, 32GB, 2TB SSD — ultra-premium thin design.', badge:null, stock:'in-stock' },
  { id:50, name:'ASUS ROG Zephyrus M16 RTX 4060',            category:'laptops',      price:620.000, img:UL(50), desc:'16" WUXGA 165Hz, Intel Core i7, RTX 4060 8GB, 16GB DDR5, 512GB SSD — power + portability.', badge:null, stock:'in-stock' },
  // ── PRE-BUILTS (51-60) ───────────────────────────────────────────────────────
  { id:51, name:'Custom Entry Build i5-13400F + RTX 4060',   category:'pre-builts',   price:289.000, img:UL(51), desc:'Core i5-13400F, RTX 4060 8GB, 16GB DDR4, 500GB SSD, B660 motherboard — best budget gaming PC.', badge:'Best Seller', stock:'in-stock' },
  { id:52, name:'Custom Mid-Range i7-13700F + RTX 4070',     category:'pre-builts',   price:520.000, img:UL(52), desc:'Core i7-13700F, RTX 4070 12GB, 16GB DDR4, 1TB SSD, B760 motherboard — all-round 1440p build.', badge:'Popular', stock:'in-stock' },
  { id:53, name:'Custom AMD Mid Ryzen 7 7700X + RTX 4070S',  category:'pre-builts',   price:560.000, img:UL(53), desc:'Ryzen 7 7700X, RTX 4070 Super 12GB, 32GB DDR5, 1TB NVMe, B650 motherboard — AMD value king.', badge:null, stock:'in-stock' },
  { id:54, name:'NZXT Player PC i7-14700K + RTX 4070 Ti',   category:'pre-builts',   price:780.000, img:UL(54), desc:'Core i7-14700K, RTX 4070 Ti Super 16GB, 32GB DDR5, 1TB NVMe, NZXT H5 Flow case — clean build.', badge:null, stock:'in-stock' },
  { id:55, name:'NZXT Player Pro i9-14900K + RTX 4080 Super',category:'pre-builts',   price:1050.000,img:UL(55), desc:'Core i9-14900K, RTX 4080 Super 16GB, 32GB DDR5, 2TB NVMe — high-end turnkey gaming PC.', badge:null, stock:'in-stock' },
  { id:56, name:'Custom Ryzen High 7900X + RTX 4080 Super',  category:'pre-builts',   price:950.000, img:UL(56), desc:'Ryzen 9 7900X, RTX 4080 Super 16GB, 32GB DDR5, 2TB NVMe, X670E board — AMD powerhouse build.', badge:null, stock:'in-stock' },
  { id:57, name:'Alienware Aurora R16 RTX 4070 Ti Super',    category:'pre-builts',   price:1100.000,img:UL(57), desc:'Core i7-14700KF, RTX 4070 Ti Super 16GB, 32GB DDR5, 1TB SSD — iconic Alienware design.', badge:null, stock:'in-stock' },
  { id:58, name:'Alienware Aurora R16 RTX 4090',             category:'pre-builts',   price:1650.000,img:UL(58), desc:'Core i9-14900KF, RTX 4090 24GB, 64GB DDR5, 2TB SSD — Alienware absolute flagship PC.', badge:null, stock:'in-stock' },
  { id:59, name:'Corsair One i300 Compact RTX 4090',         category:'pre-builts',   price:1800.000,img:UL(59), desc:'Core i9-14900K, RTX 4090 24GB, 32GB DDR5, 2TB NVMe — world most powerful compact gaming PC.', badge:null, stock:'in-stock' },
  { id:60, name:'Cooler Master Sneaker X i7 + RTX 4070 OC', category:'pre-builts',   price:930.000, img:UL(60), desc:'Core i7-13700KF, RTX 4070 OC 12GB, 16GB DDR5, 1TB NVMe — sneaker-shaped iconic gaming PC.', badge:'New', stock:'in-stock' },
  // ── PERIPHERALS (61-70) ──────────────────────────────────────────────────────
  { id:61, name:'Logitech G Pro X Superlight 2 Mouse',       category:'peripherals',  price:49.000,  img:UL(61), desc:'Wireless gaming mouse, HERO 2 sensor 32K DPI, only 60g, LIGHTSPEED 1ms — pro esports mouse.', badge:'Best Seller', stock:'in-stock' },
  { id:62, name:'Razer DeathAdder V3 Pro Wireless Mouse',     category:'peripherals',  price:52.000,  img:UL(62), desc:'Wireless ergonomic mouse, Focus Pro 30K sensor, 30,000 DPI, 64g — top Razer wireless mouse.', badge:null, stock:'in-stock' },
  { id:63, name:'SteelSeries Aerox 9 Wireless Mouse',        category:'peripherals',  price:68.000,  img:UL(63), desc:'18-button wireless gaming mouse, TrueMove Air sensor, 89g, AquaBarrier splash-proof design.', badge:null, stock:'in-stock' },
  { id:64, name:'Logitech G915 TKL Wireless Keyboard',       category:'peripherals',  price:58.000,  img:UL(64), desc:'Wireless TKL, GL Clicky/Linear/Tactile switches, LIGHTSPEED, RGB, slim metal frame.', badge:'Popular', stock:'in-stock' },
  { id:65, name:'Razer BlackWidow V4 Pro Wireless Keyboard',  category:'peripherals',  price:72.000,  img:UL(65), desc:'Full-size mechanical keyboard, Razer Yellow linear switches, Chroma RGB, wireless+wired.', badge:null, stock:'in-stock' },
  { id:66, name:'SteelSeries Apex Pro TKL 2023 Keyboard',    category:'peripherals',  price:65.000,  img:UL(66), desc:'TKL keyboard, OmniPoint 2.0 adjustable actuation, OLED smart display, per-key RGB — ultra-precise.', badge:'Popular', stock:'in-stock' },
  { id:67, name:'SteelSeries Arctis Nova Pro Wireless',      category:'peripherals',  price:125.000, img:UL(67), desc:'Wireless headset, ANC, dual audio streams, ClearCast Gen 2 mic, Hi-Fi audio — best wireless headset.', badge:null, stock:'in-stock' },
  { id:68, name:'Razer BlackShark V2 Pro 2023 Headset',      category:'peripherals',  price:85.000,  img:UL(68), desc:'Wireless gaming headset, 50mm TriForce Titanium drivers, HyperClear mic, 70-hour battery.', badge:null, stock:'in-stock' },
  { id:69, name:'HyperX Cloud Alpha Wireless Headset',       category:'peripherals',  price:62.000,  img:UL(69), desc:'Wireless gaming headset, 300-hour battery life, dual chamber drivers, 7.1 surround sound.', badge:'Popular', stock:'in-stock' },
  { id:70, name:'Logitech C922 Pro Stream Webcam 1080p',     category:'peripherals',  price:28.000,  img:UL(70), desc:'1080p 30fps / 720p 60fps, autofocus, background replacement, dual stereo mics — streamer favourite.', badge:null, stock:'in-stock' },
  // ── RTX 5070 NEW (71) ────────────────────────────────────────────────────────
  { id:71, name:'ASUS ROG Strix GeForce RTX 5070 OC 12GB',   category:'gpu',          price:245.000, img:UL(71), desc:'12GB GDDR7, 2.9GHz boost, PCIe 5.0, DLSS 4 Multi-Frame Gen, next-gen Blackwell architecture.', badge:'New 🔥', stock:'in-stock' },
  // ── OTHER PC PARTS (72-81) ────────────────────────────────────────────────────
  { id:72, name:'Corsair RM850x 850W 80+ Gold PSU',          category:'other-parts',  price:38.000,  img:UL(72), desc:'850W fully modular PSU, 80+ Gold certified, ultra-quiet fan, 10-year warranty, ATX 3.1 ready.', badge:'Popular', stock:'in-stock' },
  { id:73, name:'be quiet! Dark Power 13 1000W 80+ Titanium',category:'other-parts',  price:55.000,  img:UL(73), desc:'1000W fully modular, 80+ Titanium, ultra-silent Silent Wings fan, overclocking key, premium build.', badge:null, stock:'in-stock' },
  { id:74, name:'Corsair Vengeance DDR5 32GB 6000MHz Kit',   category:'other-parts',  price:68.000,  img:UL(74), desc:'32GB (2x16GB) DDR5 6000MHz, XMP 3.0, low-profile heatspreader, Intel & AMD compatible.', badge:'Popular', stock:'in-stock' },
  { id:75, name:'G.Skill Trident Z5 RGB DDR5 32GB 6400MHz',  category:'other-parts',  price:85.000,  img:UL(75), desc:'32GB (2x16GB) DDR5 6400MHz, XMP 3.0, addressable RGB, premium aluminum heat spreader.', badge:null, stock:'in-stock' },
  { id:76, name:'Samsung 990 Pro 2TB NVMe M.2 PCIe 4.0',    category:'other-parts',  price:75.000,  img:UL(76), desc:'2TB PCIe 4.0 NVMe M.2, 7,450 MB/s read, 6,900 MB/s write, thermal control IC, PS5 compatible.', badge:'Best Seller', stock:'in-stock' },
  { id:77, name:'WD Black SN850X 2TB NVMe M.2 PCIe 4.0',    category:'other-parts',  price:70.000,  img:UL(77), desc:'2TB PCIe 4.0 NVMe M.2, 7,300 MB/s read, 6,600 MB/s write, built for gaming with GameMode 2.0.', badge:null, stock:'in-stock' },
  { id:78, name:'NZXT Kraken 360 RGB AIO Liquid Cooler',     category:'other-parts',  price:95.000,  img:UL(78), desc:'360mm AIO, LCD display, 3x F120P fans, LGA1851/1700/AM5, asetek 7th gen pump, 6-year warranty.', badge:null, stock:'in-stock' },
  { id:79, name:'Lian Li LANCOOL III RGB Mid-Tower Case',     category:'other-parts',  price:72.000,  img:UL(79), desc:'ATX mid-tower, tempered glass, 3x 140mm ARGB fans pre-installed, tool-free, excellent airflow.', badge:'Popular', stock:'in-stock' },
  { id:80, name:'Corsair 5000D Airflow ATX Mid-Tower Case',  category:'other-parts',  price:65.000,  img:UL(80), desc:'ATX mid-tower, maximum airflow design, tempered glass panel, 2x 120mm fans, E-ATX support.', badge:null, stock:'in-stock' },
  { id:81, name:'Noctua NH-D15 Premium CPU Air Cooler',      category:'other-parts',  price:42.000,  img:UL(81), desc:'Dual-tower, 2x NF-A15 140mm fans, up to 250W TDP, LGA1700/AM5 compatible, near-silent performance.', badge:null, stock:'in-stock' }
];

var _AR_PRODUCTS = {
  1:  { name:'كارت شاشة ASUS Dual RTX 5060 Ti OC 8GB', desc:'8GB GDDR7، DLSS 4، PCIe 5.0 — مثالي للألعاب بدقة 1080p/1440p.' },
  2:  { name:'كارت شاشة MSI RTX 5060 Ti Gaming Trio 16GB', desc:'16GB GDDR7، تبريد Tri Frozr 4، ذاكرة إضافية للألعاب الثقيلة.' },
  3:  { name:'كارت شاشة Gigabyte RTX 5070 WindForce OC', desc:'12GB GDDR7، مراوح WindForce ثلاثية، DLSS 4، أداء 1440p ممتاز.' },
  4:  { name:'كارت شاشة ASUS TUF RTX 5070 Ti OC 16GB', desc:'16GB GDDR7، بنية TUF متينة، DLSS 4 — مدخل قوي لألعاب 4K.' },
  5:  { name:'كارت شاشة MSI RTX 5080 Gaming Trio OC', desc:'16GB GDDR7، تبريد Tri Frozr 4، ألعاب 4K بمستوى رائد.' },
  6:  { name:'كارت شاشة ZOTAC RTX 5090 Solid OC 32GB', desc:'32GB GDDR7، أسرع كارت شاشة للمستهلكين في العالم.' },
  7:  { name:'كارت شاشة Sapphire Pulse RX 9060 XT 16GB', desc:'16GB GDDR6، RDNA 4، FSR 4 — أفضل قيمة لألعاب 1440p.' },
  8:  { name:'كارت شاشة XFX Swift RX 9070 16GB', desc:'16GB GDDR6، RDNA 4، FSR 4 — أداء سلس بدقة 1440p و4K.' },
  9:  { name:'كارت شاشة Sapphire Nitro+ RX 9070 XT 16GB', desc:'16GB GDDR6، تبريد Nitro+ فاخر، منافس RTX 5070 Ti.' },
  10: { name:'كارت شاشة PowerColor Red Devil RX 9070 XT', desc:'16GB GDDR6، تصميم Red Devil ثلاثي المراوح، أعلى أداء RDNA 4.' },
  11: { name:'معالج Intel Core i9-14900K', desc:'24 نواة، 6.0GHz توربو، LGA1700، DDR5 — معالج Intel الرائد.' },
  12: { name:'معالج Intel Core i9-14900KF', desc:'24 نواة، 6.0GHz توربو، LGA1700، بدون iGPU — نفس الأداء بسعر أقل.' },
  13: { name:'معالج Intel Core i7-14700K', desc:'20 نواة، 5.6GHz توربو، LGA1700 — أفضل معالج ألعاب متوسط-عالي.' },
  14: { name:'معالج Intel Core i7-14700KF', desc:'20 نواة، 5.6GHz توربو، LGA1700، بدون iGPU — قيمة رائعة.' },
  15: { name:'معالج Intel Core i5-14600K', desc:'14 نواة، 5.3GHz توربو، LGA1700 — أفضل معالج ألعاب لكل دينار.' },
  16: { name:'معالج AMD Ryzen 9 7950X3D', desc:'16 نواة، 5.7GHz، AM5، 128MB 3D V-Cache — أسرع معالج ألعاب.' },
  17: { name:'معالج AMD Ryzen 9 7950X', desc:'16 نواة، 5.7GHz، AM5، 170W — قوة هائلة للإبداع والعمل.' },
  18: { name:'معالج AMD Ryzen 9 7900X', desc:'12 نواة، 5.6GHz، AM5 — توازن رائع بين الألعاب والإنتاجية.' },
  19: { name:'معالج AMD Ryzen 7 7700X', desc:'8 أنوية، 5.4GHz، AM5 — معالج ألعاب متوسط قوي.' },
  20: { name:'معالج AMD Ryzen 5 7600X', desc:'6 أنوية، 5.3GHz، AM5 — أفضل معالج AM5 بميزانية محدودة.' },
  21: { name:'لوحة أم ASUS ROG Maximus Z790 Hero', desc:'ATX، LGA1700، DDR5، WiFi 6E، 5 فتحات M.2 — لوحة Intel فاخرة.' },
  22: { name:'لوحة أم ASUS ROG Maximus Z790 Extreme', desc:'ATX، LGA1700، DDR5، Thunderbolt 4 مزدوج، 10GbE — الأفضل على الإطلاق.' },
  23: { name:'لوحة أم ASUS ROG Maximus Z790 Dark Hero WiFi 7', desc:'ATX، LGA1700، DDR5، WiFi 7، PCIe 5.0.' },
  24: { name:'لوحة أم MSI MEG Z790 Godlike', desc:'E-ATX، LGA1700، DDR5، WiFi 6E، 10GbE — قمة MSI.' },
  25: { name:'لوحة أم MSI MAG Z790 Tomahawk WiFi', desc:'ATX، LGA1700، DDR5، WiFi 6E، 4 فتحات M.2 — أفضل قيمة Z790.' },
  26: { name:'لوحة أم Gigabyte Z790 AORUS Master', desc:'ATX، LGA1700، DDR5، WiFi 6E، Thunderbolt 4.' },
  27: { name:'لوحة أم ASUS ROG Strix X670E-E Gaming WiFi', desc:'ATX، AM5، DDR5، PCIe 5.0، WiFi 6E — لوحة AMD فاخرة.' },
  28: { name:'لوحة أم MSI MEG X670E ACE', desc:'ATX، AM5، DDR5، WiFi 6E، 6 فتحات M.2 — قمة AMD.' },
  29: { name:'لوحة أم Gigabyte X670E AORUS Master', desc:'ATX، AM5، DDR5، WiFi 6E، 4 فتحات M.2.' },
  30: { name:'لوحة أم ASUS TUF Gaming B650-Plus WiFi', desc:'ATX، AM5، DDR5، WiFi 6 — أفضل لوحة AM5 بميزانية محدودة.' },
  31: { name:'شاشة ASUS ROG Swift OLED PG27AQDM 27"', desc:'QHD 2K، 240Hz، 0.03ms، OLED، G-Sync، HDR400 — صورة مذهلة.' },
  32: { name:'شاشة ASUS ROG Swift QD-OLED PG27UCDM 27"', desc:'4K، 240Hz، 0.03ms، QD-OLED — أفضل شاشة ألعاب متاحة.' },
  33: { name:'شاشة Samsung Odyssey G80SD 32" OLED', desc:'4K، 240Hz، OLED، HDMI 2.1، ميزات Smart TV — شاشة فاخرة.' },
  34: { name:'شاشة Samsung Odyssey G7 28" 4K', desc:'4K، 144Hz، 1ms IPS، G-Sync — 4K بسعر مناسب.' },
  35: { name:'شاشة LG UltraGear 27GR95QE OLED 240Hz', desc:'QHD 1440p، 240Hz، 0.03ms OLED، تباين رائع.' },
  36: { name:'شاشة LG UltraGear 27GP950-B 4K 160Hz', desc:'4K، 160Hz، NanoIPS، HDMI 2.1 — 4K عالي الإنعاش.' },
  37: { name:'شاشة MSI MAG 274QRF-QD 1440p 165Hz', desc:'QHD 1440p، 165Hz، IPS Quantum Dot — قيمة ممتازة.' },
  38: { name:'شاشة Gigabyte M27Q X 1440p 240Hz', desc:'QHD 1440p، 240Hz، 0.5ms IPS، KVM — أفضل قيمة 1440p.' },
  39: { name:'شاشة BenQ MOBIUZ EX2710S 27" 165Hz', desc:'FHD 1080p، 165Hz، 1ms IPS — أفضل شاشة ميزانية.' },
  40: { name:'شاشة ASUS ProArt PA32UCG 32" 4K', desc:'4K، HDR1000، Thunderbolt 3 — مرجع احترافي للمصممين.' },
  41: { name:'لابتوب ASUS ROG Strix G16 2025 RTX 4080', desc:'QHD 240Hz، Core Ultra 9، RTX 4080، 32GB DDR5.' },
  42: { name:'لابتوب ASUS ROG Strix G18 2025 RTX 4090', desc:'QHD 240Hz، Ryzen 9، RTX 4090، 32GB رام.' },
  43: { name:'لابتوب ASUS ROG Zephyrus G16 OLED RTX 4070', desc:'OLED 240Hz، Core Ultra 9، RTX 4070 — رفيع وقوي.' },
  44: { name:'لابتوب MSI Raider GE78 HX RTX 4090', desc:'QHD 240Hz، i9-14900HX، RTX 4090 — أقوى لابتوب.' },
  45: { name:'لابتوب Lenovo Legion Pro 7i Gen 9 RTX 4080', desc:'WQXGA 240Hz، i9-14900HX، RTX 4080 — فلاجشيب لينوفو.' },
  46: { name:'لابتوب Lenovo Legion 5 Pro Gen 9 RTX 4070', desc:'WQXGA 165Hz، Ryzen 9، RTX 4070 — أفضل لابتوب متوسط.' },
  47: { name:'لابتوب Razer Blade 16 RTX 4090 OLED', desc:'OLED 240Hz، i9-14900HX، RTX 4090 — لابتوب فاخر.' },
  48: { name:'لابتوب HP OMEN 16 2024 RTX 4070', desc:'QHD 165Hz، i7-13700HX، RTX 4070 — لابتوب HP للألعاب.' },
  49: { name:'لابتوب MSI Stealth 16 Mercedes-AMG RTX 4070', desc:'OLED 120Hz، i9-13980HX، RTX 4070 — تصميم فاخر نحيل.' },
  50: { name:'لابتوب ASUS ROG Zephyrus M16 RTX 4060', desc:'165Hz، Core i7، RTX 4060 — قوة + حمل خفيف.' },
  51: { name:'بي سي مخصص i5-13400F + RTX 4060', desc:'Core i5-13400F، RTX 4060، 16GB DDR4 — أفضل بي سي بميزانية محدودة.' },
  52: { name:'بي سي متوسط i7-13700F + RTX 4070', desc:'Core i7-13700F، RTX 4070، 16GB DDR4 — جهاز شامل.' },
  53: { name:'بي سي AMD متوسط Ryzen 7 + RTX 4070S', desc:'Ryzen 7 7700X، RTX 4070 Super، 32GB DDR5.' },
  54: { name:'بي سي NZXT Player i7-14700K + RTX 4070 Ti', desc:'Core i7-14700K، RTX 4070 Ti Super، 32GB DDR5.' },
  55: { name:'بي سي NZXT Player Pro i9-14900K + RTX 4080S', desc:'Core i9-14900K، RTX 4080 Super، 32GB DDR5.' },
  56: { name:'بي سي AMD عالي 7900X + RTX 4080 Super', desc:'Ryzen 9 7900X، RTX 4080 Super، 32GB DDR5.' },
  57: { name:'بي سي Alienware Aurora R16 RTX 4070 Ti', desc:'Core i7-14700KF، RTX 4070 Ti Super — Alienware الأيقوني.' },
  58: { name:'بي سي Alienware Aurora R16 RTX 4090', desc:'Core i9-14900KF، RTX 4090، 64GB DDR5 — فلاجشيب Alienware.' },
  59: { name:'بي سي Corsair One i300 RTX 4090', desc:'Core i9-14900K، RTX 4090، 32GB DDR5 — أقوى بي سي مدمج.' },
  60: { name:'بي سي Cooler Master Sneaker X RTX 4070', desc:'Core i7-13700KF، RTX 4070 OC — تصميم حذاء أيقوني.' },
  61: { name:'ماوس Logitech G Pro X Superlight 2', desc:'لاسلكي، HERO 2 32K DPI، 60 جرام — ماوس البطولات الاحترافية.' },
  62: { name:'ماوس Razer DeathAdder V3 Pro لاسلكي', desc:'لاسلكي، مستشعر Focus Pro 30K DPI، 64 جرام.' },
  63: { name:'ماوس SteelSeries Aerox 9 لاسلكي', desc:'18 زر، TrueMove Air، 89 جرام، مقاوم للرطوبة.' },
  64: { name:'كيبورد Logitech G915 TKL لاسلكي', desc:'لاسلكي TKL، مفاتيح GL، LIGHTSPEED، RGB، إطار معدني.' },
  65: { name:'كيبورد Razer BlackWidow V4 Pro لاسلكي', desc:'ميكانيكي كامل، مفاتيح Razer Yellow، Chroma RGB.' },
  66: { name:'كيبورد SteelSeries Apex Pro TKL 2023', desc:'TKL، OmniPoint 2.0، شاشة OLED ذكية، RGB لكل مفتاح.' },
  67: { name:'سماعة SteelSeries Arctis Nova Pro لاسلكي', desc:'لاسلكي، ANC، مزدوج الصوت، ميكروفون ClearCast Gen 2.' },
  68: { name:'سماعة Razer BlackShark V2 Pro 2023', desc:'لاسلكي، دايفرز TriForce Titanium، بطارية 70 ساعة.' },
  69: { name:'سماعة HyperX Cloud Alpha لاسلكي', desc:'لاسلكي، بطارية 300 ساعة، صوت محيطي 7.1.' },
  70: { name:'كاميرا Logitech C922 Pro Stream 1080p', desc:'1080p 30fps، تركيز تلقائي، ميكروفونات ستيريو مزدوجة.' },
  71: { name:'كارت شاشة ASUS ROG Strix RTX 5070 OC الجديد', desc:'12GB GDDR7، Blackwell، DLSS 4 Multi-Frame Gen — الجيل الجديد من NVIDIA.' },
  72: { name:'مزود طاقة Corsair RM850x 850W ذهبي', desc:'850W مودولار كامل، 80+ Gold، هادئ جداً، ضمان 10 سنوات.' },
  73: { name:'مزود طاقة be quiet! Dark Power 13 1000W تيتانيوم', desc:'1000W مودولار كامل، 80+ Titanium، أعلى كفاءة.' },
  74: { name:'رام Corsair Vengeance DDR5 32GB 6000MHz', desc:'32GB (2x16GB) DDR5 6000MHz، XMP 3.0، للأنظمة Intel وAMD.' },
  75: { name:'رام G.Skill Trident Z5 RGB DDR5 32GB 6400MHz', desc:'32GB DDR5 6400MHz، RGB قابل للعنونة، XMP 3.0.' },
  76: { name:'SSD Samsung 990 Pro 2TB NVMe M.2', desc:'2TB PCIe 4.0، سرعة قراءة 7,450 MB/s، مناسب للـ PS5.' },
  77: { name:'SSD WD Black SN850X 2TB NVMe M.2', desc:'2TB PCIe 4.0، 7,300 MB/s، GameMode 2.0 للألعاب.' },
  78: { name:'مبرد مائي NZXT Kraken 360 RGB AIO', desc:'360mm AIO، شاشة LCD، 3 مراوح F120P، ضمان 6 سنوات.' },
  79: { name:'كيس Lian Li LANCOOL III RGB', desc:'برج متوسط ATX، زجاج مقسى، 3 مراوح ARGB مثبتة مسبقاً.' },
  80: { name:'كيس Corsair 5000D Airflow ATX', desc:'برج متوسط ATX، تدفق هواء ممتاز، زجاج مقسى.' },
  81: { name:'مبرد هواء CPU Noctua NH-D15 Premium', desc:'برج مزدوج، مروحتان 140mm، حتى 250W TDP، شبه صامت.' }
};

var _AR_CATS = {
  'gpu':          'كروت الشاشة',
  'cpu':          'المعالجات',
  'motherboards': 'اللوحات الأم',
  'monitors':     'الشاشات',
  'laptops':      'اللابتوبات',
  'pre-builts':   'أجهزة جاهزة',
  'peripherals':  'الملحقات',
  'other-parts':  'قطع أخرى'
};

let cart = [];
let activeFilter = 'all';

// ── BUILD YOUR PC ────────────────────────────────────────────────────────────
let buildState = {};
const BUILD_SLOTS = [
  { id:'cpu',         label:'Processor (CPU)',     icon:'fa-microchip', cats:['cpu'] },
  { id:'motherboard', label:'Motherboard',          icon:'fa-server',    cats:['motherboards'] },
  { id:'gpu',         label:'Graphics Card (GPU)',  icon:'fa-fire',      cats:['gpu'] },
  { id:'ram',         label:'Memory (RAM)',          icon:'fa-memory',    cats:['other-parts'], kw:['ddr','ram','gb'] },
  { id:'storage',     label:'Storage (SSD/NVMe)',   icon:'fa-hdd',       cats:['other-parts'], kw:['ssd','nvme','tb','gb'] },
  { id:'psu',         label:'Power Supply (PSU)',   icon:'fa-bolt',      cats:['other-parts'], kw:['psu','watt','850','1000','power','rm'] },
  { id:'case',        label:'PC Case',               icon:'fa-cube',      cats:['other-parts'], kw:['case','tower','lian','corsair 5000'] },
  { id:'cooling',     label:'CPU Cooling',           icon:'fa-snowflake', cats:['other-parts'], kw:['cooler','kraken','aio','noctua','h150','nh-'] }
];

function buildSearchFilter(slot, q) {
  const all = getAllProducts();
  return all.filter(p => {
    if (!slot.cats.includes(p.category)) return false;
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (q) return true;
    if (slot.kw && slot.kw.length) return slot.kw.some(k => p.name.toLowerCase().includes(k));
    return true;
  });
}

function buildSearch(input, slotId) {
  const q = input.value.toLowerCase().trim();
  const slotEl = input.closest('.build-slot');
  const resultsEl = slotEl.querySelector('.build-results');
  const slot = BUILD_SLOTS.find(s => s.id === slotId);
  const products = buildSearchFilter(slot, q).slice(0, 6);
  if (!products.length) { resultsEl.style.display = 'none'; return; }
  resultsEl.style.display = 'block';
  resultsEl.innerHTML = products.map(p => `
    <div class="bld-item" onclick="buildSelect('${slotId}',${p.id})">
      <img src="${p.img}" onerror="this.src='https://picsum.photos/seed/pc${p.id}/48/48'" />
      <span class="bld-name">${p.name}</span>
      <span class="bld-pr">${p.price.toFixed(3)} KWD</span>
    </div>`).join('');
}

function buildSelect(slotId, productId) {
  const p = getAllProducts().find(x => x.id === productId);
  if (!p) return;
  buildState[slotId] = p;
  const slotEl = document.querySelector(`.build-slot[data-slot="${slotId}"]`);
  slotEl.classList.add('slot-filled');
  slotEl.querySelector('.build-results').style.display = 'none';
  slotEl.querySelector('.bld-search-inp').value = '';
  // fill the preview image
  const preview = slotEl.querySelector('.slot-preview');
  if (preview) preview.innerHTML = `<img src="${p.img}" onerror="this.src='https://picsum.photos/seed/pc${p.id}/200/200'" alt="${p.name}" />`;
  const chosen = slotEl.querySelector('.bld-chosen');
  chosen.style.display = 'flex';
  chosen.innerHTML = `<div class="bld-chosen-info"><span>${p.name}</span><strong>${p.price.toFixed(3)} KWD</strong></div>
    <button class="bld-remove" onclick="buildRemove('${slotId}')"><i class="fa fa-times"></i> Remove</button>`;
  updateBuildTotal();
}

function buildRemove(slotId) {
  delete buildState[slotId];
  const slotEl = document.querySelector(`.build-slot[data-slot="${slotId}"]`);
  slotEl.classList.remove('slot-filled');
  const chosen = slotEl.querySelector('.bld-chosen');
  chosen.style.display = 'none';
  chosen.innerHTML = '';
  // reset preview to placeholder
  const slot = BUILD_SLOTS.find(s => s.id === slotId);
  const preview = slotEl.querySelector('.slot-preview');
  if (preview && slot) preview.innerHTML = `<i class="fa ${slot.icon} slot-preview-icon"></i><span class="slot-preview-hint">No part selected</span>`;
  updateBuildTotal();
}

function updateBuildTotal() {
  const items = Object.values(buildState);
  const total = items.reduce((s, p) => s + p.price, 0);
  const el = document.getElementById('buildGrandTotal');
  if (el) el.textContent = total.toFixed(3) + ' KWD';
  const cnt = items.length;
  const cntEl = document.getElementById('buildPartCount');
  if (cntEl) cntEl.textContent = cnt + ' / 8 parts selected';
  // render sidebar summary
  const sumList = document.getElementById('buildSummaryList');
  if (sumList) {
    if (!items.length) {
      sumList.innerHTML = '<div class="build-sum-empty">No parts selected yet</div>';
    } else {
      sumList.innerHTML = BUILD_SLOTS
        .filter(s => buildState[s.id])
        .map(s => {
          const p = buildState[s.id];
          return `<div class="build-sum-row">
            <img src="${p.img}" onerror="this.src='https://picsum.photos/seed/pc${p.id}/32/32'" />
            <span class="build-sum-name">${p.name}</span>
            <span class="build-sum-price">${p.price.toFixed(3)}</span>
          </div>`;
        }).join('');
    }
  }
}

function openBuildDrawer() {
  document.getElementById('buildDrawer').classList.add('open');
  document.getElementById('buildDrawerOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeBuildDrawer() {
  document.getElementById('buildDrawer').classList.remove('open');
  document.getElementById('buildDrawerOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function addBuildToCart() {
  const items = Object.values(buildState);
  if (!items.length) { showToast('Add at least one component first!'); return; }
  items.forEach(p => {
    const existing = cart.find(c => c.id === p.id);
    if (existing) existing.qty = (existing.qty||1) + 1;
    else cart.push({...p, qty:1});
  });
  saveCart();
  updateCartUI();
  showToast(`${items.length} part${items.length>1?'s':''} added to cart!`);
}

function initBuildSlots() {
  const grid = document.getElementById('buildSlotsGrid');
  if (!grid) return;
  updateBuildTotal(); // init summary to "no parts" state
  grid.innerHTML = BUILD_SLOTS.map(slot => {
    const defaults = buildSearchFilter(slot, '').slice(0, 6);
    const opts = defaults.map(p => `
      <div class="bld-item" onclick="buildSelect('${slot.id}',${p.id})">
        <img src="${p.img}" onerror="this.src='https://picsum.photos/seed/pc${p.id}/48/48'" />
        <span class="bld-name">${p.name}</span>
        <span class="bld-pr">${p.price.toFixed(3)} KWD</span>
      </div>`).join('');
    return `
    <div class="build-slot" data-slot="${slot.id}">
      <div class="slot-head">
        <div class="slot-icon-wrap"><i class="fa ${slot.icon}"></i></div>
        <div class="slot-label">${slot.label}</div>
      </div>
      <div class="slot-body">
        <div class="slot-preview" data-slot-preview="${slot.id}">
          <i class="fa ${slot.icon} slot-preview-icon"></i>
          <span class="slot-preview-hint">No part selected</span>
        </div>
        <div class="bld-chosen" style="display:none"></div>
        <div class="bld-search-wrap">
          <i class="fa fa-search"></i>
          <input class="bld-search-inp" placeholder="Search ${slot.label}..." oninput="buildSearch(this,'${slot.id}')" onfocus="buildSearch(this,'${slot.id}')" />
        </div>
        <div class="build-results">${opts}</div>
      </div>
    </div>`;
  }).join('');
}

function initFeaturedTicker() {
  const track = document.getElementById('featuredTrack');
  if (!track) return;
  const all = getAllProducts();
  // Admin-picked list (admin → Featured tab) — order is display order, sale
  // is a strip-only discount that doesn't touch the product's real price
  // anywhere else (cart, checkout, its own page).
  const featured = _sbFeatured
    .map(item => { const p = all.find(x => x.id === item.id); return p ? Object.assign({}, p, { _sale: item.sale || 0 }) : null; })
    .filter(Boolean);
  if (!featured.length) { track.innerHTML = ''; return; }
  const cards = featured.map(p => {
    const hasSale = p._sale > 0;
    const offerPrice = hasSale ? p.price * (1 - p._sale / 100) : p.price;
    const priceHtml = hasSale
      ? `<div class="feat-price-old">${p.price.toFixed(3)} KWD</div><div class="feat-price feat-price-sale">${offerPrice.toFixed(3)} KWD</div>`
      : `<div class="feat-price">${p.price.toFixed(3)} KWD</div>`;
    return `
    <div class="feat-card" onclick="openProductModal(${p.id})">
      <div class="feat-img-wrap"><img src="${p.img}" alt="${p.name}" onerror="this.src='https://picsum.photos/seed/pc${p.id}/200/140'"/></div>
      <div class="feat-info">
        ${hasSale ? `<span class="feat-sale-badge">-${p._sale}%</span>` : (p.badge ? `<span class="feat-badge">${p.badge}</span>` : '')}
        <div class="feat-name">${p.name}</div>
        ${priceHtml}
      </div>
    </div>`;
  }).join('');
  track.innerHTML = cards + cards; // duplicate for seamless loop
}

function getMultiCats(id) {
  try {
    var map = JSON.parse(localStorage.getItem('capslock_multi_cats') || '{}');
    return Array.isArray(map[String(id)]) ? map[String(id)] : [];
  } catch(e) { return []; }
}

function imgError(el) {
  const local = el.dataset.local;
  if (!el.dataset.triedLocal && local && el.src !== local) {
    el.dataset.triedLocal = '1'; el.src = local; return;
  }
  if (!el.dataset.retry) {
    el.dataset.retry = '1';
    const src = el.src;
    setTimeout(() => { el.src = ''; el.src = src; }, 4000);
  } else {
    el.style.display = 'none';
    if (el.nextElementSibling) el.nextElementSibling.style.display = 'flex';
  }
}

function trackView(id) {
  const v = JSON.parse(localStorage.getItem('capslock_views') || '{}');
  v[id] = (v[id] || 0) + 1;
  localStorage.setItem('capslock_views', JSON.stringify(v));
  sbFetch(SB_URL + '/rest/v1/rpc/increment_analytics', {
    method: 'POST', headers: { ...SB_H, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_id: id, p_views: 1, p_searches: 0 })
  });
}
function trackSearchText(query) {
  if (!query || query.length < 2) return;
  var terms = JSON.parse(localStorage.getItem('capslock_search_terms') || '{}');
  terms[query.toLowerCase().trim()] = (terms[query.toLowerCase().trim()] || 0) + 1;
  localStorage.setItem('capslock_search_terms', JSON.stringify(terms));
}
function trackSearch(ids) {
  if (!ids || !ids.length) return;
  const s = JSON.parse(localStorage.getItem('capslock_searches') || '{}');
  ids.forEach(id => { s[id] = (s[id] || 0) + 1; });
  localStorage.setItem('capslock_searches', JSON.stringify(s));
  ids.forEach(id => {
    sbFetch(SB_URL + '/rest/v1/rpc/increment_analytics', {
      method: 'POST', headers: { ...SB_H, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_id: id, p_views: 0, p_searches: 1 })
    });
  });
}

function syncCatNav(cat) {
  document.querySelectorAll('.cn-item').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.dataset.filter === cat));
}
function jumpCat(cat) {
  activeFilter = cat; syncCatNav(cat);
  document.getElementById('searchInput').value = '';
  renderProducts();
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}
function filterProducts(category) {
  activeFilter = category; syncCatNav(category);
  document.getElementById('searchInput').value = '';
  renderProducts();
  document.getElementById('products').scrollIntoView({ behavior:'smooth' });
}

function getLiveStock(productId) {
  const qty = _sbStock[productId];
  if (qty === undefined) return null;
  return qty === 0 ? 'out-of-stock' : qty <= 10 ? 'low-stock' : 'in-stock';
}
function getLiveQty(productId) {
  return _sbStock[productId] !== undefined ? _sbStock[productId] : null;
}
async function deductStock(cartItems) {
  cartItems.forEach(item => {
    const cur = _sbStock[item.id] !== undefined ? _sbStock[item.id] : 50;
    _sbStock[item.id] = Math.max(0, cur - item.qty);
  });
  const rows = cartItems.map(item => ({ product_id: item.id, qty: _sbStock[item.id] }));
  const { error } = await sbFetch(SB_URL + '/rest/v1/capslock_stock', {
    method: 'POST', headers: { ...SB_H, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(rows)
  });
  if (error) localStorage.setItem('capslock_stock', JSON.stringify(_sbStock));
}

const ARABIC_NAMES = {};
PRODUCTS.forEach(p => { if (_AR_PRODUCTS && _AR_PRODUCTS[p.id]) ARABIC_NAMES[p.id] = _AR_PRODUCTS[p.id].name; });

function normalizeQ(str) {
  return (str || '').toLowerCase().replace(/[-_''".،,،؛;:!؟?/\\()\[\]]/g, ' ').replace(/(.)\1+/gi, '$1').replace(/\s+/g, ' ').trim();
}
function matchesSearch(query, p) {
  if (!query) return true;
  const normQ = normalizeQ(query);
  const words = normQ.split(' ').filter(w => w.length > 0);
  const haystack = normalizeQ(p.name) + ' ' + normalizeQ(p.desc || '') + ' ' + normalizeQ(p.category || '') + ' ' + (ARABIC_NAMES[p.id] || '');
  return words.every(w => haystack.includes(w));
}

function renderProducts() {
  const query = document.getElementById('searchInput').value.trim();
  const grid  = document.getElementById('productsGrid');
  const empty = document.getElementById('productsEmpty');
  const filtered = getAllProducts().filter(p => {
    const matchCat    = activeFilter === 'all' || p.category === activeFilter || getMultiCats(p.id).includes(activeFilter);
    const matchSearch = matchesSearch(query, p);
    return matchCat && matchSearch;
  });
  if (!filtered.length) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  const badgeOrder = { 'Best Seller': 0, 'Popular': 1, 'Pro': 2, 'New': 3, 'Sale': 4 };
  filtered.sort((a, b) => {
    const aRank = a.badge != null ? (badgeOrder[a.badge] !== undefined ? badgeOrder[a.badge] : 5) : 99;
    const bRank = b.badge != null ? (badgeOrder[b.badge] !== undefined ? badgeOrder[b.badge] : 5) : 99;
    return aRank - bRank;
  });
  if (query && filtered.length) {
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => { trackSearch(filtered.map(p => p.id)); trackSearchText(query); }, 700);
  }
  const isAr = _lang === 'ar';
  grid.innerHTML = filtered.map(p => {
    const liveStatus = getLiveStock(p.id) || p.stock;
    const liveQty    = getLiveQty(p.id);
    const isOut      = liveStatus === 'out-of-stock';
    const isLow      = liveStatus === 'low-stock';
    const rawCustom  = _sbPhotos[p.id];
    const photo      = (rawCustom && (rawCustom.startsWith('http') || rawCustom.startsWith('data:'))) ? rawCustom : p.img;
    const arP = isAr && _AR_PRODUCTS[p.id];
    const pName = arP ? arP.name : p.name;
    const pDesc = arP ? arP.desc : p.desc;
    const pCat  = isAr ? (_AR_CATS[p.category] || p.category.replace('-',' ')) : p.category.replace('-',' ');
    let stockLabel, stockClass;
    if (isOut)      { stockLabel = isAr ? '&#10006; غير متوفر' : '&#10006; Out of Stock'; stockClass = 'out-of-stock'; }
    else if (isLow) { stockLabel = (isAr ? '&#9888; كمية محدودة' : '&#9888; Low Stock') + (liveQty !== null ? ' (' + liveQty + (isAr ? ' متبقي)' : ' left)') : ''); stockClass = 'low-stock'; }
    else            { stockLabel = (isAr ? '&#10003; متوفر' : '&#10003; In Stock') + (liveQty !== null ? ' (' + liveQty + ')' : ''); stockClass = 'in-stock'; }
    const addBtn  = isAr ? 'أضف' : 'Add';
    const unavail = isAr ? 'غير متاح' : 'Unavailable';
    return `
      <div class="product-card ${isOut ? 'card-out' : ''}" onclick="openProduct(${p.id})">
        <div class="product-img-wrap">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          ${isOut ? `<span class="out-badge">${isAr ? 'نفد المخزون' : 'OUT OF STOCK'}</span>` : ''}
          <button class="card-wl-btn ${isWishlisted(p.id)?'wishlisted':''}" onclick="toggleWishlist(${p.id}, event)"><i class="fa fa-heart"></i></button>
          <img src="${photo}" data-local="${p.img}" alt="${pName}" loading="lazy" onerror="imgError(this)" />
          <div class="product-img-fallback" style="display:none"><i class="fa fa-laptop"></i></div>
        </div>
        <div class="product-info">
          <div class="product-cat">${pCat}</div>
          <div style="font-size:10px;font-weight:700;color:#aaa;letter-spacing:0.5px;margin-bottom:3px">${getProductSku(p.id)}</div>
          <h3>${pName}</h3>
          <p>${pDesc}</p>
          <div class="product-footer">
            <div>
              <div class="product-price">${p.price.toFixed(3)} <small>KWD</small></div>
              <div class="stock-badge ${stockClass}">${stockLabel}</div>
            </div>
            ${isOut
              ? `<button class="btn-add btn-disabled" disabled onclick="event.stopPropagation()">${unavail}</button>`
              : `<button class="btn-add" onclick="event.stopPropagation();addToCart(${p.id})"><i class="fa fa-plus"></i> ${addBtn}</button>`}
          </div>
        </div>
      </div>`;
  }).join('');
}

let _pmQty = 1, _pmId = null;
function openProduct(id) {
  trackView(id); trackRecentlyViewed(id);
  _pmId = id; _pmQty = 1;
  const p          = getAllProducts().find(x => x.id === id);
  const liveStatus = getLiveStock(id) || p.stock;
  const liveQty    = getLiveQty(id);
  const isOut      = liveStatus === 'out-of-stock';
  const isLow      = liveStatus === 'low-stock';
  const rawPhoto   = _sbPhotos[id];
  const bigImg     = (rawPhoto && (rawPhoto.startsWith('http') || rawPhoto.startsWith('data:'))) ? rawPhoto : p.img;
  let stockIcon, stockTxt, stockCls;
  if (isOut)      { stockIcon = 'fa-times-circle'; stockTxt = 'Out of Stock'; stockCls = 'out-of-stock'; }
  else if (isLow) { stockIcon = 'fa-exclamation-circle'; stockTxt = 'Low Stock — only ' + (liveQty||'few') + ' left!'; stockCls = 'low-stock'; }
  else            { stockIcon = 'fa-check-circle'; stockTxt = 'In Stock' + (liveQty !== null ? ' — ' + liveQty + ' available' : ''); stockCls = 'in-stock'; }
  document.getElementById('prodModalSku').textContent = getProductSku(id);
  document.getElementById('prodModalBody').innerHTML =
    '<div class="pm-img-col"><img src="' + bigImg + '" alt="' + p.name + '" onerror="imgError(this)" />' +
    '<div class="pm-img-fallback" id="pmFallback"><i class="fa fa-laptop"></i></div></div>' +
    '<div class="pm-info-col">' +
    '<div class="pm-badge-row"><span class="pm-badge cat"><i class="fa fa-tag"></i> ' + p.category.replace('-', ' ') + '</span>' +
    (p.badge ? '<span class="pm-badge orange">' + p.badge + '</span>' : '') + '</div>' +
    '<h2 class="pm-name">' + p.name + '</h2><p class="pm-desc">' + p.desc + '</p>' +
    '<div class="pm-price">' + p.price.toFixed(3) + ' <small>KWD</small></div>' +
    '<div class="pm-stock-line ' + stockCls + '"><i class="fa ' + stockIcon + '"></i> ' + stockTxt + '</div>' +
    (!isOut ? '<div class="pm-qty-row"><span class="pm-qty-lbl">Quantity</span><div class="pm-qty-ctrl">' +
    '<button onclick="pmChangeQty(-1)"><i class="fa fa-minus"></i></button>' +
    '<input type="number" id="pmQtyDisplay" value="1" min="1" autocomplete="off" oninput="pmQtyInput(this)" onblur="pmQtyBlur(this)" />' +
    '<button onclick="pmChangeQty(1)"><i class="fa fa-plus"></i></button></div></div>' : '') +
    '<button class="pm-add-btn" id="pmAddBtn" ' + (isOut ? 'disabled' : 'onclick="pmAddToCart()"') + '>' +
    '<i class="fa ' + (isOut ? 'fa-ban' : 'fa-shopping-cart') + '"></i> ' + (isOut ? 'Out of Stock' : 'Add to Cart') + '</button>' +
    '<div class="pm-action-row">' +
    '<button class="pm-wl-btn '+(isWishlisted(id)?'wishlisted':'')+'" onclick="toggleWishlist('+id+', event)"><i class="fa fa-heart"></i> '+(isWishlisted(id)?'Saved':'Save')+'</button>' +
    '<button class="pm-share-btn" onclick="shareProduct('+id+')"><i class="fab fa-whatsapp"></i> Share</button>' +
    '<button class="pm-review-btn" onclick="openReviews('+id+')"><i class="fa fa-star"></i> Reviews</button></div>' +
    '<div class="pm-divider"></div><div class="pm-features">' +
    '<div class="pm-feat"><i class="fa fa-check-circle"></i> 100% genuine, quality-tested product</div>' +
    '<div class="pm-feat"><i class="fa fa-shipping-fast"></i> Same-day delivery in Kuwait</div>' +
    '<div class="pm-feat"><i class="fa fa-shield-alt"></i> Easy returns &amp; after-sales support</div>' +
    '<div class="pm-feat"><i class="fa fa-tools"></i> Professional repair services available</div>' +
    '</div></div>';
  document.getElementById('prodOverlay').classList.add('open');
  document.body.classList.add('product-open');
  document.body.style.overflow = 'hidden';
}
function closeProduct() {
  document.getElementById('prodOverlay').classList.remove('open');
  document.body.style.overflow = ''; document.body.classList.remove('product-open');
  _pmId = null; _pmQty = 1;
}
function pmChangeQty(delta) {
  const liveQty = getLiveQty(_pmId), max = liveQty !== null ? liveQty : 999;
  _pmQty = Math.max(1, Math.min(max, _pmQty + delta));
  var el = document.getElementById('pmQtyDisplay'); if (el) el.value = _pmQty;
}
function pmQtyInput(el) {
  const liveQty = getLiveQty(_pmId), max = liveQty !== null ? liveQty : 999;
  var v = parseInt(el.value, 10); if (isNaN(v) || v < 1) { _pmQty = 1; return; }
  if (v > max) { v = max; el.value = max; } _pmQty = v;
}
function pmQtyBlur(el) {
  var v = parseInt(el.value, 10); if (isNaN(v) || v < 1) v = 1;
  const liveQty = getLiveQty(_pmId), max = liveQty !== null ? liveQty : 999;
  _pmQty = Math.min(v, max); el.value = _pmQty;
}
function pmAddToCart() {
  const product = getAllProducts().find(p => p.id === _pmId);
  const liveQty = getLiveQty(_pmId), inCart = cart.find(c => c.id === _pmId), cartQty = inCart ? inCart.qty : 0;
  if (liveQty !== null && cartQty + _pmQty > liveQty) { alert('Only ' + liveQty + ' units available.'); return; }
  if (inCart) { inCart.qty += _pmQty; } else { cart.push(Object.assign({}, product, { qty: _pmQty })); }
  const btn = document.getElementById('pmAddBtn');
  btn.classList.add('pm-added-flash'); btn.innerHTML = '<i class="fa fa-check"></i> Added to Cart!';
  setTimeout(() => { updateCartUI(); closeProduct(); openCart(); }, 700);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeProduct();
    document.getElementById('cartModal').classList.remove('open');
    document.getElementById('checkoutOverlay').classList.remove('open');
  }
});

function addToCart(id) {
  trackView(id);
  const product = getAllProducts().find(p => p.id === id);
  const liveQty = getLiveQty(id), inCart = cart.find(c => c.id === id), cartQty = inCart ? inCart.qty : 0;
  if (liveQty !== null && cartQty >= liveQty) { alert('Sorry, only ' + liveQty + ' units available!'); return; }
  if (inCart) { inCart.qty++; } else { cart.push({...product, qty:1}); }
  updateCartUI(); openCart();
}
function removeFromCart(id) { cart = cart.filter(c => c.id !== id); updateCartUI(); }
function updateCartUI() {
  const count = cart.reduce((s,c) => s+c.qty, 0);
  const cc = document.getElementById('cartCount'); if (cc) cc.textContent = count;
  const fab = document.getElementById('mobCartCount'); if (fab) fab.textContent = count;
  const body  = document.getElementById('cartItems');
  const total = cart.reduce((s,c) => s+c.price*c.qty, 0);
  document.getElementById('cartTotal').textContent = total.toFixed(3) + ' KWD';
  if (!cart.length) { body.innerHTML = '<p class="empty-cart">Your cart is empty.</p>'; return; }
  body.innerHTML = cart.map(c => {
    const rawPh = _sbPhotos[c.id];
    const imgSrc = (rawPh && (rawPh.startsWith('http') || rawPh.startsWith('data:'))) ? rawPh : c.img;
    return `<div class="cart-item">
      <div class="cart-item-icon"><img src="${imgSrc}" alt="${c.name}" onerror="imgError(this)" /></div>
      <div class="cart-item-info"><strong>${c.name}</strong><span>Qty: ${c.qty} &times; ${c.price.toFixed(3)} KWD</span></div>
      <div class="cart-item-actions"><span class="cart-item-price">${(c.price*c.qty).toFixed(3)} KWD</span>
      <button class="btn-remove" onclick="removeFromCart(${c.id})"><i class="fa fa-trash"></i></button></div></div>`;
  }).join('');
}
function openCart() { document.getElementById('cartModal').classList.add('open'); }

function openCheckout() {
  if (!cart.length) return;
  document.getElementById('coItems').innerHTML = cart.map(c => `
    <div class="co-item"><div><span class="co-item-name">${c.name}</span><br/><span class="co-item-qty">x${c.qty} unit${c.qty>1?'s':''}</span></div>
    <span class="co-item-price">${(c.price*c.qty).toFixed(3)} KWD</span></div>`).join('');
  const total = cart.reduce((s,c) => s+c.price*c.qty, 0);
  document.getElementById('coTotal').textContent = total.toFixed(3) + ' KWD';
  document.getElementById('cartModal').classList.remove('open');
  document.getElementById('checkoutOverlay').classList.add('open');
  if (_userProfile) {
    if (_userProfile.name)  document.getElementById('coName').value  = _userProfile.name;
    if (_userProfile.phone) document.getElementById('coPhone').value = _userProfile.phone;
  }
}

let _fulfilment = 'delivery';
function setFulfilment(mode) {
  _fulfilment = mode;
  document.getElementById('ftDelivery').classList.toggle('active', mode === 'delivery');
  document.getElementById('ftPickup').classList.toggle('active', mode === 'pickup');
  document.getElementById('coDeliverySection').style.display = mode === 'delivery' ? '' : 'none';
  document.getElementById('coPickupInfo').style.display = mode === 'pickup' ? '' : 'none';
}

document.getElementById('coSubmitBtn').addEventListener('click', () => {
  const name  = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const isPickup = _fulfilment === 'pickup';
  let valid = true;
  ['coName','coPhone'].forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) { el.classList.add('err'); valid = false; } else el.classList.remove('err');
  });
  if (!isPickup) {
    const areaEl = document.getElementById('coArea');
    if (!areaEl.value) { areaEl.classList.add('err'); valid = false; } else areaEl.classList.remove('err');
  }
  if (!valid) { alert('Please fill in your name and WhatsApp number' + (isPickup ? '.' : ', and select your area.')); return; }
  const notes = document.getElementById('coNotes').value.trim();
  const total = cart.reduce((s,c) => s+c.price*c.qty, 0);
  const orderLines = cart.map(c => `  • ${c.name} x${c.qty} — ${(c.price*c.qty).toFixed(3)} KWD`).join('\n');
  let address = '';
  if (!isPickup) {
    const area = document.getElementById('coArea').value, block = document.getElementById('coBlock').value.trim(),
          street = document.getElementById('coStreet').value.trim(), house = document.getElementById('coHouse').value.trim(),
          floor = document.getElementById('coFloor').value.trim();
    address = [area, block&&'Block '+block, street&&'Street '+street, house, floor].filter(Boolean).join(', ');
  }
  const msg = [
    '💻 *CapsLock Computers Order* 💻', '',
    '👤 *Name:* ' + name, '📞 *WhatsApp:* ' + phone,
    isPickup ? '🏪 *Fulfilment:* Store Pick Up' : '📍 *Delivery Address:* ' + address,
    notes ? '📝 *Notes:* ' + notes : '', '',
    '🛒 *Order:*', orderLines, '',
    '💰 *Total: ' + total.toFixed(3) + ' KWD*', '',
    'Please confirm my order. Thank you!'
  ].filter(l => l !== null).join('\n');
  deductStock(cart);
  saveOrderToSupabase({ name, phone, address: isPickup ? 'PICK UP' : address, notes, items: cart.map(c=>({name:c.name,sku:getProductSku(c.id),qty:c.qty,price:c.price})), total });
  window.open('https://wa.me/96597656372?text=' + encodeURIComponent(msg), '_blank');
  cart = []; updateCartUI(); renderProducts();
  const nudgeHtml = !_authUser ? `<div class="order-nudge"><p><i class="fa fa-info-circle"></i> Create a free account to track this order.</p><button onclick="document.getElementById('checkoutOverlay').classList.remove('open');openAuthModal('signup')">Create Account &rarr;</button></div>` : '';
  document.getElementById('coBody').innerHTML = `<div class="co-success"><i class="fab fa-whatsapp"></i><h3>Order Sent!</h3>
    <p>Your order has been sent to CapsLock Computers on WhatsApp.<br/>We will confirm and arrange delivery shortly.<br/><br/><strong>Thank you, ${name}!</strong></p>
    ${nudgeHtml}<br/><button class="btn btn-primary" onclick="document.getElementById('checkoutOverlay').classList.remove('open');document.getElementById('coBody').innerHTML=origCoBody">Continue Shopping</button></div>`;
});

let origCoBody = '';
window.addEventListener('load', () => { origCoBody = document.getElementById('coBody').innerHTML; });

function $on(id, evt, fn) { var el = document.getElementById(id); if (el) el.addEventListener(evt, fn); }
window.addEventListener('scroll', () => document.getElementById('header').classList.toggle('scrolled', window.scrollY > 40));
$on('hamburger',       'click', () => document.getElementById('nav').classList.toggle('open'));
$on('cartBtn',         'click', openCart);
$on('mobCartFab',      'click', openCart);
$on('closeCart',       'click', () => document.getElementById('cartModal').classList.remove('open'));
$on('cartModal',       'click', e => { if (e.target === document.getElementById('cartModal')) document.getElementById('cartModal').classList.remove('open'); });
$on('checkoutBtn',     'click', openCheckout);
$on('closeCheckout',   'click', () => document.getElementById('checkoutOverlay').classList.remove('open'));
$on('checkoutOverlay', 'click', e => { if (e.target === document.getElementById('checkoutOverlay')) document.getElementById('checkoutOverlay').classList.remove('open'); });
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => { activeFilter = pill.dataset.filter; syncCatNav(activeFilter); renderProducts(); });
});
document.getElementById('searchInput').addEventListener('input', renderProducts);
// Sitelinks search box (schema.org SearchAction in index.html) — a Google
// result can deep-link straight into a query on this site via ?q=.
try {
  var _qp = new URLSearchParams(location.search).get('q');
  if (_qp) document.getElementById('searchInput').value = _qp;
} catch(e) {}
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('formSuccess').classList.add('show');
  e.target.reset();
  setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 4000);
});

renderProducts();
loadSBData();
setTimeout(() => { initBuildSlots(); }, 400);

// ── Scroll fade-in observer ──────────────────────────────────────────────────
(function() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.product-card, .cat-card, .feature-card, .section-header, .about-grid, .contact-grid, .feat-card')
    .forEach(el => { el.classList.add('fade-in-up'); obs.observe(el); });
})();

function applyCatBgs() {
  try {
    var bgs = JSON.parse(localStorage.getItem('capslock_cat_bgs') || '{}');
    document.querySelectorAll('.cat-card[data-cat]').forEach(card => {
      var slug = card.dataset.cat; if (bgs[slug]) card.style.backgroundImage = "url('" + bgs[slug] + "')";
    });
  } catch(e) {}
}
applyCatBgs();

function fillMarquee() {
  var track = document.querySelector('.marquee-track'); if (!track) return;
  var origHTML = track.innerHTML, singleW = track.scrollWidth; if (!singleW) return;
  var vw = window.innerWidth || 1280, copies = Math.max(3, Math.ceil(vw / singleW) + 2);
  var half = ''; for (var i = 0; i < copies; i++) half += origHTML;
  track.innerHTML = half + half;
  track.style.animationDuration = Math.round((singleW * copies) / 100) + 's';
}
fillMarquee();

var _lang = 'en';
var _T = {
  en: {
    nav_home:'Home', nav_about:'About', nav_products:'Products', nav_contact:'Contact',
    cart_label:' Cart',
    hero_tag:'<i class="fa fa-laptop"></i> Kuwait\'s #1 Laptop &amp; PC Store',
    hero_h1:'Built for <span>Speed.</span><br/>Built for <span>Kuwait.</span>',
    hero_p:'Laptops, desktops, monitors, components, peripherals and accessories — everything you need to work, game and create. Repairs available. Delivered fast across Kuwait.',
    hero_shop:'Shop Now',
    stat_products:'Products', stat_genuine:'Genuine', stat_delivery:'Delivery',
    cat_tag:'Browse by Type', cat_h2:'Shop by <span class="orange">Category</span>',
    cat_power:'Laptops', cat_hand:'Desktops', cat_fasteners:'Monitors', cat_safety:'Components',
    cat_measuring:'Peripherals', cat_cutting:'Accessories',
    prod_tag:'Full Catalog', prod_h2:'Our <span class="orange">Products</span>',
    prod_search:'Search laptops, monitors, RAM...',
    no_results:'No products found. Try a different search.',
    cart_title:'Your Cart', cart_empty:'Your cart is empty.',
    cart_total_label:'Total:', cart_wa:'Request Quote on WhatsApp',
    feat_delivery_h:'Fast Delivery', feat_delivery_p:'Same-day delivery in Kuwait City.',
    feat_genuine_h:'100% Genuine', feat_genuine_p:'All products sourced from authorised distributors.',
    feat_advice_h:'Expert Advice', feat_advice_p:'Our tech experts help you choose the right device.',
    feat_repair_h:'Repair Services', feat_repair_p:'Professional laptop & PC repair by certified technicians.',
    contact_tag:'Get In Touch', contact_h2:'We\'re Here to <span class="orange">Help</span>',
    contact_p:'Need a laptop or PC part? Repair service? Our team is ready in Arabic and English.',
    contact_loc_label:'Location', contact_email_label:'Email',
    contact_phone_label:'Phone / WhatsApp', contact_hours_label:'Working Hours',
    contact_hours:'Sat-Thu: 9 AM - 9 PM',
    form_name:'Full Name', form_name_ph:'Ahmed Al-Mutairi',
    form_phone:'Phone / WhatsApp', form_email:'Email', form_need:'What do you need?',
    form_msg:'Message', form_msg_ph:'Tell us what laptop, PC parts or repair you need...',
    form_send:'Send Message', form_success:'Message sent! We will get back to you shortly.',
    form_opt1:'General Enquiry', form_opt2:'Bulk / Business Order', form_opt3:'Product Availability',
    form_opt4:'Repair Service', form_opt5:'Delivery Information', form_opt6:'Other',
    about_tag:'Who We Are', about_h2:'Your Trusted <span class="orange">Tech</span> Partner',
    about_badge:'Kuwait',
    about_p1:'CapsLock Computers is Kuwait\'s trusted destination for laptops, desktops, components, peripherals and accessories.',
    about_p2:'We stock only genuine, quality-tested products with competitive prices and professional repair services.',
    about_f1:'100% genuine, quality-tested products', about_f2:'Expert advice in Arabic and English',
    about_f3:'Same-day delivery within Kuwait', about_f4:'Bulk pricing for businesses and schools',
    about_f5:'Professional laptop & PC repair services', about_cta:'Contact Us',
    footer_desc:'Kuwait\'s trusted supplier of laptops, PCs and tech accessories since 2024.',
    footer_nav:'Navigation', footer_cats:'Categories', footer_support:'Support',
    footer_trade:'Business Accounts', footer_bulk:'Bulk Orders', footer_delivery_info:'Delivery Info',
    footer_returns:'Returns Policy', footer_tech:'Repair Services',
    footer_copy:'2024 CapsLock Computers. All rights reserved. Kuwait.',
    intro_tag:'Welcome to CapsLock Computers',
    intro_h2:'Kuwait\'s Go-To <span class="orange">Laptop & PC</span> Store — Open 7 Days',
    intro_p:'CapsLock Computers supplies laptops, desktops, monitors, components, peripherals and accessories to individuals, businesses and schools across Kuwait.',
    intro_c1:'100+ Products In Stock', intro_c2:'Same-Day Kuwait Delivery',
    intro_c3:'Bulk & Business Pricing', intro_c4:'Arabic & English Support',
    intro_cta_text:'Call Us: XXXX XXXX',
    co_title:'Complete Your Order', co_order_sum:'Order Summary', co_your_details:'Your Details',
    co_delivery_addr:'Delivery Address', co_total_label:'Total Amount',
    co_full_name:'Full Name *', co_wa_num:'WhatsApp Number *', co_area:'Area *',
    co_block:'Block', co_street:'Street', co_house:'House / Building',
    co_floor:'Floor / Apt', co_notes:'Notes', co_submit:'Send Order on WhatsApp',
    back_btn:'Back to Products', lang_switch:'عربي',
    mq_items:['Laptops','Desktops','Monitors','Components','Peripherals','Accessories','Repairs','Gaming','Networking']
  },
  ar: {
    nav_home:'الرئيسية', nav_about:'من نحن', nav_products:'المنتجات', nav_contact:'اتصل بنا',
    cart_label:' سلة',
    hero_tag:'<i class="fa fa-laptop"></i> المتجر الأول للابتوب والكمبيوتر في الكويت',
    hero_h1:'مصنوع للسرعة.<br/>مصنوع لـ<span>الكويت.</span>',
    hero_p:'لابتوب، كمبيوتر، شاشات، مكونات وإكسسوارات — كل ما تحتاجه للعمل والألعاب. توصيل سريع في الكويت.',
    hero_shop:'تسوق الآن',
    stat_products:'منتج', stat_genuine:'أصلي', stat_delivery:'توصيل',
    cat_tag:'تصفح حسب النوع', cat_h2:'تسوق حسب <span class="orange">الفئة</span>',
    cat_power:'لابتوبات', cat_hand:'كمبيوترات', cat_fasteners:'شاشات', cat_safety:'مكونات',
    cat_measuring:'ملحقات', cat_cutting:'إكسسوارات',
    prod_tag:'الكتالوج الكامل', prod_h2:'<span class="orange">منتجاتنا</span>',
    prod_search:'ابحث عن لابتوب، شاشة، رام...',
    no_results:'لا توجد منتجات. جرب بحثاً مختلفاً.',
    cart_title:'سلة التسوق', cart_empty:'سلة التسوق فارغة.',
    cart_total_label:'المجموع:', cart_wa:'طلب عرض سعر عبر واتساب',
    feat_delivery_h:'توصيل سريع', feat_delivery_p:'توصيل في نفس اليوم داخل مدينة الكويت.',
    feat_genuine_h:'100% أصلي', feat_genuine_p:'جميع المنتجات من موزعين معتمدين.',
    feat_advice_h:'نصيحة متخصصة', feat_advice_p:'خبراؤنا يساعدونك في اختيار الجهاز المناسب.',
    feat_repair_h:'خدمات إصلاح', feat_repair_p:'إصلاح احترافي للابتوب والكمبيوتر.',
    contact_tag:'تواصل معنا', contact_h2:'نحن هنا <span class="orange">لمساعدتك</span>',
    contact_p:'تحتاج لابتوب أو قطع غيار؟ خدمة إصلاح؟ فريقنا جاهز بالعربية والإنجليزية.',
    contact_loc_label:'الموقع', contact_email_label:'البريد الإلكتروني',
    contact_phone_label:'الهاتف / واتساب', contact_hours_label:'ساعات العمل',
    contact_hours:'السبت-الخميس: 9 ص - 9 م',
    form_name:'الاسم الكامل', form_name_ph:'أحمد المطيري',
    form_phone:'الهاتف / واتساب', form_email:'البريد الإلكتروني', form_need:'ماذا تحتاج؟',
    form_msg:'الرسالة', form_msg_ph:'أخبرنا بما تحتاجه...',
    form_send:'إرسال الرسالة', form_success:'تم إرسال الرسالة! سنتواصل معك قريباً.',
    form_opt1:'استفسار عام', form_opt2:'طلب بالجملة', form_opt3:'توفر منتج',
    form_opt4:'خدمة إصلاح', form_opt5:'معلومات التوصيل', form_opt6:'أخرى',
    about_tag:'من نحن', about_h2:'شريكك الموثوق في <span class="orange">التقنية</span>',
    about_badge:'الكويت',
    about_p1:'فايف ستارز إنفوتك هي وجهتك الموثوقة في الكويت للابتوب والكمبيوتر والمكونات والإكسسوارات.',
    about_p2:'نحن نخزن منتجات أصلية بأسعار تنافسية مع خدمات إصلاح احترافية.',
    about_f1:'منتجات 100% أصلية ومختبرة', about_f2:'نصائح بالعربية والإنجليزية',
    about_f3:'توصيل في نفس اليوم داخل الكويت', about_f4:'أسعار الجملة للشركات والمدارس',
    about_f5:'خدمات إصلاح لابتوب وكمبيوتر احترافية', about_cta:'اتصل بنا',
    footer_desc:'مورد موثوق للابتوب والكمبيوتر والإكسسوارات التقنية في الكويت منذ 2024.',
    footer_nav:'التنقل', footer_cats:'الفئات', footer_support:'الدعم',
    footer_trade:'حسابات الأعمال', footer_bulk:'الطلبات بالجملة', footer_delivery_info:'معلومات التوصيل',
    footer_returns:'سياسة الإرجاع', footer_tech:'خدمات الإصلاح',
    footer_copy:'2024 فايف ستارز إنفوتك. جميع الحقوق محفوظة. الكويت.',
    intro_tag:'مرحباً بك في فايف ستارز إنفوتك',
    intro_h2:'المتجر الأول للابتوب والكمبيوتر في الكويت — <span class="orange">مفتوح 7 أيام</span>',
    intro_p:'فايف ستارز إنفوتك توفر لابتوبات وكمبيوترات وشاشات ومكونات وإكسسوارات للأفراد والشركات والمدارس في الكويت.',
    intro_c1:'100+ منتج في المخزون', intro_c2:'توصيل في نفس اليوم بالكويت',
    intro_c3:'أسعار الجملة والأعمال', intro_c4:'دعم بالعربية والإنجليزية',
    intro_cta_text:'اتصل بنا: XXXX XXXX',
    co_title:'أكمل طلبك', co_order_sum:'ملخص الطلب', co_your_details:'بياناتك',
    co_delivery_addr:'عنوان التوصيل', co_total_label:'المبلغ الإجمالي',
    co_full_name:'الاسم الكامل *', co_wa_num:'رقم واتساب *', co_area:'المنطقة *',
    co_block:'القطعة', co_street:'الشارع', co_house:'المنزل / المبنى',
    co_floor:'الطابق / الشقة', co_notes:'ملاحظات', co_submit:'إرسال الطلب عبر واتساب',
    back_btn:'العودة للمنتجات', lang_switch:'EN',
    mq_items:['لابتوبات','كمبيوترات','شاشات','مكونات','ملحقات','إكسسوارات','إصلاح','ألعاب','شبكات']
  }
};

function setLang(lang) {
  _lang = lang; localStorage.setItem('capslock_lang', lang);
  var html = document.documentElement; html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  var btn = document.getElementById('langBtn'); if (btn) btn.textContent = _T[lang].lang_switch;
  var t = _T[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => { var k = el.getAttribute('data-i18n'); if (t[k] !== undefined) el.textContent = t[k]; });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { var k = el.getAttribute('data-i18n-html'); if (t[k] !== undefined) el.innerHTML = t[k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { var k = el.getAttribute('data-i18n-placeholder'); if (t[k] !== undefined) el.placeholder = t[k]; });
  if (typeof renderProducts === 'function') renderProducts();
  var track = document.querySelector('.marquee-track');
  if (track && t.mq_items) {
    track.innerHTML = t.mq_items.map(item => '<span>' + item + '</span><span class="sep">&nbsp;&#183;&nbsp;</span>').join('');
    fillMarquee();
  }
}
function toggleLang() { setLang(_lang === 'en' ? 'ar' : 'en'); }

(function() {
  var saved = localStorage.getItem('capslock_lang');
  if (saved && saved !== 'en') setLang(saved);
})();

// ── WISHLIST ──────────────────────────────────────────────────────────────────
function getWishlist() { try { return JSON.parse(localStorage.getItem('capslock_wishlist') || '[]'); } catch(e) { return []; } }
function saveWishlist(list) { localStorage.setItem('capslock_wishlist', JSON.stringify(list)); }
function isWishlisted(id) { return getWishlist().includes(id); }
function toggleWishlist(id, e) {
  if (e) e.stopPropagation();
  var wl = getWishlist(), idx = wl.indexOf(id);
  if (idx >= 0) wl.splice(idx, 1); else wl.push(id);
  saveWishlist(wl); updateWishlistBadge(); renderProducts();
  showToast(idx >= 0 ? 'Removed from wishlist' : 'Added to wishlist ♥');
}
function updateWishlistBadge() {
  var count = getWishlist().length;
  var badge = document.getElementById('navWishlistBadge');
  if (badge) { badge.textContent = count; badge.style.display = count ? 'inline' : 'none'; }
}
function openWishlist() {
  var wl = getWishlist(), body = document.getElementById('wishlistBody');
  var badge = document.getElementById('wishlistBadge');
  if (badge) { badge.textContent = wl.length; badge.style.display = wl.length ? 'inline' : 'none'; }
  if (!wl.length) { body.innerHTML = '<div style="text-align:center;padding:40px;color:#aaa"><i class="fa fa-heart" style="font-size:32px;margin-bottom:12px;display:block"></i><p>Your wishlist is empty.</p></div>'; }
  else {
    body.innerHTML = wl.map(id => {
      var p = getAllProducts().find(x => x.id === id); if (!p) return '';
      return `<div class="wl-item"><img src="${p.img}" alt="${p.name}" onerror="imgError(this)" />
        <div class="wl-item-info"><strong>${p.name}</strong><span>${p.price.toFixed(3)} KWD</span></div>
        <div class="wl-item-actions">
          <button class="wl-add-btn" onclick="addToCart(${p.id});showToast('Added to cart')"><i class="fa fa-cart-plus"></i> Add</button>
          <button class="wl-remove-btn" onclick="toggleWishlist(${p.id});openWishlist()"><i class="fa fa-times"></i></button>
        </div></div>`;
    }).join('');
  }
  document.getElementById('wishlistOverlay').classList.add('open');
}
function closeWishlist() { document.getElementById('wishlistOverlay').classList.remove('open'); }
updateWishlistBadge();

// ── RECENTLY VIEWED ───────────────────────────────────────────────────────────
function trackRecentlyViewed(id) {
  var rv = JSON.parse(localStorage.getItem('capslock_rv') || '[]');
  rv = rv.filter(x => x !== id); rv.unshift(id); rv = rv.slice(0, 8);
  localStorage.setItem('capslock_rv', JSON.stringify(rv)); renderRecentlyViewed();
}
function renderRecentlyViewed() {
  var rv = JSON.parse(localStorage.getItem('capslock_rv') || '[]');
  var sec = document.getElementById('recentlyViewedSection'), grid = document.getElementById('recentlyViewedGrid');
  if (!rv.length || !grid) { if (sec) sec.style.display = 'none'; return; }
  sec.style.display = 'block';
  grid.innerHTML = rv.map(id => {
    var p = getAllProducts().find(x => x.id === id); if (!p) return '';
    return `<div class="rv-card" onclick="openProduct(${p.id})">
      <img src="${p.img}" alt="${p.name}" onerror="imgError(this)" />
      <div class="rv-name">${p.name}</div>
      <div class="rv-price">${p.price.toFixed(3)} KWD</div></div>`;
  }).join('');
}
renderRecentlyViewed();

// ── TOAST ─────────────────────────────────────────────────────────────────────
function showToast(msg, duration) {
  var el = document.getElementById('toastMsg'); if (!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), duration || 2500);
}

// ── WA CHAT ───────────────────────────────────────────────────────────────────
function openWAChat() { window.open('https://wa.me/96597656372?text=Hello!%20I%20need%20help%20with%20a%20product.', '_blank'); }

// ── SHARE PRODUCT ─────────────────────────────────────────────────────────────
function shareProduct(id) {
  var p = getAllProducts().find(x => x.id === id); if (!p) return;
  var msg = '💻 *' + p.name + '*\nPrice: ' + p.price.toFixed(3) + ' KWD\n\nFrom CapsLock Computers — Kuwait\'s #1 Laptop & PC Store.\n' + window.location.href;
  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

// ── BULK QUOTE ────────────────────────────────────────────────────────────────
function openBulkQuote() {
  document.getElementById('bulkRows').innerHTML = '';
  addBulkRow(); addBulkRow();
  document.getElementById('bulkOverlay').classList.add('open');
}
function closeBulkQuote() { document.getElementById('bulkOverlay').classList.remove('open'); }
function addBulkRow() {
  var prods = getAllProducts();
  var opts = prods.map(p => `<option value="${p.id}">${p.name} — ${p.price.toFixed(3)} KWD</option>`).join('');
  var row = document.createElement('div'); row.className = 'bulk-row';
  row.innerHTML = `<select class="bulk-select"><option value="">-- Select Product --</option>${opts}</select>
    <input type="number" class="bulk-qty" placeholder="Qty" min="1" value="1" />
    <button onclick="this.parentElement.remove()" class="bulk-remove-btn"><i class="fa fa-times"></i></button>`;
  document.getElementById('bulkRows').appendChild(row);
}
function sendBulkQuote() {
  var rows = document.querySelectorAll('.bulk-row'), lines = [];
  rows.forEach(row => {
    var sel = row.querySelector('.bulk-select'), qty = row.querySelector('.bulk-qty');
    if (sel && sel.value && qty && qty.value) {
      var p = getAllProducts().find(x => x.id == sel.value);
      if (p) lines.push('• ' + p.name + ' × ' + qty.value);
    }
  });
  if (!lines.length) { alert('Please select at least one product.'); return; }
  var name = document.getElementById('bulkName').value.trim();
  var phone = document.getElementById('bulkPhone').value.trim();
  var msg = '📋 *Bulk Quote Request — CapsLock Computers*\n\n' +
    (name ? '👤 Name: ' + name + '\n' : '') + (phone ? '📞 Phone: ' + phone + '\n' : '') +
    '\n*Items:*\n' + lines.join('\n') + '\n\nPlease provide pricing. Thank you!';
  window.open('https://wa.me/96597656372?text=' + encodeURIComponent(msg), '_blank');
  closeBulkQuote();
}

// ── ORDER TRACKER ─────────────────────────────────────────────────────────────
function openOrderTracker() { document.getElementById('trackOverlay').classList.add('open'); }
function closeOrderTracker() { document.getElementById('trackOverlay').classList.remove('open'); }
function switchOrderTab(tab) {
  document.getElementById('panelTrack').style.display  = tab === 'track'  ? '' : 'none';
  document.getElementById('panelCancel').style.display = tab === 'cancel' ? '' : 'none';
  document.getElementById('tabTrack').classList.toggle('active',  tab === 'track');
  document.getElementById('tabCancel').classList.toggle('active', tab === 'cancel');
}
async function trackOrder() {
  var phone = document.getElementById('trackPhone').value.trim();
  var err = document.getElementById('trackErr'), res = document.getElementById('trackResults');
  if (!phone) { err.textContent = 'Please enter your WhatsApp number.'; return; }
  err.textContent = ''; res.innerHTML = '<p style="color:#aaa;font-size:13px">Searching...</p>';
  var { data, error } = await sbFetch(SB_URL + '/rest/v1/capslock_orders?customer_phone=eq.' + encodeURIComponent(phone) + '&order=created_at.desc&select=*', { headers: SB_H });
  if (error || !data || !data.length) { res.innerHTML = '<p style="color:#aaa;font-size:13px;text-align:center;padding:20px">No orders found for this number.</p>'; return; }
  res.innerHTML = data.map(o => {
    var dt = o.created_at ? new Date(o.created_at).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
    var sc = {'pending':'🟡 Pending','confirmed':'🔵 Confirmed','delivered':'🟢 Delivered','cancelled':'🔴 Cancelled'}[o.status] || o.status;
    return `<div class="track-order-card"><div class="toc-header"><span class="toc-status">${sc}</span><span class="toc-date">${dt}</span></div>
      <div class="toc-total">${parseFloat(o.total||0).toFixed(3)} KWD</div></div>`;
  }).join('');
}
async function findCancelOrders() {
  var phone = document.getElementById('cancelPhone').value.trim();
  var err = document.getElementById('cancelErr'), res = document.getElementById('cancelResults');
  if (!phone) { err.textContent = 'Please enter your WhatsApp number.'; return; }
  err.textContent = ''; res.innerHTML = '<p style="color:#aaa;font-size:13px">Searching...</p>';
  var { data, error } = await sbFetch(SB_URL + '/rest/v1/capslock_orders?customer_phone=eq.' + encodeURIComponent(phone) + '&status=eq.pending&order=created_at.desc&select=*', { headers: SB_H });
  if (error || !data || !data.length) { res.innerHTML = '<p style="color:#aaa;font-size:13px;text-align:center;padding:20px">No cancellable orders found.</p>'; return; }
  var hourAgo = Date.now() - 3600000;
  var cancellable = data.filter(o => new Date(o.created_at).getTime() > hourAgo);
  if (!cancellable.length) { res.innerHTML = '<p style="color:#aaa;font-size:13px;text-align:center;padding:20px">No orders within the last hour. Please contact us on WhatsApp.</p>'; return; }
  res.innerHTML = cancellable.map(o => {
    var dt = new Date(o.created_at).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
    return `<div class="track-order-card"><div class="toc-header"><span class="toc-status">🟡 Pending</span><span class="toc-date">${dt}</span></div>
      <div class="toc-total">${parseFloat(o.total||0).toFixed(3)} KWD</div>
      <button class="toc-cancel-btn" onclick="cancelOrder(${o.id},this)"><i class="fa fa-times-circle"></i> Cancel Order</button></div>`;
  }).join('');
}
async function cancelOrder(id, btn) {
  btn.disabled = true; btn.textContent = 'Cancelling...';
  var { error } = await sbFetch(SB_URL + '/rest/v1/capslock_orders?id=eq.' + id, {
    method: 'PATCH', headers: { ...SB_H, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({ status: 'cancelled' })
  });
  if (error) { btn.textContent = 'Error — try again'; btn.disabled = false; }
  else { btn.closest('.track-order-card').innerHTML = '<div style="text-align:center;padding:16px;color:var(--green);font-weight:700"><i class="fa fa-check-circle"></i> Order cancelled successfully.</div>'; }
}

// ── REVIEWS ───────────────────────────────────────────────────────────────────
var _reviewProductId = null, _reviewStars = 0;
function openReviews(id) {
  _reviewProductId = id; _reviewStars = 0;
  var p = getAllProducts().find(x => x.id === id);
  document.getElementById('reviewProductName').textContent = p ? p.name : '';
  renderStarInput(); loadReviews(id);
  document.getElementById('reviewOverlay').classList.add('open');
}
function closeReviews() { document.getElementById('reviewOverlay').classList.remove('open'); }
function renderStarInput() {
  var div = document.getElementById('reviewStarInput');
  div.innerHTML = [1,2,3,4,5].map(i =>
    `<i class="fa fa-star" style="font-size:24px;cursor:pointer;color:${i<=_reviewStars?'#f5c518':'#ddd'};margin-right:4px" onclick="setReviewStar(${i})" onmouseover="hoverStar(${i})" onmouseout="renderStarInput()"></i>`
  ).join('');
}
function setReviewStar(n) { _reviewStars = n; renderStarInput(); }
function hoverStar(n) {
  var div = document.getElementById('reviewStarInput');
  div.innerHTML = [1,2,3,4,5].map(i =>
    `<i class="fa fa-star" style="font-size:24px;cursor:pointer;color:${i<=n?'#f5c518':'#ddd'};margin-right:4px" onclick="setReviewStar(${i})" onmouseover="hoverStar(${i})" onmouseout="renderStarInput()"></i>`
  ).join('');
}
async function loadReviews(id) {
  var list = document.getElementById('reviewList');
  var { data, error } = await sbFetch(SB_URL + '/rest/v1/capslock_reviews?product_id=eq.' + id + '&order=created_at.desc&select=*', { headers: SB_H });
  if (error || !data || !data.length) { list.innerHTML = '<p style="color:#aaa;font-size:13px;text-align:center;padding:20px">No reviews yet. Be the first!</p>'; return; }
  list.innerHTML = data.map(r => {
    var stars = [1,2,3,4,5].map(i => `<i class="fa fa-star" style="color:${i<=r.rating?'#f5c518':'#ddd'};font-size:13px"></i>`).join('');
    return `<div class="rev-item"><div class="rev-item-header"><strong>${r.name||'Anonymous'}</strong>${stars}</div><p>${r.comment||''}</p></div>`;
  }).join('');
}
async function submitReview() {
  var err = document.getElementById('reviewErr'), btn = document.getElementById('reviewSubmitBtn');
  var name = document.getElementById('reviewNameInput').value.trim();
  var comment = document.getElementById('reviewCommentInput').value.trim();
  if (!_reviewStars) { err.textContent = 'Please select a star rating.'; return; }
  if (!comment) { err.textContent = 'Please write a comment.'; return; }
  err.textContent = ''; btn.disabled = true; btn.textContent = 'Submitting...';
  var { error } = await sbFetch(SB_URL + '/rest/v1/capslock_reviews', {
    method: 'POST', headers: { ...SB_H, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({ product_id: _reviewProductId, name: name||'Anonymous', rating: _reviewStars, comment })
  });
  btn.disabled = false; btn.innerHTML = '<i class="fa fa-paper-plane"></i> Submit Review';
  if (error) { err.textContent = 'Failed to submit. Try again.'; }
  else { document.getElementById('reviewCommentInput').value = ''; _reviewStars = 0; renderStarInput(); showToast('Review submitted! Thank you.'); loadReviews(_reviewProductId); }
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
var _authUser = null, _userProfile = null;
const SB_AUTH_URL = SB_URL + '/auth/v1';
const SB_AUTH_H = { 'apikey': SB_KEY, 'Content-Type': 'application/json' };
function openAuthModal(tab) { switchAuthTab(tab||'login'); document.getElementById('authOverlay').classList.add('open'); }
function closeAuthModal() { document.getElementById('authOverlay').classList.remove('open'); }
function switchAuthTab(tab) {
  document.getElementById('authLoginForm').style.display  = tab === 'login'  ? '' : 'none';
  document.getElementById('authSignupForm').style.display = tab === 'signup' ? '' : 'none';
  document.getElementById('authForgotForm').style.display = tab === 'forgot' ? '' : 'none';
  document.getElementById('authTabLogin').classList.toggle('active',  tab === 'login');
  document.getElementById('authTabSignup').classList.toggle('active', tab === 'signup');
  document.getElementById('authErr').textContent = ''; document.getElementById('authOk').textContent = '';
}
async function doAuthLogin() {
  var email = document.getElementById('authLoginEmail').value.trim(), pass = document.getElementById('authLoginPass').value;
  if (!email || !pass) { document.getElementById('authErr').textContent = 'Please fill in all fields.'; return; }
  document.getElementById('authLoginBtn').textContent = 'Signing in...';
  var { data, error } = await sbFetch(SB_AUTH_URL + '/token?grant_type=password', {
    method: 'POST', headers: SB_AUTH_H, body: JSON.stringify({ email, password: pass })
  });
  document.getElementById('authLoginBtn').innerHTML = '<i class="fa fa-sign-in-alt"></i> Sign In';
  if (error || !data || !data.user) { document.getElementById('authErr').textContent = 'Invalid email or password.'; return; }
  _authUser = data.user; closeAuthModal(); updateAuthUI(); loadProfile(); showToast('Welcome back!');
}
async function doAuthSignup() {
  var name = document.getElementById('authSignupName').value.trim(), email = document.getElementById('authSignupEmail').value.trim(), pass = document.getElementById('authSignupPass').value;
  if (!name || !email || !pass) { document.getElementById('authErr').textContent = 'Please fill in all fields.'; return; }
  if (pass.length < 6) { document.getElementById('authErr').textContent = 'Password must be at least 6 characters.'; return; }
  document.getElementById('authSignupBtn').textContent = 'Creating...';
  var { data, error } = await sbFetch(SB_AUTH_URL + '/signup', {
    method: 'POST', headers: SB_AUTH_H, body: JSON.stringify({ email, password: pass, data: { name } })
  });
  document.getElementById('authSignupBtn').innerHTML = '<i class="fa fa-user-plus"></i> Create Account';
  if (error || !data || !data.user) { document.getElementById('authErr').textContent = (error || 'Signup failed. Try again.'); return; }
  document.getElementById('authOk').textContent = 'Account created! Please check your email to confirm.';
}
async function doAuthForgot() {
  var email = document.getElementById('authForgotEmail').value.trim();
  if (!email) { document.getElementById('authErr').textContent = 'Please enter your email.'; return; }
  document.getElementById('authForgotBtn').textContent = 'Sending...';
  await sbFetch(SB_AUTH_URL + '/recover', { method: 'POST', headers: SB_AUTH_H, body: JSON.stringify({ email }) });
  document.getElementById('authForgotBtn').innerHTML = '<i class="fa fa-envelope"></i> Send Reset Link';
  document.getElementById('authOk').textContent = 'Reset link sent if this email exists.';
}
function doSignOut() { _authUser = null; _userProfile = null; updateAuthUI(); closeAcctModal(); showToast('Signed out.'); }
function updateAuthUI() {
  var isLoggedIn = !!_authUser;
  var signInLink = document.getElementById('navSignIn'), myOrdersLink = document.getElementById('navMyOrders');
  if (signInLink) signInLink.style.display = isLoggedIn ? 'none' : '';
  if (myOrdersLink) myOrdersLink.style.display = isLoggedIn ? '' : 'none';
  var label = document.getElementById('acctBtnLabel');
  if (label) label.textContent = isLoggedIn ? (_authUser.user_metadata&&_authUser.user_metadata.name ? _authUser.user_metadata.name.split(' ')[0] : 'Account') : 'Sign In';
}
function onAccountBtnClick() { if (_authUser) openAcctModal(); else openAuthModal('login'); }
function openAcctModal() {
  var av = document.getElementById('acctAvatar'), un = document.getElementById('acctUname'), ue = document.getElementById('acctUemail');
  if (_authUser) {
    var name = _authUser.user_metadata&&_authUser.user_metadata.name ? _authUser.user_metadata.name : 'User';
    if (av) av.textContent = name[0].toUpperCase(); if (un) un.textContent = name; if (ue) ue.textContent = _authUser.email||'';
  }
  switchAcctTab('profile'); loadProfile();
  document.getElementById('acctOverlay').classList.add('open');
}
function closeAcctModal() { document.getElementById('acctOverlay').classList.remove('open'); }
function switchAcctTab(tab) {
  document.getElementById('acctProfilePane').style.display = tab === 'profile' ? '' : 'none';
  document.getElementById('acctOrdersPane').style.display  = tab === 'orders'  ? '' : 'none';
  document.getElementById('acctTabProfile').classList.toggle('active', tab === 'profile');
  document.getElementById('acctTabOrders').classList.toggle('active',  tab === 'orders');
  if (tab === 'orders') loadMyOrders();
}
async function loadProfile() {
  if (!_authUser) return;
  var key = 'fsi_profile_' + _authUser.id;
  var saved = localStorage.getItem(key);
  if (saved) { try { _userProfile = JSON.parse(saved); } catch(e){} }
  if (_userProfile) {
    if (document.getElementById('profName')) document.getElementById('profName').value = _userProfile.name||'';
    if (document.getElementById('profPhone')) document.getElementById('profPhone').value = _userProfile.phone||'';
    if (document.getElementById('profAddress')) document.getElementById('profAddress').value = _userProfile.address||'';
  }
}
async function doSaveProfile() {
  if (!_authUser) return;
  _userProfile = { name: document.getElementById('profName').value.trim(), phone: document.getElementById('profPhone').value.trim(), address: document.getElementById('profAddress').value.trim() };
  localStorage.setItem('fsi_profile_' + _authUser.id, JSON.stringify(_userProfile));
  document.getElementById('acctOk').textContent = 'Profile saved!';
  setTimeout(() => { document.getElementById('acctOk').textContent = ''; }, 2500);
}
async function loadMyOrders() {
  if (!_authUser) return;
  var list = document.getElementById('myOrdersList');
  list.innerHTML = '<div class="myo-loading"><i class="fa fa-spinner fa-spin"></i> Loading...</div>';
  var phone = _userProfile && _userProfile.phone ? _userProfile.phone : '';
  if (!phone) { list.innerHTML = '<p style="font-size:13px;color:#aaa;text-align:center;padding:20px">Add your phone number in Profile to see orders.</p>'; return; }
  var { data, error } = await sbFetch(SB_URL + '/rest/v1/capslock_orders?customer_phone=eq.' + encodeURIComponent(phone) + '&order=created_at.desc&select=*', { headers: SB_H });
  if (error || !data || !data.length) { list.innerHTML = '<p style="font-size:13px;color:#aaa;text-align:center;padding:20px">No orders found.</p>'; return; }
  list.innerHTML = data.map(o => {
    var dt = o.created_at ? new Date(o.created_at).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
    var sc = {'pending':'🟡 Pending','confirmed':'🔵 Confirmed','delivered':'🟢 Delivered','cancelled':'🔴 Cancelled'}[o.status]||o.status;
    return `<div class="myo-item"><div class="myo-header"><span class="myo-status">${sc}</span><span class="myo-date">${dt}</span></div>
      <div class="myo-total">${parseFloat(o.total||0).toFixed(3)} KWD</div></div>`;
  }).join('');
}
function dismissLoginPrompt() { document.getElementById('loginPrompt').style.display = 'none'; localStorage.setItem('fsi_lp_dismissed','1'); }
(function() { if (!localStorage.getItem('fsi_lp_dismissed')) { setTimeout(() => { var lp = document.getElementById('loginPrompt'); if (lp && !_authUser) lp.style.display = 'flex'; }, 8000); } })();

async function saveOrderToSupabase(order) {
  await sbFetch(SB_URL + '/rest/v1/capslock_orders', {
    method: 'POST', headers: { ...SB_H, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({ customer_name: order.name, customer_phone: order.phone, address: order.address, notes: order.notes, items: JSON.stringify(order.items), total: order.total, status: 'pending' })
  });
}



