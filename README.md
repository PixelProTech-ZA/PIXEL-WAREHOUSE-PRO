# Pixel Warehouse Pro

A browser-based warehouse receiving, inventory, and barcode-scanning app by **PixelProTech Solutions**. No build step, no backend, no frameworks — HTML, CSS, and vanilla JavaScript, running entirely in the browser with local data storage and offline support.

---

## File structure

```
pixel-warehouse-pro/
├── pixel-warehouse-pro.html   ← the app (open this file / set as your host's entry point)
├── manifest.json              ← PWA manifest (install metadata, icons, brand colors)
├── sw.js                      ← service worker (offline caching of the app shell)
├── icons/                     ← app icon set, all required PWA sizes
│   ├── icon-72.png … icon-512.png
│   └── icon-maskable-192.png, icon-maskable-512.png
└── README.md                  ← this file
```

All four items (`pixel-warehouse-pro.html`, `manifest.json`, `sw.js`, `icons/`) must stay in the **same folder**, at the same relative paths, or the manifest/service worker/icons won't resolve.

---

## Quick start

**Just want to look at it?**
Double-click `pixel-warehouse-pro.html`. It opens straight in your browser. Note: PWA install and offline caching won't activate over `file://` — see below.

**Want the real installable app, with offline support?**
Service workers and install prompts require HTTPS (or `localhost`). Upload this whole folder to any static host and open it there:

- GitHub Pages
- Netlify / Vercel / Cloudflare Pages (drag-and-drop the folder)
- Your own server over HTTPS

Once hosted, open it in Chrome or Edge — you'll see an install icon in the address bar, or use the in-app **"Install App"** button.

---

## What's fully functional

| Module | Notes |
|---|---|
| **Receiving** | Live camera barcode scanning via the browser's native Barcode Detection API (Chrome/Edge), plus manual code entry. Units-per-box math is automatic. |
| **Products** | Full CRUD, stored in IndexedDB. CSV import/export. |
| **Inventory** | Live stock levels, low-stock flags, permanent movement/audit log. |
| **Locations** | Capacity tracking with utilization %. |
| **Reports** | Inventory valuation, printable / exportable to PDF via the browser print dialog. |
| **Branding Center** | Upload a logo, set primary/secondary/accent colors and display font — re-skins the sidebar, dashboard, and printed reports live. |
| **Scanner (quick lookup)** | Scan or type any code to see stock, location, and history instantly. |
| **PWA** | Installable, offline-capable app shell with a custom icon set. |

Click **"Load Live Demo"** on the landing page to seed sample products, locations, and movement history.

## What's on the roadmap (not built yet)

Shown honestly in the sidebar as roadmap placeholders rather than faked screens: Dispatch, Purchase Orders, Suppliers/Customers CRM, Transfers & Returns, Cycle Count, the interactive Warehouse Map, Analytics, and the Warehouse Academy. The IndexedDB schema and movement-log pattern are set up so these can be built on top without reworking the data layer.

---

## Data & storage

- **Products, Locations, Movements** — IndexedDB, database name `pixelWarehousePro`
- **Branding/settings** — `localStorage`, key `pwp_branding`
- Everything is local to the browser/device. There is no server and no sync between devices — exporting/importing CSV is currently the way to move data between machines.
- Clearing site data/browser storage will erase all warehouse data. Export CSV backups regularly if you rely on this for real inventory.

## Browser support

- **Camera barcode scanning** needs the [Barcode Detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API) — currently Chrome/Edge on Android and desktop. Other browsers fall back automatically to manual code entry.
- **PWA install** — Chrome, Edge, and most Chromium-based browsers. Safari/iOS supports "Add to Home Screen" with more limited PWA behavior.
- Everything else (IndexedDB, camera access, CSV, printing) works in any modern browser.

## Rebranding for a client

Everything under **Branding & Settings** in the app is live-editable per business: logo, company details, and three brand colors. To change the *default* out-of-the-box colors (not per-user), edit the CSS custom properties at the top of `pixel-warehouse-pro.html` (`--safety`, `--safety-dark`, `--accent`) and the default values inside the `loadBranding()` function.

To swap the app icon set, replace the files in `icons/` (keep the same filenames and sizes) and update `manifest.json` if you add/remove sizes.

---

## Contact

**PixelProTech Solutions**
pixelprotechsolutions@gmail.com · 076 645 9348
Made in South Africa

© 2026 PixelProTech Solutions
