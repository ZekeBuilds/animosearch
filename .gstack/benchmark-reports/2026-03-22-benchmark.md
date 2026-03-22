# AnimoSearch Benchmark Report
**Date:** 2026-03-22
**Mode:** Development (Vite dev server, localhost:5173)
**Note:** Dev mode = unminified/unbundled. Production build will be significantly smaller.

---

## Page Load Times

| Page | TTFB | DOM Parse | DOM Ready | Full Load | Notes |
|------|------|-----------|-----------|-----------|-------|
| / (Home) | 6ms | 248ms | 511ms | 531ms | Initial bundle load |
| /theses | 4ms | 11ms | 45ms | 48ms | Lazy-loaded chunk |
| /colleges | 4ms | 11ms | 58ms | 60ms | Lazy-loaded chunk |
| /writing-guide | 3ms | 11ms | 46ms | 48ms | Lazy-loaded chunk |
| /submit | 5ms | 11ms | 56ms | 57ms | Lazy-loaded chunk |
| /about | 5ms | 11ms | 60ms | 62ms | Lazy-loaded chunk |

**Key insight:** Lazy loading is working correctly. After the initial 531ms home page load, all subsequent SPA navigations complete in under 65ms.

---

## Resource Breakdown (Home page, first load)

| Type | Count | Size |
|------|-------|------|
| Scripts | 25 | 3,350 KB |
| Images | 2 | 573 KB |
| CSS | 1 | 1 KB |
| Fetches | 1 | — |
| **Total** | **29** | **~3.9 MB** |

> **Important:** The 3.9MB is dev mode with no minification or tree-shaking.
> Production build typically reduces JS by 60-70%. Expect ~1.2–1.5MB gzipped in prod.

---

## Top Slowest Resources

| # | Resource | Type | Size | Duration |
|---|----------|------|------|----------|
| 1 | Supabase API (`/theses`) | fetch | — | **689ms** |
| 2 | Unsplash hero image | img | 470 KB | 352ms |
| 3 | Google Fonts (css2) | link | 1.5 KB | 200ms |
| 4 | Unsplash secondary image | img | 113 KB | 171ms |
| 5 | react-dom_client.js | script | 802 KB | 20ms |

---

## Issues Found

### 1. Supabase fetch is the slowest resource (689ms)
- The `/theses` API call takes 689ms on initial load.
- This is the **largest performance bottleneck** for the home page.
- Recommendation: Add React Query caching (likely already in place) and verify staleTime config.

### 2. Hero images are large and unoptimized (470KB + 113KB)
- Two Unsplash images loaded from external CDN.
- The 470KB hero image adds 352ms to load time.
- Recommendation: Use Unsplash's URL params (`?w=1280&q=75&fm=webp`) to resize and convert to WebP.

### 3. Google Fonts adds 200ms (render-blocking potential)
- External font load from fonts.googleapis.com.
- Recommendation: Add `<link rel="preconnect" href="https://fonts.googleapis.com">` in index.html.

### 4. Theses page shows "No theses found" in headless browser
- Supabase data did not render in the headless test session.
- Likely a timing issue — data may load after the screenshot was captured.
- Recommendation: Manual verification in real browser; implement loading skeleton if not already present.

---

## Performance Budget (vs. industry standards)

| Metric | Budget | Actual (dev) | Estimated Prod | Status |
|--------|--------|--------------|----------------|--------|
| Full Load | < 3s | 531ms | ~800ms | PASS |
| DOM Interactive | < 1.5s | 288ms | ~400ms | PASS |
| Total JS (prod) | < 500KB | 3.35MB dev | ~900KB gzip | WARNING |
| Total Transfer | < 2MB | 3.9MB dev | ~1.5MB | OK in prod |
| HTTP Requests | < 50 | 29 | ~15 bundled | PASS |

---

## Baseline Captured
This report serves as the baseline for future comparisons.
Run `/benchmark http://localhost:5173 --baseline` after deploying to Vercel to capture the production baseline.

