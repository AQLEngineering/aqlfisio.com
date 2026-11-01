# AQL Fisio website — 2026.11.01.1

Commercial site at https://www.aqlfisio.com/, published through `AQLEngineering/aqlfisio.com` on GitHub Pages. This checkout follows the actual published website; the older `AQL-FISIO-WEBSITE` project must not replace it.

## This release

- Homepage contains complete visible product content in its initial HTML. Existing React behavior remains; entry animations no longer hide content before JavaScript executes.
- Title, description, canonical URL, Open Graph and Twitter metadata.
- JSON-LD Organization, WebSite, WebPage, SoftwareApplication and feature-page breadcrumbs. Monthly advertised prices are net of VAT; no invented ratings or reviews.
- Five static, responsive pages: `/agenda-clinica/`, `/processo-clinico/`, `/exercicios-terapeuticos/`, `/automacoes/`, `/lia/`.
- Footer links make the feature pages discoverable. Existing privacy/terms links now resolve to the legal pages.
- `robots.txt` allows public-page crawling, excludes build tools and declares `sitemap.xml`. Sitemap lists the homepage, five feature pages and four existing legal pages; unchanged legal pages have no fabricated modification date.
- Plans, purchase registration links and the existing 30-minute Calendly event preserved. Included clinic storage now matches the application (1024 MB, optional 5/10 GB).
- No clinical demonstration video was reintroduced.

## Build and check

```sh
npm ci --cache "${TMPDIR:-/tmp}/aqlfisio-build-npm-cache"
npm run build:seo
npm run check
```

`build-seo.cjs` adapts the published bundle to render the actual React components as static markup with a matching pinned React 18.2 renderer. It strips only the browser preload bootstrap and final mount call in a temporary module; it does not build or publish the old source project. The adapter fails if its entry markers or renderer version change. All components must render visible content on the server. Temporary files are removed after rendering.

Homepage template, bundle, text inputs, renderer, checks and pinned dependencies are versioned in `tools/seo` of the publication repository. Run these commands there when working directly from that repository. Update version/date and review content before preparing a later release.

## Publish

```sh
bash "/Users/moreira/Aql apps/proj/aqlfisio-pricing-update/publish.sh"
```

Publication uses a fresh checkout, stages only this release's files, preserves existing legal pages and assets, prevents version downgrade and stops if the branch moves during preparation. Watch the GitHub Pages run and verify the public version, generated pages, robots and sitemap before reporting success.

## Verification

Automated checks validate six complete HTML pages, metadata, canonical URLs, structured data, visible content, internal feature links, plan amounts and buy links. Local browser QA covered the preserved homepage, feature navigation, the agenda page at a narrow viewport and the LIA FAQ. No JavaScript errors were observed on the homepage.

The Google verification tag was preserved. Search Console opened its public sign-in landing page in this session: submitting the sitemap and inspecting index status require the owner's signed-in account. Technical eligibility and sitemap publication do not establish or guarantee Google indexation or search position.
