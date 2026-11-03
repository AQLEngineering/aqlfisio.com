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

## 2026.11.01.2 — adoption campaign

Monthly first-subscription campaign: Gabinete €14.90, Clinic €29.90, Care €49.90, Intelligence €69.90, all net of VAT. New orders through 31 December 2026, payment within their seven-day validity. The first twelve months start on actual payment confirmation; subsequent renewals and plan changes preserve the same guarantee end. Additional professionals, modules and credits keep their separate rates. Annual discounts do not stack. Existing subscriptions are not retroactively repriced.

The site uses date-aware cards and offers and retains the regular prices as reference. JSON-LD offers have a `priceValidUntil` date. A scheduled repository workflow rebuilds the initial public HTML after the campaign closes (1 January 2027), commits the snapshot and requests a Pages build with the repository's scoped workflow token. App eligibility ends automatically on the server; the workflow does not change existing customers' campaign entitlements. Patient records are unlimited; remote-follow-up active-patient allowances remain separate.

## 2026.11.01.3 — continuidade no hero

A frase «A clínica não termina quando o utente sai pela porta.» abre a homepage, com descrição explícita do software imediatamente abaixo. Título SEO, metadados, preços e ações existentes preservados. Secção de acompanhamento entre consultas com título próprio para evitar repetição.

## 2026.11.03.1 — LIA Actions

Destaque na página principal e navegação desktop/mobile para recuperação de consultas canceladas. Exemplo interativo com dados fictícios, três horários ilustrativos e aprovação de uma tarefa de exemplo. O contacto e o reagendamento mantêm-se manuais. A funcionalidade real está nas tarefas da receção do AQL Fisio 1.15.216, em clínicas com o módulo de automações ativo.

### 2026.11.03.2

Espaçamento do título em mobile e indicação do acesso pelo centro de tarefas, com automações ativas.

## 2026.11.03.3 — conversa animada da LIA

O vídeo foi substituído por um painel animado com o aspeto da LIA: cabeçalho azul, conversa, indicação de preparação da resposta e cartões de agenda, proposta de marcação e resumo clínico. Exemplos com dados fictícios, escolha manual de cenário, pausa/reprodução, respeito por movimento reduzido e pausa fora do ecrã. A demonstração não faz pedidos aos serviços da aplicação.
