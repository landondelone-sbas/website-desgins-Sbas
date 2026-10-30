# Launch Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the existing marketing homepage at the site root while retaining the under-construction page at a renamed URL.

**Architecture:** Swap the static HTML entry page names so GitHub Pages serves the real homepage as `/`. Update all site Home links and remove noindex directives from the live pages.

**Tech Stack:** Static HTML, GitHub Pages (root of `main`).

**Spec:** `CLAUDE.md`, “Under-construction mode (active)” and “Hosting and deploys”.

## Global Constraints

- Preserve the under-construction page as `under-construction.html`; do not delete it.
- Do not commit or push unless explicitly asked.
- Do not modify the root `CNAME` file.
- Use `https://sbasinfo.ai` as the canonical base URL.

## Review Focus

- Root path resolves to the real homepage: verify `index.html` is the former `home.html`.
- Archived page remains available: verify `under-construction.html` retains its video/still page content.
- Site navigation is consistent: verify every Home/logo link points to `index.html`.
- Live pages are discoverable: verify live HTML pages no longer contain `noindex, nofollow`.
- Hosting configuration is preserved: verify `CNAME` is unchanged.

---

### Task 1: Promote the homepage and archive the placeholder

**Files:**
- Rename: `index.html` to `under-construction.html`
- Rename: `home.html` to `index.html`
- Modify: `about.html`, `faq.html`, `payment.html`, `privacy.html`, `terms.html`
- Modify: homepage and other live page links/robots metadata

**Interfaces:**
- Produces the site-root homepage at `/` and retains the prior placeholder at `/under-construction.html`.

- [ ] Rename the existing files, preserving their contents.
- [ ] Change all Home/logo links across the live pages to `index.html`.
- [ ] Remove `noindex, nofollow` from all live pages, including the homepage, FAQ, booking, privacy, and terms pages.
- [ ] Verify `index.html` is the real homepage, `under-construction.html` still contains the placeholder page, no live Home links target `home.html`, no live pages are noindexed, and `CNAME` is unchanged.
