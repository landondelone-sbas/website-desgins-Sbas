# SBAS.info website

Static marketing site for SBAS.info (AI & automation). Live at **https://sbasinfo.ai**.

## Stack

- Plain HTML/CSS/JS. No build step, no `package.json`, no framework.
- Pages: `index.html` (under-construction page, see below), `home.html` (the real home page), `about.html`, `payment.html`. Shared styles in `styles.css`, shared behavior in `script.js`.
- `home.html` loads three.js from the unpkg CDN. Fonts come from Google Fonts.
- Site images live in `assets/`. The PNG logos in the repo root and the `SBAS.info logo` folder are source files, not what the pages load.
- Logo `<img>` tags use a cache-busting query string (`?v=2`). Bump it in every HTML file when a logo image changes.

## Under-construction mode (active)

- `https://sbasinfo.ai/` serves `index.html`, a self-contained under-construction page (inline CSS/JS, no links). It shows a muted autoplay video (`assets/under-construction.mp4`, ~20 s) over a still (`assets/under-construction.jpg`), a "Tap for sound" button, then fades to the still and shows a "Replay" button (replays from the start, with sound). If autoplay is blocked it shows the still with a "Tap to play" button. With reduced motion it shows only the still.
- The real site is unlinked but reachable for testing: `/home.html`, `/about.html`, `/payment.html`. They have `<meta name="robots" content="noindex, nofollow">`. They are not password-protected.
- The "Home"/logo links on those pages point to `home.html`, not `index.html`.
- The video was trimmed from the source with `crop=1072:1920:4:0` (the source has a 4 px black border on each side) and re-encoded with faststart. Keep the audio track.
- To go live: rename `index.html` to `under-construction.html` (or delete it), rename `home.html` to `index.html`, point the "Home"/logo links in `home.html`, `about.html` and `payment.html` back to `index.html`, and remove the noindex meta tag from all three.

## Hosting and deploys

- Hosted on **GitHub Pages**: repo `landondelone-sbas/website-desgins-Sbas`, branch `main`, folder `/` (branch-based "legacy" build).
- Pushing to `main` deploys automatically. Changes show up about 1-2 minutes after the push.
- Only commit and push when the user asks.

## Domain (sbasinfo.ai)

- Domain is registered at Wix. DNS is managed in Wix (nameservers `ns0.wixdns.net` / `ns1.wixdns.net`), but the site is **not** hosted on Wix.
- DNS records: four `A` records on the apex pointing to GitHub Pages (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) and a `www` CNAME to `landondelone-sbas.github.io`. Leave any MX, TXT and NS records alone.
- **Do not delete or edit the `CNAME` file** in the repo root (it contains `sbasinfo.ai`). Removing it drops the custom domain.
- HTTPS is enforced in GitHub Pages. `http://`, `www.sbasinfo.ai` and the old `github.io` URL all 301-redirect to `https://sbasinfo.ai/`.
- If the HTTPS certificate is ever missing or stuck after a domain change, remove the custom domain in Settings -> Pages and re-add it to restart provisioning.
- Always use `https://sbasinfo.ai` (no `www`) as the canonical base URL, for example in redirects, Stripe success/cancel URLs and Open Graph tags.

## Payments (Stripe) - not integrated yet

- `payment.html` has a "Stripe ready" placeholder (around the `stripe-ready-panel` / `#card-element` block). No Stripe code exists yet.
- The plan form is handled in `script.js` (the `[data-payment-form]` submit handler). It currently builds a contact request and does not charge anything.
- GitHub Pages is static, so never put a Stripe secret key in client code.
  - Fixed plans and prices: use Stripe Payment Links (no backend needed).
  - Variable amounts or extra metadata: use Stripe Checkout with a small serverless function (Vercel, Netlify or Cloudflare Workers).
- Stripe requires HTTPS, which is already on. Set the Stripe business URL to `https://sbasinfo.ai`.
