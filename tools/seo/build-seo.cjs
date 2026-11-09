const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{pathToFileURL}=require('node:url');
const root=__dirname,base='https://www.aqlfisio.com',version=process.env.AQL_SITE_VERSION||'2026.11.09.5';
const pages=JSON.parse(fs.readFileSync(path.join(root,'seo-pages.json'),'utf8'));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c');
const put=(name,content)=>{const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content.replace(/^[\t ]+$/gm,''))};
const organization={'@type':'Organization','@id':base+'/#organization',name:'AQL Engineering, Lda.',url:'https://www.aqlengineering.com/',logo:base+'/aql-fisio-mark.svg'};
const website={'@type':'WebSite','@id':base+'/#website',name:'AQL Fisio',url:base+'/',inLanguage:'pt-PT',publisher:{'@id':organization['@id']}};
function graph(title,description,url,extra=[]){return {'@context':'https://schema.org','@graph':[organization,website,{'@type':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'pt-PT',isPartOf:{'@id':website['@id']},about:{'@id':base+'/#software'}},...extra]};}
const campaignActive=new Date()>=new Date('2026-11-01T00:00:00Z')&&new Date()<new Date('2027-01-01T00:00:00Z');
const campaignPrices={Gabinete:'14.90',Clinic:'29.90',Care:'49.90',Intelligence:'69.90'};
const homeTitle='AQL Fisio | Software de Gestão para Clínicas de Fisioterapia';
const homeDescription='Simplifique a gestão da sua clínica de fisioterapia com o AQL Fisio. Agenda, processo clínico, exercícios, automações e inteligência artificial numa plataforma.';
const software={'@type':'SoftwareApplication','@id':base+'/#software',name:'AQL Fisio',url:base+'/',description:homeDescription,applicationCategory:'BusinessApplication',applicationSubCategory:'Gestão de clínicas de fisioterapia',operatingSystem:'Web',inLanguage:'pt-PT',publisher:{'@id':organization['@id']},offers:[['Gabinete','19.90'],['Clinic','39.90'],['Care','69.90'],['Intelligence','99.90']].map(([name,price])=>({'@type':'Offer',name:'AQL '+name,url:base+'/#pricing',price:campaignActive?campaignPrices[name]:price,priceCurrency:'EUR',...(campaignActive?{priceValidUntil:'2026-12-31'}:{}),description:campaignActive?'Campanha de novas adesões até 31/12/2026: preço mensal durante os primeiros 12 meses após ativação, acrescido de IVA, sem acumulação com desconto anual.':'Subscrição mensal, acrescida de IVA. Consulte as condições e funcionalidades do plano.',priceSpecification:{'@type':'UnitPriceSpecification',price:campaignActive?campaignPrices[name]:price,priceCurrency:'EUR',valueAddedTaxIncluded:false,billingDuration:'P1M'}}))};
function metadata(title,description,url,structured){return `
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_PT">
<meta property="og:site_name" content="AQL Fisio"><meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${base}/assets/aql-fisio-presentation-hero.jpeg">
<meta property="og:image:alt" content="AQL Fisio — software para clínicas de fisioterapia">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}">
<meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${base}/assets/aql-fisio-presentation-hero.jpeg">
<script type="application/ld+json">${json(structured)}</script>
`;}
async function build(){
  const source=fs.readFileSync(path.join(root,'index.js'),'utf8');
  const marker='const siteRoot=document.getElementById("root"),navigationRoot=document.getElementById("site-navigation");if(siteRoot||navigationRoot)c0.createRoot(siteRoot||navigationRoot).render(v.jsx(siteRoot?ck:rk,{}));';
  if(!source.includes(marker)||!source.includes('var ol={exports:'))throw new Error('Website entry changed: review the prerender adapter before publishing.');
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'aqlfisio-prerender-'));
  try{
    const moduleFile=path.join(tmp,'website.mjs');
    fs.writeFileSync(moduleFile,source.slice(source.indexOf('var ol={exports:')).replace(marker,'export {ck as Site,rk as Navigation,n0 as getReact};'));
    const {Site,Navigation,getReact}=await import(pathToFileURL(moduleFile).href);
    const reactPath=require.resolve('react');require(reactPath);require.cache[reactPath].exports=getReact();process.env.NODE_ENV='production';
    const renderer=require('react-dom/server');
    if(renderer.version!==getReact().version)throw new Error('Use the same React version in the site and its static renderer.');
    let rendered=renderer.renderToStaticMarkup(getReact().createElement(Site));
    rendered=rendered.replace(/src="file:[^"]+\/([^/"<>]+)"/g,'src="/assets/$1"').replace('src="./aql-fisio-ecosystem.png"','src="/aql-fisio-ecosystem.png"');
    if(/opacity:0(?:;|")/.test(rendered))throw new Error('Prerendered content must be visible without JavaScript.');
    let template=fs.readFileSync(path.join(root,'homepage.template.html'),'utf8').replace('<html lang="pt">','<html lang="pt-PT">');
    template=template.replace(/<title>[^<]*<\/title>/,metadata(homeTitle,homeDescription,base+'/',graph(homeTitle,homeDescription,base+'/',[software])));
    template=template.replace('2026.10.31.7',version).replace('v=20261031.7','v='+version.replaceAll('.',''));
    template=template.replace('<div id="root"></div>','<div id="root">'+rendered+'</div>');
    template=template.replace('href="/assets/responsive-20261103.css"','href="/assets/responsive-20261103.css?v='+version+'"');
    template=template.replace('</head>',`<link rel="stylesheet" href="/assets/customer-story-20261109.css?v=${version}"><script type="module" src="/assets/customer-story-20261109.js?v=${version}"></script></head>`);
    put('index.html',template);
    const navigationHtml=renderer.renderToStaticMarkup(getReact().createElement(Navigation)).replace(/href="#([^"]*)"/g,'href="/#$1"').replace('href="/#"','href="/"');
    const navigation='<div id="site-navigation">'+navigationHtml+'</div>';
    const footer=template.match(/<footer id="aql-legal-footer"[\s\S]*?<\/footer>/)[0];
    const links=pages.map(p=>`<a href="/${p.slug}/">${escape(p.label)}</a>`).join('');
    for(const page of pages){
      const url=base+'/'+page.slug+'/';
      const breadcrumbs={'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'AQL Fisio',item:base+'/'},{'@type':'ListItem',position:2,name:page.label,item:url}]};
      if(page.kind==='customer-story'){
        const caseContent=fs.readFileSync(path.join(root,'customer-case.html'),'utf8').replace('__FEATURE_LINKS__',links);
        put(page.slug+'/index.html',`<!doctype html><html lang="pt-PT"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${metadata(page.title,page.description,url,graph(page.title,page.description,url,[breadcrumbs]))}<meta name="aql-website-version" content="${version}"><link rel="icon" href="/aql-fisio-mark.svg"><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/fisio-seo-20261101.css"><link rel="stylesheet" href="/assets/responsive-20261103.css?v=${version}"><link rel="stylesheet" href="/assets/customer-story-20261109.css?v=${version}"><script type="module" src="/assets/index-fisio-campaign-20261022.js?v=${version}"></script><script type="module" src="/assets/customer-story-20261109.js?v=${version}"></script></head><body class="aql-feature-page"><a class="skip" href="#conteudo">Saltar para o conteúdo</a>${navigation}${caseContent}${footer}</body></html>`);
        continue;
      }
      put(page.slug+'/index.html',`<!doctype html>
<html lang="pt-PT"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${metadata(page.title,page.description,url,graph(page.title,page.description,url,[breadcrumbs]))}
<meta name="aql-website-version" content="${version}"><link rel="icon" href="/aql-fisio-mark.svg"><meta name="theme-color" content="#ffffff">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/fisio-seo-20261101.css"><link rel="stylesheet" href="/assets/responsive-20261103.css?v=${version}"><script type="module" src="/assets/index-fisio-campaign-20261022.js?v=${version}"></script><script type="module" src="/assets/customer-story-20261109.js?v=${version}"></script></head><body class="aql-feature-page">
<a class="skip" href="#conteudo">Saltar para o conteúdo</a>
${navigation}
<main id="conteudo"><section class="feature-hero"><div class="shell"><nav class="breadcrumbs" aria-label="Localização"><a href="/">AQL Fisio</a><span aria-hidden="true">/</span><span aria-current="page">${escape(page.label)}</span></nav><p class="eyebrow">${escape(page.label)} · AQL Fisio</p><h1>${escape(page.h1)}</h1><p class="intro">${escape(page.intro)}</p><div class="actions"><a class="button" href="/#contact">Agendar apresentação</a><a class="button secondary" href="/#pricing">Comparar planos</a></div></div></section>
<div class="shell article">${page.sections.map(([title,text],i)=>`<section class="feature-section"><span class="section-number" aria-hidden="true">0${i+1}</span><div><h2>${escape(title)}</h2><p>${escape(text)}</p></div></section>`).join('')}
<section class="plan-note">${campaignActive?'<p class="eyebrow">Campanha de adesão até 31/12/2026 · primeiros 12 meses</p>':''}<h2>Escolha o plano para a sua clínica</h2><p>${escape(page.plan)}</p>${campaignActive?'<p>Gabinete 14,90 €, Clinic 29,90 €, Care 49,90 € e Intelligence 69,90 €/mês + IVA. Pagamento mensal, sem acumulação com a oferta anual. Depois aplica-se a tabela em vigor.</p>':''}<a href="/#pricing">Ver planos e condições →</a></section>
<section class="faq"><h2>Perguntas frequentes</h2>${page.faq.map(([q,a])=>`<details><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`).join('')}</section>
<section class="related"><h2>Conheça outras funcionalidades</h2><nav aria-label="Funcionalidades do AQL Fisio">${links}</nav></section>
<section class="demo-cta"><p class="eyebrow">Apresentação online · 30 minutos</p><h2>Veja o AQL Fisio na prática.</h2><p>Conheça a plataforma e esclareça como se adapta ao seu gabinete ou clínica.</p><div class="actions"><a class="button" href="https://calendly.com/alberto-moreira-aqlengineering/30min">Agendar apresentação</a><a class="button secondary" href="https://aqlapps.com/fisio/?signup=1">Registar clínica</a></div></section>
</div></main>${footer}</body></html>`);
    }
    const modified=process.env.AQL_SITE_MODIFIED||'2026-11-09';
    const urls=[{path:'/',modified},...pages.map(p=>({path:'/'+p.slug+'/',modified})),...['identificacao','termos','privacidade','reclamacoes'].map(p=>({path:'/'+p+'/'}))];
    put('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>`  <url><loc>${base+u.path}</loc>${u.modified?`<lastmod>${u.modified}</lastmod>`:''}</url>`).join('\n')+'\n</urlset>\n');
    put('robots.txt',`User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: ${base}/sitemap.xml\n`);
    put('website-version.txt',version+'\n');
    console.log(`Website ${version}: prerendered homepage (${rendered.length} characters), ${pages.length} feature pages, robots and sitemap generated.`);
  }finally{fs.rmSync(tmp,{recursive:true,force:true});}
}
build().catch(error=>{console.error(error);process.exitCode=1});
