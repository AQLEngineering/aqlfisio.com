#!/usr/bin/env bash
set -euo pipefail
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_dir"
npm run build:seo
npm run check
deploy_dir="$(mktemp -d "${TMPDIR:-/tmp}/aqlfisio-publish.XXXXXX")"
git clone --depth 1 --branch main --single-branch https://github.com/AQLEngineering/aqlfisio.com.git "$deploy_dir/site"
node "$project_dir/stage-seo.cjs" "$deploy_dir/site"
cd "$deploy_dir/site"
baseline_sha="$(git rev-parse HEAD)"
git add assets/lia-actions-20261103.css assets/lia-actions-demo-20261103.js index.html assets/index-fisio-campaign-20261022.js assets/fisio-seo-20261101.css assets/lia website-version.txt robots.txt sitemap.xml .github/workflows/close-adoption-campaign.yml agenda-clinica processo-clinico exercicios-terapeuticos automacoes lia tools/seo
if git diff --cached --quiet; then
  echo 'Esta versão já se encontra publicada no repositório.'
  exit 0
fi
git diff --cached --stat
git fetch origin main
if [[ "$(git rev-parse origin/main)" != "$baseline_sha" ]]; then
  echo 'O site mudou durante a preparação. Nada foi publicado. Reveja a versão mais recente.' >&2
  exit 1
fi
git commit -m 'Website 2026.11.03.1: showcase LIA Actions and human-approved follow-up'
git push origin HEAD:main
echo 'Publicação enviada para https://www.aqlfisio.com/.'
