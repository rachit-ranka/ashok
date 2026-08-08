# ASTR Healthcare – Copilot Instructions

## Project Overview

ASTR Healthcare is a static marketing and product discovery website for Ashok Traders' pharmaceutical distribution business in Madhya Pradesh. Two pages: **index.html** (company marketing) and **catalog.html** (searchable medicine database with CSV-driven inventory).

**Key Tech Stack:**

- Tailwind CSS (CDN-loaded) + inline styles
- PapaParse for CSV parsing
- No build process or framework

---

## Architecture & Data Flow

### Page Structure

- **index.html**: Marketing-focused landing page with sections for hero, brands carousel, divisions, coverage, hospitals, partnerships
- **catalog.html**: Product discovery interface that loads `assets/Ashok Stock.csv` client-side

### Data Source

- CSV file at `assets/Ashok Stock.csv` with columns: `name`, `Salt` (drug composition), `company`, `mrp`
- Loaded via PapaParse with columns remapped to lowercase (`salt`)
- No backend API; filtering happens entirely in browser

### Color System

Custom Tailwind palette in `<script>` tags:

```
brand: #1F3C88 (primary blue)
brand-hover: #2E5BFF
cyan: #00B4D8 (accents)
pink: #FF4D8D (not used, placeholder)
dark: #1F2937, medium: #6B7280, light-grey: #F5F7FA, soft-grey: #E5E7EB
```

Fonts: Inter (body), Poppins (display)

---

## Critical Patterns

### Animation System

- **Fade-up**: Elements with `.fade-up` trigger on scroll via `IntersectionObserver`
- Delays: `.fade-up-delay-1` through `.fade-up-delay-4` (0.1s increments)
- Applied extensively to hero, stats, cards, sections—ensures progressive reveal as user scrolls

### Search & Filtering (catalog.html only)

1. CSV loads → `allData` array normalized
2. User input → debounced (150ms) search across name/salt/company
3. Filter chips allow scoped search (all/name/salt/company)
4. Render: batch 50 items, "Load More" pagination
5. Highlight matching terms inline with `.highlight` class

### Contact Section

- No third-party form service (Web3Forms was removed — it was leaking submitted data)
- Contact section (index.html) directs visitors to `mailto:` and `wa.me` links instead of a hosted form
- Phone/email/WhatsApp links appear both in the Contact Info card and the CTA card

### Mobile Menu

- Hidden on lg+ screens via `lg:hidden` Tailwind utilities
- Toggle via `#mobile-toggle` button; closes on link click
- Separate mobile/desktop nav structures in same HTML

---

## Key Files & Responsibilities

| File                        | Role           | Notes                                            |
| --------------------------- | -------------- | ------------------------------------------------ |
| `index.html`                | Marketing hub  | 830+ lines; 12+ sections; email/WhatsApp contact |
| `catalog.html`              | Product search | 410 lines; CSV parsing; debounced search         |
| `assets/Ashok Stock.csv`    | Inventory      | Data source; columns: name, Salt, company, mrp   |
| `assets/ashok-collatorals/` | Brand assets   | Logos, company images; preloaded for performance |
| `assets/logos/`             | Partner logos  | ~12 pharma brand logos for carousel              |

---

## Developer Workflows

### Local Testing

- No build step; open `.html` files directly in browser or serve locally (`python -m http.server`)
- CSV preload happens automatically via PapaParse `download: true`

### Adding Content

- **Marketing sections**: Edit HTML directly; follow existing fade-up + grid patterns
- **New medicines**: Add rows to CSV; no HTML changes needed; search updates automatically

### Updating Catalog

- Modify `assets/Ashok Stock.csv`: ensure columns `name`, `Salt`, `company`, `mrp` match parser
- If columns change: update PapaParse `.map()` callback and search logic
- Total medicine count auto-displays in `#total-count` span

### Styling Changes

- Colors: Update `tailwind.config.theme.extend.colors` in both HTML files (duplicated)
- Animations: Modify `.fade-up`, `@keyframes` in `<style>` block
- Responsive: Use Tailwind breakpoints (sm, md, lg); test mobile at 375px+

---

## Integration Points

### External Dependencies

- **Tailwind CSS**: CDN (`https://cdn.tailwindcss.com`) loaded in head
- **PapaParse**: CDN (`https://cdnjs.cloudflare.com/ajax/libs/PapaParse`) for CSV parsing
- **Google Fonts**: Preconnected for Inter/Poppins (async load)
- **WhatsApp**: Floating button and contact CTA link to hardcoded number (update in both files)

### Cross-File Coordination

- Both pages share identical nav + footer structure → changes in one should mirror the other
- Color/font config duplicated in both → keep in sync manually
- Logo paths hardcoded (`assets/logos/*.png|svg|jpeg`) → validate before adding new brands

---

## Common Workflows

### Adding a New Partner Brand

1. Place logo in `assets/logos/` (PNG, SVG, or JPEG)
2. Add entry to `partnerLogos` array in index.html script:
   ```js
   { src: 'assets/logos/newbrand.png', alt: 'New Brand', h: 'h-10' }
   ```
3. Height class (`h-*`) controls logo size in carousel; adjust for proportions

### Updating Contact Info

- Phone: `+919425058725` (appears in contact section + WhatsApp link)
- Email: `ashoktrders72@gmail.com`
- Address: LG 54 Dawa Bazar, RNT Marg, Indore 452001
- WhatsApp number: `919584258725` (update in floating button + contact CTA links)

### Fixing Search Performance

- If catalog slows: reduce `BATCH_SIZE` (currently 50) in catalog.html
- PapaParse skips empty rows automatically via `skipEmptyLines: true`
- Debounce is 150ms; raise if CPU-bound

---

## Debugging Notes

- **CSV not loading**: Check browser Network tab; ensure path `assets/Ashok Stock.csv` is correct; verify CORS if served remotely
- **Search not working**: Open DevTools → verify `allData` populated; check CSV column names match parser (case-sensitive: `name`, `Salt`, `company`, `mrp`)
- **Animations not showing**: Confirm `.fade-up` elements are in viewport during scroll; check `IntersectionObserver` support (IE11 needs polyfill)

---

## Next Steps & Maintenance

- Periodically audit CSV for duplicate medicines or missing fields
- Test catalog search with 5000+ medicine entries; consider server-side search if performance degrades
- Keep partner logo dimensions consistent for carousel aesthetics
