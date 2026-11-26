/* AQL Fisio website chat — loads the external service only when requested. */
(() => {
  if (document.getElementById('aql-contact-chat')) return;
  const button = document.createElement('button');
  button.id = 'aql-contact-chat'; button.type = 'button';
  button.textContent = 'Fale connosco';
  button.setAttribute('aria-label', 'Fale connosco — abrir chat');
  const fallback = document.createElement('a');
  fallback.id = 'aql-contact-chat-fallback'; fallback.hidden = true;
  fallback.href = 'mailto:geral@aqlfisio.com';
  fallback.textContent = 'Chat indisponível. Contacte-nos por email.';
  fallback.setAttribute('role', 'status');
  document.body.append(button, fallback);
  let started = false;
  button.addEventListener('click', () => {
    if (started) return; // Subsequent clicks are managed by the widget.
    started = true; button.disabled = true; button.textContent = 'A abrir chat…';
    fallback.hidden = true;
    window.BrevoConversationsID = '6964e10998a1ebb34307ef59';
    window.BrevoConversationsSetup = {
      customWidgetButton: '#aql-contact-chat', language: 'pt',
      chatWidth: 380, chatHeight: 550, zIndex: 10000,
      disableGaTracking: true, disableChatOpenHash: true,
      colors: { buttonBg: '#0891b2', buttonText: '#ffffff' },
      locale: { chat: { input: { placeholder: 'Escreva a sua mensagem…' } } }
    };
    window.BrevoConversations = window.BrevoConversations || function () {
      (window.BrevoConversations.q = window.BrevoConversations.q || []).push(arguments);
    };
    window.BrevoConversations('openChat', true);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
    script.onload = () => { button.disabled = false; button.textContent = 'Fale connosco'; };
    script.onerror = () => {
      started = false; button.disabled = false; button.textContent = 'Tentar abrir chat';
      fallback.hidden = false; script.remove();
      delete window.BrevoConversations;
    };
    document.head.appendChild(script);
  });
})();
