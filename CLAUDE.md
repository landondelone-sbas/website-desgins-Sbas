# SBAS.info website

Static marketing site for SBAS.info (AI & automation). Live at **https://sbasinfo.ai**.

## Stack

- Plain HTML/CSS/JS. No build step, no `package.json`, no framework.
- Pages: `index.html` (the homepage), `under-construction.html` (the retained under-construction page; see below), `about.html`, `payment.html` (the booking page), `faq.html` (expandable questions; instructions for adding one are in an HTML comment at the top of the list), `privacy.html`, `terms.html` (add phone-call and recording disclosures to the privacy page when the Twilio receptionist launches). Shared styles in `styles.css`, shared behavior in `script.js`.
- `home.html` loads three.js from the unpkg CDN. Fonts come from Google Fonts.
- Site images live in `assets/`. The PNG logos in the repo root and the `SBAS.info logo` folder are source files, not what the pages load.
- Logo `<img>` tags use a cache-busting query string (`?v=2`). Bump it in every HTML file when a logo image changes.

## Under-construction page (archived)

- `under-construction.html` retains the self-contained under-construction page (inline CSS/JS, no links). It shows a muted autoplay video (`assets/under-construction.mp4`, ~20 s) over a still (`assets/under-construction.jpg`), a "Tap for sound" button, then fades to the still and shows a "Replay" button (replays from the start, with sound). If autoplay is blocked it shows the still with a "Tap to play" button. With reduced motion it shows only the still.
- The homepage is `index.html`; "Home"/logo links on site pages point to it.
- The video was trimmed from the source with `crop=1072:1920:4:0` (the source has a 4 px black border on each side) and re-encoded with faststart. Keep the audio track.

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

## Booking model (no pricing, no payments)

- The site no longer lists prices or takes payment. Model: book a discovery call, then a custom plan per client. Audience: small and mid-sized businesses. Do not mention products other than what the owner approves (the 340B agent comes first, via pilots; do not name the IT help desk or risk assessment tool).
- `payment.html` (filename kept so links still work) is now the "Book a Discovery Call" page. Nav label is "Book a Call".
- The form is handled in `script.js` (the `[data-payment-form]` submit handler). If the form's `data-lead-url` attribute is empty it opens a `mailto:` draft to Larry and Landon (today's live behavior). When `data-lead-url` is set to the receptionist server's `/lead` address (see `SBAS/Receptionist`), it posts there, shows a thank-you message, and falls back to the email draft on any failure. A hidden `website` field is the spam trap; leave it empty and off-screen. Set `data-lead-url` only after the server is deployed, and update `privacy.html` at the same time.
- The "Trusted By" row is removed from `home.html` until real client names are approved. Do not invent client names.
- The footer phone number was removed because it was a `(555)` placeholder. Add the real number when the receptionist line exists.
