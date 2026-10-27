# Alven Homz – Premium Real Estate & Interiors Website

A fully static, frontend-only website for **Alven Homz**. It covers New Projects, Resale Properties, Rental Properties and Alven Homz Interiors, and is built with **Next.js (App Router) + TypeScript + Tailwind CSS** using **static export**.

Every page is pre-rendered to HTML at build time. Search, filters, galleries and forms run in the browser. Nothing runs on the server: there is no backend, database, API route or Node.js process in production, so the site runs on plain shared hosting such as **A2 Hosting**.

---

## Features

- **Pages:** Home, New Projects (list and detail), Resale (list and detail), Rentals (list and detail), Interiors, About Us, Contact Us and a custom 404.
- **Search and filters, all client-side:** location search with autocomplete, city, budget or rent range, BHK, property type, project status, furnishing and tenant preference. Results can be sorted (recommended, newest, price up or down) and are paginated. Filters live in the URL, so a filtered view can be shared or bookmarked.
- **Detail pages:** photo gallery with a lightbox, price and configuration table, amenities, floor plans, a Google Maps embed (no key needed), nearby places, developer information and similar listings.
- **Rental pages** show monthly rent, security deposit and maintenance separately, plus the total move-in cost.
- **Enquiries without a backend:**
  - Validated forms open **WhatsApp** or an **email draft** with the visitor's details already filled in.
  - Click-to-call (`tel:`) buttons, a floating WhatsApp button and a sticky Call / WhatsApp / Enquire bar on mobile detail pages.
  - Nothing is stored or submitted by the website, and the forms say so.
- **SEO:**
  - Build-time `<title>`, meta description, canonical URL, Open Graph and Twitter tags on every page.
  - JSON-LD structured data (RealEstateAgent, RealEstateListing, BreadcrumbList).
  - `sitemap.xml` and `robots.txt` are generated at build time.
- **Performance:**
  - Images are pre-optimized WebP in two sizes: 1400 px for galleries and 720 px for cards.
  - Lazy loading, per-route code splitting and self-hosted Google Fonts via `next/font`.
- **Accessibility:** semantic HTML, a skip link, keyboard-friendly menus, comboboxes, tabs and galleries, labelled form fields with inline errors, and support for `prefers-reduced-motion`.

---

## Project structure

```
src/
  app/                        Routes (App Router)
    page.tsx                  Home
    new-projects/             Listing + [slug] detail (generateStaticParams)
    resale-properties/        Listing + [slug] detail
    rental-properties/        Listing + [slug] detail
    interiors/  about-us/  contact-us/
    sitemap.ts  robots.ts  not-found.tsx  layout.tsx  globals.css
  components/                 Reusable UI (Header, Footer, ListingCard, ListingExplorer,
                              Gallery, LeadForm, FloorPlans, MapEmbed, …)
  data/                       ← All website content lives here
    site.json                 Company name, domain, phone, WhatsApp, email, address, hours, socials
    newProjects.json
    resaleProperties.json
    rentalProperties.json
    interiors.json            Interior services, portfolio and design process
    testimonials.json
    locations.json            "Popular Locations" tiles
  lib/                        Types, data helpers, formatting, WhatsApp/mailto builders, SEO helpers
public/
  images/                     WebP photos (name.webp = large, name-sm.webp = card size)
  .htaccess                   Apache config (copied into the build output)
  favicon.svg
```

---

## Editing content

All content comes from the JSON files in `src/data/`. Edit them, then rebuild.

1. **Company details:** edit `src/data/site.json`.
   - Set `url` to your real domain, e.g. `https://www.alvenhomz.com`. It's used for canonical URLs, Open Graph and the sitemap.
   - Set `phone`, `whatsapp` (country code plus number, digits only, e.g. `919876543210`), `email`, `address`, `hours` and `social`.
2. **Add a property:** copy an existing object in the relevant JSON file and change the values.
   - `slug` must be unique and URL-safe. It becomes the page URL, e.g. `/resale-properties/<slug>/`.
   - Prices are plain numbers in rupees, e.g. `14500000` for ₹1.45 Cr.
   - `images` lists file names in `public/images/` without the extension. Each photo needs both `name.webp` (about 1400 px wide) and `name-sm.webp` (about 720 px).
   - `featured: true` shows the listing on the homepage.
   - Amenity names that match the list in `src/components/Amenities.tsx` get a matching icon. Any other name gets a generic check icon.
