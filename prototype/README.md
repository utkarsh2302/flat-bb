# Tayal Envogue 2.0 — booking prototype

A clickable concept of Tayal Corp's online booking journey for Envogue 2.0
(PCMC Central), with a live builder CRM panel and the Tayal design system.
It is a single HTML file with its images; nothing to install.

Live: https://utkarsh2302.github.io/flat-bb/tayal/

## Files

| Path | What it is |
| --- | --- |
| `prototype/tayal-booking.html` | The source you edit (all HTML, CSS and JavaScript in one file) |
| `prototype/img/` | Renders, master layout, and every flat's plan + key plan (WebP) |
| `prototype/export-pages.sh` | Copies the prototype into `public/tayal/` for GitHub Pages |
| `public/tayal/` | Generated copy that GitHub Pages serves. Don't edit by hand |

## Open it in VS Code

1. Source Control → **Clone Repository** → `https://github.com/utkarsh2302/flat-bb`.
2. To view: open `public/tayal/index.html` in your browser, or install the
   **Live Server** extension, right-click `public/tayal/index.html` → *Open with Live Server*.

## Make a change and publish it

1. Edit `prototype/tayal-booking.html` (data such as wings, prices and
   amenities is near the top of the `<script>`).
2. Run `./prototype/export-pages.sh` in the VS Code terminal.
3. Commit and push to `main`. GitHub Pages redeploys in about two minutes.

## Presenting

Press **▶ Play demo** to auto-play the whole journey, or tap any step in the
left rail. **Restart** clears the demo. Progress is remembered per browser.

Project facts, renders and plans come from Tayal's brochure, floor-plan book and
tayalcorp.com. Availability, parking, upgrades, people and all integrations
(payment, KYC, Salesforce, WhatsApp) are simulated.
