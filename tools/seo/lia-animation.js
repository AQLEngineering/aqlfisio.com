// Fictional, browser-only demonstration. No application or AI service is called.
const scenes=[
 {question:'Qual é a minha próxima consulta?',answer:'A próxima consulta é com a Marta Silva, amanhã às 14:30.',label:'PRÓXIMA CONSULTA',name:'Marta Silva',detail:'Amanhã · 14:30',badge:'60 min',placeholder:'Pergunta sobre a agenda…'},
 {question:'Marca uma consulta para a Marta na quinta às 14:30.',answer:'Preparei os dados para rever. Confirme o utente e o horário antes de guardar.',label:'PROPOSTA DE MARCAÇÃO',name:'Marta Silva',detail:'Quinta-feira · 14:30',badge:'Por confirmar',placeholder:'Prepara uma marcação…'},
 {question:'Resume a evolução da Marta.',answer:'Nas sessões registadas, a dor diminuiu e a mobilidade do ombro melhorou. Reveja o resumo antes de validar.',label:'RESUMO PARA REVISÃO',name:'Evolução ao longo das sessões',detail:'Dor: 7 → 3 / 10',badge:'Ombro: 112° → 148°',placeholder:'Pergunta sobre o utente…'},
];
let currentRoot,dispose;
function mount(root){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const question=root.querySelector('[data-lia-question]'),answer=root.querySelector('[data-lia-answer]'),card=root.querySelector('[data-lia-card]'),thinking=root.querySelector('[data-lia-thinking]'),progress=root.querySelector('[data-lia-progress]'),play=root.querySelector('[data-lia-play]'),announcement=root.querySelector('[data-lia-announcement]');
 const tabs=[...root.querySelectorAll('[data-lia-scene]')];let index=0,elapsed=reduced.matches?7400:0,playing=!reduced.matches,visible=false,lastTime=0,frame=0,lastSignature='';
 const duration=8000;
 function render(){
  const scene=scenes[index],phase=elapsed<1000?0:elapsed<2000?1:elapsed<2700?2:3;
  const length=phase===0?Math.max(1,Math.floor(scene.question.length*elapsed/1000)):scene.question.length;
  const signature=[index,phase,length].join(':');
  if(signature!==lastSignature){lastSignature=signature;question.textContent=scene.question.slice(0,length);question.setAttribute('aria-label',scene.question);thinking.hidden=phase!==1;answer.hidden=phase<2;card.hidden=phase<3;answer.textContent=scene.answer;card.querySelector(':scope > span').textContent=scene.label;card.querySelector('strong').textContent=scene.name;const details=card.querySelectorAll(':scope > div > span');details[0].textContent=scene.detail;details[1].textContent=scene.badge;root.querySelector('[data-lia-placeholder]').textContent=scene.placeholder;tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));}
  progress.style.transform=`scaleX(${elapsed/duration})`;
 }
 function run(now){frame=0;if(!playing||!visible||document.hidden)return;elapsed+=lastTime?now-lastTime:0;lastTime=now;if(elapsed>=duration){elapsed=0;index=(index+1)%scenes.length;}render();frame=requestAnimationFrame(run);}
 function sync(){cancelAnimationFrame(frame);frame=0;lastTime=0;if(playing&&visible&&!document.hidden)frame=requestAnimationFrame(run);}
 function updateControl(){root.dataset.paused=String(!playing);play.setAttribute('aria-pressed',String(!playing));play.setAttribute('aria-label',playing?'Pausar animação da LIA':'Reproduzir animação da LIA');play.querySelector('span').textContent=playing?'Pausar':'Reproduzir';play.firstChild.textContent=playing?'Ⅱ ':'▷ ';}
 function select(i){index=i;elapsed=playing&&!reduced.matches?0:7400;lastSignature='';render();if(!playing)announcement.textContent=`${scenes[i].question} ${scenes[i].answer}`;sync();}
 const clicks=event=>{const target=event.target.closest('button');if(!target)return;if(target===play){playing=!playing;if(playing&&elapsed>=7400)elapsed=0;updateControl();render();sync();}else if(target.hasAttribute('data-lia-scene'))select(Number(target.dataset.liaScene));};
 const preference=()=>{if(reduced.matches){playing=false;elapsed=7400;render();updateControl();sync();}};
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.15});observer.observe(root);root.addEventListener('click',clicks);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',preference);render();updateControl();
 return ()=>{cancelAnimationFrame(frame);observer.disconnect();root.removeEventListener('click',clicks);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',preference);};
}
function initialize(){const root=document.querySelector('[data-lia-animation]');if(root===currentRoot)return;dispose?.();currentRoot=root;dispose=root?mount(root):undefined;}
// Rebind once the existing React page replaces its initial static markup.
new MutationObserver(initialize).observe(document.documentElement,{subtree:true,childList:true});initialize();