3. **Floor plans:** add an `"image": "my-plan"` field to a floor plan entry to show the real plan. Without it, a schematic "indicative layout" is drawn.
4. **Images:** convert photos to WebP before adding them, for example with [Squoosh](https://squoosh.app) or `cwebp -q 70`.

### Sample content — replace before launch

The included listings, prices, developer names, RERA numbers and testimonials are **sample data for demonstration**. They are marked `"isSample": true`, which shows a notice on each detail page, and a site-wide footer note is controlled by `"sampleContentNotice": true` in `site.json`.

Before going live:

- Replace them with verified information.
- Set `isSample` to `false` (or remove it) on each real listing.
- Set `sampleContentNotice` to `false`.
- Replace the placeholder team on the About page (`src/app/about-us/page.tsx`).
- Replace the sample photography with your own.

---

## Local development

Requires Node.js 20 or newer (only on your computer, not on the server).

```bash
npm install
npm run dev        # http://localhost:3000
```

## Production build

```bash
npm install
npm run build
```

This creates the **`out/`** folder, which is the complete static website:

```
out/
├── index.html
├── 404.html
├── .htaccess
├── new-projects/index.html
├── new-projects/<slug>/index.html
├── resale-properties/…
├── rental-properties/…
├── interiors/index.html
├── about-us/index.html
├── contact-us/index.html
├── _next/static/…        (JS, CSS, fonts)
├── images/…
├── favicon.svg
├── sitemap.xml
└── robots.txt
```

To preview the static build locally:

```bash
npm run preview
```

---

## Deploying to A2 Hosting (cPanel shared hosting)

No Node.js app, PM2, Docker or VPS is needed.

1. **Build locally:** run `npm install`, then `npm run build`.
2. **Zip the contents of `out/`** (the files inside it, not the folder itself).
   - macOS / Linux: `cd out && zip -r ../alvenhomz-site.zip . && cd ..`
   - Windows: open `out`, select everything (including `.htaccess`), right-click, then **Send to → Compressed (zipped) folder**.
3. **Log in to cPanel**, open **File Manager** and go to **`public_html`**.
   - For an add-on domain, use that domain's document root instead.
   - Back up or remove any old site files there, such as a default `index.html`.
4. **Upload** `alvenhomz-site.zip` into `public_html`, right-click it and choose **Extract**.
   - Make sure `index.html` ends up directly inside `public_html`, not in a subfolder.
   - Delete the zip afterwards.
5. **Check that `.htaccess` is present.** In File Manager, open **Settings → Show Hidden Files (dotfiles)**. You should see `public_html/.htaccess`. If it's missing, upload `out/.htaccess` separately.
6. **Connect the domain and enable HTTPS.**
   - Point the domain's nameservers or A record to A2 Hosting.
   - In cPanel, go to **SSL/TLS Status** and run **AutoSSL** (free Let's Encrypt).
   - `.htaccess` already forces HTTPS. If you need to load the site before SSL is active, temporarily comment out the three "Force HTTPS" lines.
   - To force `www` or the bare domain, uncomment one of the two optional blocks in `.htaccess`.
7. **Verify:**
   - Open every menu page, a few property detail pages and `/sitemap.xml`.
   - Refresh the browser on nested pages such as `/new-projects/aurelia-skyvue-hebbal/`. They should load directly.
   - Visit a non-existent URL. You should see the Alven Homz 404 page.
   - Test the WhatsApp, Call and Email buttons on a phone.
8. **Search Console (optional):**
   - Add the domain in Google Search Console.
   - Submit `https://your-domain/sitemap.xml`.

**Updating the site later:** edit the JSON or images, run `npm run build` again, and re-upload the contents of `out/`, overwriting the old files. Old files in `_next/static` can be deleted safely because each build uses new hashed file names.

**Hosting in a subfolder** (e.g. `example.com/alvenhomz/`):

1. Add `basePath: "/alvenhomz"` to `next.config.ts`.
2. Prefix image paths in `src/lib/utils.ts` (`img()`) with the same base path.
3. Update `ErrorDocument` in `.htaccess` to match.

---

## Notes on SEO

Every page's HTML, including titles, descriptions, canonical tags, Open Graph tags and structured data, is generated at **build time**. Search engines and social previews get complete HTML without running JavaScript.

Listing pages with filters in the URL (e.g. `?city=Pune&bhk=2`) are filtered in the browser. They all share the canonical URL of the base listing page.
