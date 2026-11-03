const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=__dirname,target=path.resolve(process.argv[2]||'');assert.ok(process.argv[2]&&fs.existsSync(path.join(target,'.git')),'Use an existing publication checkout');
const desired=fs.readFileSync(path.join(source,'website-version.txt'),'utf8').trim();
const previous=fs.readFileSync(path.join(target,'website-version.txt'),'utf8').trim();
const parts=v=>v.split('.').map(Number);for(let i=0;i<4;i++){const a=parts(desired)[i]||0,b=parts(previous)[i]||0;if(a>b)break;if(a<b)throw Error('Refusing to downgrade the public website');}
const files=['assets/lia-animation-20261103.css','assets/lia-animation-20261103.js','assets/lia-actions-20261103.css','assets/lia-actions-demo-20261103.js','index.html','robots.txt','sitemap.xml','website-version.txt','assets/fisio-seo-20261101.css','assets/lia/lia-demo-crop.mp4','assets/lia/lia-demo-crop-poster.jpg','.github/workflows/close-adoption-campaign.yml',...JSON.parse(fs.readFileSync(path.join(source,'seo-pages.json'),'utf8')).map(p=>p.slug+'/index.html')];
for(const file of files){if(file.startsWith('.github/')&&!fs.existsSync(path.join(source,file)))continue;fs.mkdirSync(path.dirname(path.join(target,file)),{recursive:true});const input=fs.existsSync(path.join(source,file))?path.join(source,file):path.resolve(source,'../..',file);fs.copyFileSync(input,path.join(target,file));}
fs.copyFileSync(path.join(source,'index.js'),path.join(target,'assets/index-fisio-campaign-20261022.js'));
// Keep the static renderer and its inputs versioned with the published site.
const tools=path.join(target,'tools/seo');fs.mkdirSync(tools,{recursive:true});
for(const file of ['build-seo.cjs','verify-seo.cjs','stage-seo.cjs','publish.sh','homepage.template.html','lia-animation.html','lia-animation.js','lia-actions-section.html','lia-actions-demo.js','seo-pages.json','index.js','package.json','package-lock.json','README.md'])fs.copyFileSync(path.join(source,file),path.join(tools,file));
fs.mkdirSync(path.join(tools,'assets'),{recursive:true});fs.copyFileSync(path.join(source,'assets/lia-animation-20261103.css'),path.join(tools,'assets/lia-animation-20261103.css'));fs.copyFileSync(path.join(source,'assets/lia-actions-20261103.css'),path.join(tools,'assets/lia-actions-20261103.css'));fs.copyFileSync(path.join(source,'assets/fisio-seo-20261101.css'),path.join(tools,'assets/fisio-seo-20261101.css'));
console.log(`Staged website ${desired}; existing assets and legal pages preserved.`);
