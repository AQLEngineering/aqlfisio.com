// Illustrative website demo only. It never calls the application or messaging services.
document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target:null;
 const approve=target?.closest('[data-lia-action-approve]');
 const reset=target?.closest('[data-lia-action-reset]');
 const card=(approve||reset)?.closest('.lia-action-demo');
 if(!card)return;
 const button=card.querySelector('[data-lia-action-approve]'),result=card.querySelector('[data-lia-action-result]');
 if(!button||!result)return;
 button.hidden=Boolean(approve);result.hidden=Boolean(reset);
 if(approve){result.setAttribute('tabindex','-1');result.focus({preventScroll:true});}else button.focus({preventScroll:true});
});
