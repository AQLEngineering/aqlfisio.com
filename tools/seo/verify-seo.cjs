const fs=require('node:fs'),assert=require('node:assert/strict');
const pages=JSON.parse(fs.readFileSync('seo-pages.json','utf8'));
for(const file of ['index.html',...pages.map(p=>p.slug+'/index.html')]){
 const html=fs.readFileSync(file,'utf8');
 const expected='https://www.aqlfisio.com/'+(file==='index.html'?'':file.replace('index.html',''));
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: exactly one main heading`);
 assert.ok(html.includes(`<link rel="canonical" href="${expected}">`),`${file}: canonical URL`);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title?.includes('AQL Fisio')&&title.length<80);
 const description=html.match(/<meta name="description" content="([^"]+)"/)[1];assert.ok(description.length>=100&&description.length<=175);
 assert.ok(!html.includes('noindex'));assert.ok(!/src="file:/.test(html));
 assert.ok(!/opacity:0(?:;|")/.test(html),'Content must remain visible without JavaScript');
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(graph['@context'],'https://schema.org');assert.ok(graph['@graph'].some(e=>e['@type']==='WebPage'));
 for(const page of pages)assert.ok(html.includes(`href="/${page.slug}/"`),`${file}: ${page.slug} discoverable`);
 assert.ok(!html.includes('href="#" class="text-sm text-slate-400'),'Legal footer links must resolve');
 assert.ok(!/<video[^>]*class="move-demo-video"/.test(html) && !html.includes('Afonso'), 'Keep the removed patient recording off the website');
}
const vm=require('node:vm');const bundle=fs.readFileSync('index.js','utf8');const helper=bundle.slice(bundle.indexOf('function aqlCampaignActive('),bundle.indexOf('const aqlCampaignPrices='));const campaign=vm.runInNewContext(helper+';aqlCampaignActive');assert.equal(campaign(new Date('2026-12-31T23:59:59Z')),true);assert.equal(campaign(new Date('2027-01-01T00:00:00Z')),false);
const home=fs.readFileSync('index.html','utf8');
assert.ok(home.includes('<div id="root"><div'),'Homepage contains the prerendered site');
for(const term of ['19,90','39,90','69,90','99,90','1024 MB','LIA','calendly.com/alberto-moreira-aqlengineering/30min'])assert.ok(home.includes(term),`Missing ${term}`);
for(const plan of ['gabinete','clinic','care','intelligence'])assert.ok(home.includes(`signup=1&amp;plan=${plan}`));
const app=JSON.parse(home.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'].find(e=>e['@type']==='SoftwareApplication');
assert.deepEqual(app.offers.map(o=>o.price),new Date()<new Date('2027-01-01T00:00:00Z')?['14.90','29.90','49.90','69.90']:['19.90','39.90','69.90','99.90']);assert.ok(!app.aggregateRating&&!app.review);
const sitemap=fs.readFileSync('sitemap.xml','utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,11);
assert.ok(fs.readFileSync('robots.txt','utf8').includes('Sitemap: https://www.aqlfisio.com/sitemap.xml'));
console.log('SEO checks passed: six complete HTML pages, unique metadata, canonical URLs, structured data, plans, purchase links, sitemap and robots.');

assert.ok(home.includes('data-lia-animation')&&home.includes('Dados fictícios'.toUpperCase()));
assert.ok(!home.includes('<video')&&!home.includes('/assets/lia/lia-demo-crop.mp4'),'Replace the old video in the rendered page');
assert.ok(home.includes('data-lia-play')&&home.includes('data-lia-scene="2"'),'The demonstration can be paused and explored');
assert.ok(!/fetch\s*\(/.test(fs.readFileSync('lia-animation.js','utf8')),'The chat animation must remain browser-local');

assert.ok(home.includes('id="lia-actions"')&&home.includes('href="/#lia-actions"'),'LIA Actions is present and discoverable');
for(const text of ['Aprovar tarefa de exemplo','Dados fictícios','o contacto e o reagendamento são manuais'])assert.ok(home.includes(text),text);
assert.ok(!/fetch\s*\(/.test(fs.readFileSync('lia-actions-demo.js','utf8')),'The website demo must not call external services');

for(const file of ['index.html',...pages.map(p=>p.slug+'/index.html')]){
 const html=fs.readFileSync(file,'utf8');
 assert.ok(html.includes('class="aql-site-nav"'),file+': shared navigation');
 assert.ok(html.includes('class="aql-platform-menu"'),file+': platform dropdown');
 assert.ok(!html.includes('class="site-header"'),file+': no legacy navigation');
}

assert.ok(home.indexOf('id="experiencia-cliente"')<home.indexOf('id="pricing"'),'Customer testimony precedes pricing');
assert.ok(home.includes('Gisela Silva')&&home.includes('5 meses de utilização'));
const story=fs.readFileSync('clientes/gabinete-saude-bem-estar-espinho/index.html','utf8');
assert.ok(story.includes('O desafio inicial')&&story.includes('aria-label="Navegação principal"'));
assert.ok(fs.readFileSync('assets/customer-story-20261109.css','utf8').includes('prefers-reduced-motion'));
