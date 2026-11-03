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
const sitemap=fs.readFileSync('sitemap.xml','utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,10);
assert.ok(fs.readFileSync('robots.txt','utf8').includes('Sitemap: https://www.aqlfisio.com/sitemap.xml'));
console.log('SEO checks passed: six complete HTML pages, unique metadata, canonical URLs, structured data, plans, purchase links, sitemap and robots.');

assert.ok(home.includes('class="lia-demo-player"')&&home.includes('preload="none"'));
assert.ok(home.includes('dados fictícios')&&home.includes('/assets/lia/lia-demo-crop.mp4'));
for(const asset of ['assets/lia/lia-demo-crop.mp4','assets/lia/lia-demo-crop-poster.jpg']) assert.ok(fs.statSync(asset).size>1000);

const tour=fs.readFileSync('smart-demo.section.html','utf8');
const tourCss=fs.readFileSync('assets/aql-smart-demo-20261103.css','utf8');
const tourJs=fs.readFileSync('assets/aql-smart-demo-20261103.js','utf8');
assert.ok(home.includes('id="experimente-aql-fisio"'),'Interactive tour visible in prerendered HTML');
assert.ok(home.includes('<template id="aql-sd-template">'),'React remount template available');
assert.equal((home.match(/<section id="experimente-aql-fisio"/g)||[]).length,2,'One visible tour and one inert template');
assert.ok(home.includes('href="/assets/aql-smart-demo-20261103.css"'));
assert.ok(home.includes('src="/assets/aql-smart-demo-20261103.js"'));
assert.ok(home.indexOf('<section id="experimente-aql-fisio"')<home.indexOf('<section id="pricing"'),'Tour precedes pricing');
assert.ok(tour.includes('data-sd-tab="lia"')&&tour.includes('data-sd-tab="tasks"')&&tour.includes('data-sd-tab="rules"'));
assert.ok(tourJs.includes('MutationObserver')&&tourJs.includes('textContent = trigger')===false);
assert.ok(tourJs.includes('textContent = "Quando: "')&&tourJs.includes('textContent = "Então: "'));
assert.ok(tourCss.includes('prefers-reduced-motion')&&tourCss.includes('max-width:600px'));
console.log('Interactive tour checks passed: SEO visibility, tabs, hydration restoration, safe rule simulation and responsive CSS.');
