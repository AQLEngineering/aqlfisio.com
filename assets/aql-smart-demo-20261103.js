/* Interactive product tour with fictitious data. Does not call the clinic app or save rules. */
(function () {
  "use strict";
  const ROOT_ID = "experimente-aql-fisio";
  const views = {
    lia: {
      copy: '<span class="aql-sd-kicker">✧ Inteligência clínica</span><h3>A LIA prepara. O fisioterapeuta decide.</h3><p>Peça ajuda para organizar as notas, rever o histórico e preparar um resumo. O profissional valida sempre a informação clínica.</p><div class="aql-sd-benefits"><span>Contexto da consulta</span><span>Resumo estruturado</span><span>Revisão pelo profissional</span></div>',
      screen: '<p class="aql-sd-screen-label">LIA · APOIO AO PROFISSIONAL</p><div class="aql-sd-message aql-sd-from-user">LIA, consegues organizar o resumo desta sessão e os pontos a acompanhar?</div><div class="aql-sd-message aql-sd-from-lia">Posso preparar um rascunho com base nas notas registadas. Veja um exemplo:</div><button type="button" class="aql-sd-action" data-sd-action="lia">Gerar exemplo de resumo <span aria-hidden="true">✧</span></button>'
    },
    tasks: {
      copy: '<span class="aql-sd-kicker">◎ Automações de seguimento</span><h3>A clínica continua a funcionar entre consultas.</h3><p>Cancelamentos, confirmações e tarefas de seguimento não precisam de depender apenas da memória da equipa. Veja uma simulação de um dia na receção.</p><div class="aql-sd-benefits"><span>Centro de tarefas</span><span>Pendências sinalizadas</span><span>Equipa coordenada</span></div>',
      screen: '<p class="aql-sd-screen-label">CENTRO DE TAREFAS · DIA SIMULADO</p><div id="aql-sd-task-list" aria-live="polite"><div class="aql-sd-task"><div><strong>09:00 · Abertura da clínica</strong><small>As regras de acompanhamento estão ativas</small></div><span class="aql-sd-pill">Pronto</span></div></div><button type="button" class="aql-sd-action" data-sd-action="tasks">Simular acontecimentos do dia <span aria-hidden="true">→</span></button>'
    },
    rules: {
      copy: '<span class="aql-sd-kicker">⚙ Regras configuráveis</span><h3>A rotina da sua clínica. As regras também.</h3><p>Escolha uma condição e a resposta desejada, ao estilo «Quando acontecer X, fazer Y». Experimente o princípio sem alterar dados reais.</p><div class="aql-sd-benefits"><span>Quando → Então</span><span>Regras personalizadas</span><span>Ativar e desativar</span></div>',
      screen: '<p class="aql-sd-screen-label">CONSTRUTOR DE REGRAS · SIMULAÇÃO</p><div class="aql-sd-builder"><label class="aql-sd-label" for="aql-sd-trigger">QUANDO acontecer...</label><select class="aql-sd-select" id="aql-sd-trigger"><option>Uma consulta é cancelada</option><option>Uma consulta fica por confirmar</option><option>Um pack está perto do fim</option></select><label class="aql-sd-label" for="aql-sd-consequence">ENTÃO a equipa deve...</label><select class="aql-sd-select" id="aql-sd-consequence"><option>Criar uma tarefa para a receção</option><option>Receber um alerta interno</option><option>Sinalizar para acompanhamento</option></select><button type="button" class="aql-sd-action" data-sd-action="rules">Experimentar esta regra <span aria-hidden="true">✓</span></button></div><div id="aql-sd-rule-output" role="status" aria-live="polite"></div>'
    }
  };
  const taskEvents = [
    ['09:15 · Consulta cancelada', 'Tarefa proposta à receção para rever a agenda', 'Tarefa'],
    ['10:30 · Consulta por confirmar', 'Seguimento sinalizado para a equipa', 'Sinalizado'],
    ['11:40 · Pack perto do fim', 'Proposta de acompanhamento do utente', 'Seguimento']
  ];
  let taskStep = 0;

  function getSection() { return document.getElementById(ROOT_ID); }

  function ensureMounted() {
    const main = document.querySelector("#root .product-journey");
    const pricing = main && main.querySelector("#pricing");
    const template = document.getElementById("aql-sd-template");
    if (!pricing || !template) return;
    let section = getSection();
    if (!section || !main.contains(section)) {
      section = template.content.firstElementChild.cloneNode(true);
      pricing.parentNode.insertBefore(section, pricing);
      taskStep = 0;
    }
  }
  function switchView(section, view, moveFocus) {
    if (!views[view]) return;
    section.dataset.sdView = view;
    section.querySelector("#aql-sd-pitch").innerHTML = views[view].copy;
    const screen = section.querySelector("#aql-sd-screen");
    screen.innerHTML = views[view].screen;
    screen.setAttribute("aria-labelledby", "aql-sd-tab-" + view);
    section.querySelectorAll("[data-sd-tab]").forEach(function (tab) {
      const active = tab.dataset.sdTab === view;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
      if (active && moveFocus) tab.focus();
    });
    if (view === "tasks") taskStep = 0;
  }
  function showLia(section, button) {
    if (section.querySelector(".aql-sd-result")) return;
    button.remove();
    const result = document.createElement("div");
    result.className = "aql-sd-result";
    result.setAttribute("role", "status");
    result.innerHTML = '<strong>✧ Resumo proposto pela LIA</strong><p><b>Evolução:</b> mobilidade do ombro em melhoria, segundo as notas fictícias desta sessão.</p><p><b>Registo:</b> exercícios de mobilidade e reforço progressivo.</p><p><b>A acompanhar:</b> amplitude de movimento, desconforto e tolerância aos exercícios.</p><span class="aql-sd-disclaimer">✓ Rascunho ilustrativo sujeito à revisão do fisioterapeuta</span>';
    section.querySelector("#aql-sd-screen").appendChild(result);
  }
  function advanceTasks(section, button) {
    if (taskStep === taskEvents.length) { switchView(section, "tasks", false); return; }
    const entry = taskEvents[taskStep++];
    const row = document.createElement("div");
    row.className = "aql-sd-task";
    const detail = document.createElement("div"), title = document.createElement("strong"), subtitle = document.createElement("small"), pill = document.createElement("span");
    title.textContent = entry[0];
    subtitle.textContent = entry[1];
    pill.textContent = entry[2];
    pill.className = "aql-sd-pill";
    detail.append(title, subtitle);
    row.append(detail, pill);
    section.querySelector("#aql-sd-task-list").appendChild(row);
    button.textContent = taskStep === taskEvents.length ? "Reiniciar simulação ↻" : "Continuar o dia →";
  }
  function showRule(section) {
    const trigger = section.querySelector("#aql-sd-trigger").value;
    const action = section.querySelector("#aql-sd-consequence").value;
    const output = section.querySelector("#aql-sd-rule-output");
    output.replaceChildren();
    const result = document.createElement("div");
    result.className = "aql-sd-result";
    result.setAttribute("role", "status");
    const heading = document.createElement("strong");
    heading.textContent = "✓ Regra simulada com sucesso";
    const when = document.createElement("p");
    when.textContent = "Quando: " + trigger;
    const then = document.createElement("p");
    then.textContent = "Então: " + action;
    const caveat = document.createElement("span");
    caveat.className = "aql-sd-disclaimer";
    caveat.textContent = "Esta demonstração não cria nem ativa uma regra real.";
    result.append(heading, when, then, caveat);
    output.appendChild(result);
  }
  function handleClick(event) {
    const tab = event.target.closest("[data-sd-tab]");
    if (tab) {
      const section = tab.closest(".aql-smart-demo");
      if (section) switchView(section, tab.dataset.sdTab, false);
      return;
    }
    const button = event.target.closest("[data-sd-action]");
    const section = button && button.closest(".aql-smart-demo");
    if (!section) return;
    if (button.dataset.sdAction === "lia") showLia(section, button);
    else if (button.dataset.sdAction === "tasks") advanceTasks(section, button);
    else if (button.dataset.sdAction === "rules") showRule(section);
  }
  function handleKeys(event) {
    const tab = event.target.closest("[data-sd-tab]");
    if (!tab || !tab.closest(".aql-smart-demo")) return;
    const values = ["lia", "tasks", "rules"];
    const index = values.indexOf(tab.dataset.sdTab);
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % values.length;
    else if (event.key === "ArrowLeft") next = (index + values.length - 1) % values.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = values.length - 1;
    else return;
    event.preventDefault();
    switchView(tab.closest(".aql-smart-demo"), values[next], true);
  }
  function initialize() {
    if (document.documentElement.dataset.aqlSdInit) return;
    document.documentElement.dataset.aqlSdInit = "true";
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeys);
    const root = document.getElementById("root");
    if (!root) return;
    ensureMounted();
    function addNavigationLink() {
      const desktop = document.querySelector('#root nav .hidden.md\\:flex');
      if (desktop && !desktop.querySelector('[data-sd-nav]')) {
        const plans = desktop.querySelector('a[href="#pricing"]');
        if (plans) {
          const link = plans.cloneNode(true);
          link.href = '#experimente-aql-fisio';
          link.setAttribute('data-sd-nav', 'true');
          link.textContent = 'LIA & Automações';
          plans.before(link);
        }
      }
      const mobile = document.querySelector('#mobile-navigation');
      if (mobile && !mobile.querySelector('[data-sd-nav]')) {
        const plans = mobile.querySelector('a[href="#pricing"]');
        if (plans) {
          const link = plans.cloneNode(true);
          link.href = '#experimente-aql-fisio';
          link.setAttribute('data-sd-nav', 'true');
          link.textContent = 'LIA & Automações';
          plans.before(link);
        }
      }
    }
    addNavigationLink();
    const observer = new MutationObserver(function () {
      if (!getSection() || !root.contains(getSection())) ensureMounted();
      addNavigationLink();
    });
    observer.observe(root, {childList:true, subtree:true});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, {once:true});
  else initialize();
})();
