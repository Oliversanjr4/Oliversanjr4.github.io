/**
 * EvolveBot - Widget de Chat Flotante
 * =====================================
 * Instrucciones de uso:
 * 1. Sube este archivo a tu servidor o CDN.
 * 2. Añade en cada página HTML (justo antes de </body>):
 *
 *    <script>
 *      window.EvolveBotConfig = {
 *        webhookUrl: 'https://TU-N8N.app.n8n.cloud/webhook/68ec93e2-c790-4ed7-bc6f-aee4acd79c6c',
 *        webhookToken: 'TU_TOKEN_SECRETO'   // Header Auth de n8n
 *      };
 *    </script>
 *    <script src="evolvebot-widget.js"></script>
 *
 * El chat persiste entre páginas mediante localStorage (sessionId + historial).
 */

(function () {
  'use strict';

  /* ─── CONFIGURACIÓN ─────────────────────────────────────── */
  const CONFIG = window.EvolveBotConfig || {};
  const WEBHOOK_URL = CONFIG.webhookUrl || 'https://TU-N8N.app.n8n.cloud/webhook/68ec93e2-c790-4ed7-bc6f-aee4acd79c6c';
  const WEBHOOK_TOKEN = CONFIG.webhookToken || 'TU_TOKEN_SECRETO';
  const STORAGE_KEY_SESSION = 'evolvebot_session_id';
  const STORAGE_KEY_HISTORY = 'evolvebot_chat_history';
  const STORAGE_KEY_OPEN    = 'evolvebot_is_open';
  const BOT_NAME = 'EvolveBot';
  const WELCOME_MSG = '¡Hola! Soy <strong>EvolveBot</strong>, tu consultor digital de EvolveHub. 🚀<br>¿Qué tipo de negocio tienes y cuál es tu principal reto digital?';

  /* ─── UTILIDADES ─────────────────────────────────────────── */
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function getOrCreateSession() {
    let id = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!id) { id = generateUUID(); localStorage.setItem(STORAGE_KEY_SESSION, id); }
    return id;
  }

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || []; }
    catch { return []; }
  }

  function saveHistory(history) {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }

  /* ─── ESTILOS ────────────────────────────────────────────── */
  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

    :root {
      --eb-black:   #0a0a0f;
      --eb-dark:    #12111a;
      --eb-panel:   #1a1826;
      --eb-border:  #2a2640;
      --eb-purple:  #7c3aed;
      --eb-violet:  #9f5cf7;
      --eb-glow:    #a855f7;
      --eb-light:   #e2d9f3;
      --eb-muted:   #6b6580;
      --eb-white:   #f5f3ff;
      --eb-radius:  16px;
      --eb-shadow:  0 24px 80px rgba(124,58,237,0.35), 0 8px 32px rgba(0,0,0,0.6);
      --eb-font:    'Outfit', system-ui, sans-serif;
    }

    #evolvebot-container * { box-sizing: border-box; margin: 0; padding: 0; font-family: var(--eb-font); }

    /* ── TOGGLE BUTTON ── */
    #evolvebot-toggle {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 999998;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--eb-purple), var(--eb-violet));
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(124,58,237,0.5), 0 2px 8px rgba(0,0,0,0.4);
      transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease;
      outline: none;
    }
    #evolvebot-toggle:hover {
      transform: scale(1.1) translateY(-2px);
      box-shadow: 0 12px 40px rgba(124,58,237,0.65), 0 2px 8px rgba(0,0,0,0.4);
    }
    #evolvebot-toggle svg { transition: opacity 0.2s, transform 0.3s; }
    #evolvebot-toggle .eb-icon-chat { opacity: 1; position: absolute; }
    #evolvebot-toggle .eb-icon-close { opacity: 0; position: absolute; transform: rotate(-90deg); }
    #evolvebot-toggle.eb-open .eb-icon-chat  { opacity: 0; transform: rotate(90deg); }
    #evolvebot-toggle.eb-open .eb-icon-close { opacity: 1; transform: rotate(0deg); }

    /* Notificación badge */
    #evolvebot-badge {
      position: absolute;
      top: -4px; right: -4px;
      width: 20px; height: 20px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid var(--eb-black);
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      color: #fff;
    }
    #evolvebot-badge.visible { display: flex; }

    /* ── PANEL PRINCIPAL ── */
    #evolvebot-panel {
      position: fixed;
      bottom: 104px;
      right: 28px;
      z-index: 999999;
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 560px;
      max-height: calc(100vh - 140px);
      background: var(--eb-dark);
      border-radius: var(--eb-radius);
      border: 1px solid var(--eb-border);
      box-shadow: var(--eb-shadow);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease;
    }
    #evolvebot-panel.eb-visible {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* ── HEADER ── */
    #evolvebot-header {
      background: linear-gradient(135deg, #1e1530 0%, #130f24 100%);
      border-bottom: 1px solid var(--eb-border);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }
    #evolvebot-header::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--eb-purple), var(--eb-violet), var(--eb-glow));
    }
    .eb-avatar {
      width: 42px; height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--eb-purple), var(--eb-violet));
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      position: relative;
      box-shadow: 0 0 0 2px rgba(124,58,237,0.3);
    }
    .eb-avatar::after {
      content: '';
      position: absolute;
      bottom: 1px; right: 1px;
      width: 10px; height: 10px;
      background: #22c55e;
      border-radius: 50%;
      border: 2px solid var(--eb-dark);
    }
    .eb-avatar svg { width: 22px; height: 22px; }
    .eb-header-info { flex: 1; min-width: 0; }
    .eb-header-name {
      font-size: 15px; font-weight: 700;
      color: var(--eb-white);
      letter-spacing: -0.01em;
    }
    .eb-header-status {
      font-size: 11px; color: #22c55e;
      font-weight: 500; margin-top: 1px;
      display: flex; align-items: center; gap: 4px;
    }
    .eb-header-status::before {
      content: '';
      width: 6px; height: 6px;
      background: #22c55e;
      border-radius: 50%;
      animation: eb-pulse 2s infinite;
    }
    #evolvebot-clear-btn {
      background: none; border: none; cursor: pointer;
      padding: 6px; border-radius: 8px;
      color: var(--eb-muted);
      transition: color 0.2s, background 0.2s;
      display: flex; align-items: center;
      outline: none;
    }
    #evolvebot-clear-btn:hover { color: var(--eb-light); background: rgba(255,255,255,0.06); }

    /* ── MENSAJES ── */
    #evolvebot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      scroll-behavior: smooth;
      background:
        radial-gradient(ellipse at 20% 0%, rgba(124,58,237,0.08) 0%, transparent 60%),
        var(--eb-dark);
    }
    #evolvebot-messages::-webkit-scrollbar { width: 4px; }
    #evolvebot-messages::-webkit-scrollbar-track { background: transparent; }
    #evolvebot-messages::-webkit-scrollbar-thumb {
      background: var(--eb-border);
      border-radius: 2px;
    }

    .eb-message {
      display: flex;
      flex-direction: column;
      max-width: 88%;
      animation: eb-slide-in 0.3s cubic-bezier(.34,1.56,.64,1);
    }
    .eb-message.eb-user { align-self: flex-end; align-items: flex-end; }
    .eb-message.eb-bot  { align-self: flex-start; align-items: flex-start; }

    .eb-bubble {
      padding: 11px 15px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.55;
      word-break: break-word;
    }
    .eb-bubble strong { font-weight: 600; }
    .eb-message.eb-user .eb-bubble {
      background: linear-gradient(135deg, var(--eb-purple), var(--eb-violet));
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .eb-message.eb-bot .eb-bubble {
      background: var(--eb-panel);
      color: var(--eb-light);
      border: 1px solid var(--eb-border);
      border-bottom-left-radius: 4px;
    }
    .eb-timestamp {
      font-size: 10px;
      color: var(--eb-muted);
      margin-top: 4px;
      padding: 0 4px;
    }

    /* Typing indicator */
    .eb-typing-bubble {
      background: var(--eb-panel);
      border: 1px solid var(--eb-border);
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      padding: 14px 18px;
      display: flex; align-items: center; gap: 5px;
    }
    .eb-typing-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--eb-violet);
      animation: eb-typing 1.2s infinite ease-in-out;
    }
    .eb-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .eb-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    /* ── INPUT AREA ── */
    #evolvebot-input-area {
      padding: 14px 16px;
      border-top: 1px solid var(--eb-border);
      background: var(--eb-panel);
      display: flex;
      align-items: flex-end;
      gap: 10px;
      flex-shrink: 0;
    }
    #evolvebot-input {
      flex: 1;
      background: var(--eb-black);
      border: 1px solid var(--eb-border);
      border-radius: 12px;
      padding: 11px 14px;
      color: var(--eb-white);
      font-size: 13.5px;
      font-family: var(--eb-font);
      resize: none;
      outline: none;
      line-height: 1.5;
      max-height: 120px;
      min-height: 44px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    #evolvebot-input::placeholder { color: var(--eb-muted); }
    #evolvebot-input:focus {
      border-color: var(--eb-purple);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
    }
    #evolvebot-send {
      width: 44px; height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--eb-purple), var(--eb-violet));
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
      box-shadow: 0 4px 16px rgba(124,58,237,0.4);
      outline: none;
    }
    #evolvebot-send:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(124,58,237,0.55); }
    #evolvebot-send:active { transform: scale(0.96); }
    #evolvebot-send:disabled { opacity: 0.45; cursor: default; transform: none; }

    /* ── POWERED BY ── */
    #evolvebot-footer {
      text-align: center;
      padding: 8px;
      font-size: 10px;
      color: var(--eb-muted);
      background: var(--eb-panel);
      border-top: 1px solid var(--eb-border);
      letter-spacing: 0.03em;
    }
    #evolvebot-footer a { color: var(--eb-violet); text-decoration: none; }

    /* ── ANIMATIONS ── */
    @keyframes eb-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.8); }
    }
    @keyframes eb-typing {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-5px); opacity: 1; }
    }
    @keyframes eb-slide-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Mobile */
    @media (max-width: 480px) {
      #evolvebot-panel {
        right: 12px; bottom: 96px;
        width: calc(100vw - 24px);
        height: calc(100vh - 130px);
      }
      #evolvebot-toggle { bottom: 20px; right: 16px; }
    }
  `;

  /* ─── HTML TEMPLATE ──────────────────────────────────────── */
  function buildHTML() {
    return `
      <style id="evolvebot-styles">${STYLES}</style>

      <!-- Toggle -->
      <button id="evolvebot-toggle" aria-label="Abrir chat EvolveBot">
        <span id="evolvebot-badge" aria-hidden="true">1</span>
        <svg class="eb-icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73812 18.875L2.72681 21.1705C2.44361 21.4937 2.67314 22 3.10288 22H12Z" fill="white"/>
        </svg>
        <svg class="eb-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Panel -->
      <div id="evolvebot-panel" role="dialog" aria-label="Chat EvolveBot" aria-live="polite">
        <!-- Header -->
        <div id="evolvebot-header">
          <div class="eb-avatar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3H5C3.89543 3 3 3.89543 3 5V9M9 3H15M9 3V9M15 3H19C20.1046 3 21 3.89543 21 5V9M15 3V9M21 9V15M21 15V19C21 20.1046 20.1046 21 19 21H15M21 15H15M3 9V15M3 15V19C3 20.1046 3.89543 21 5 21H9M3 15H9M9 21H15M9 21V15M15 21V15M9 15H15M9 15V9M15 15V9M15 9H9" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="eb-header-info">
            <div class="eb-header-name">${BOT_NAME}</div>
            <div class="eb-header-status">En línea · EvolveHub</div>
          </div>
          <button id="evolvebot-clear-btn" title="Limpiar conversación" aria-label="Limpiar chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H21M8 6V4H16V6M19 6L18.2 19.2C18.0949 20.2274 17.2274 21 16.2 21H7.8C6.77261 21 5.90506 20.2274 5.8 19.2L5 6H19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div id="evolvebot-messages"></div>

        <!-- Input -->
        <div id="evolvebot-input-area">
          <textarea
            id="evolvebot-input"
            placeholder="Escribe tu mensaje..."
            rows="1"
            aria-label="Mensaje"
          ></textarea>
          <button id="evolvebot-send" aria-label="Enviar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Footer -->
        <div id="evolvebot-footer">
          Powered by <a href="https://evolvehub.es" target="_blank">EvolveHub</a>
        </div>
      </div>
    `;
  }

  /* ─── LÓGICA PRINCIPAL ───────────────────────────────────── */
  function initEvolveBot() {
    // Inyectar HTML
    const container = document.createElement('div');
    container.id = 'evolvebot-container';
    container.innerHTML = buildHTML();
    document.body.appendChild(container);

    // Referencias DOM
    const toggleBtn  = document.getElementById('evolvebot-toggle');
    const panel      = document.getElementById('evolvebot-panel');
    const messages   = document.getElementById('evolvebot-messages');
    const input      = document.getElementById('evolvebot-input');
    const sendBtn    = document.getElementById('evolvebot-send');
    const clearBtn   = document.getElementById('evolvebot-clear-btn');
    const badge      = document.getElementById('evolvebot-badge');

    // Estado
    const sessionId = getOrCreateSession();
    let history     = loadHistory();
    let isOpen      = localStorage.getItem(STORAGE_KEY_OPEN) === 'true';
    let isLoading   = false;

    /* ── Helpers de UI ── */
    function formatTime() {
      return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    function scrollToBottom() {
      messages.scrollTop = messages.scrollHeight;
    }

    function appendMessage(role, text, time) {
      const el = document.createElement('div');
      el.className = `eb-message eb-${role}`;
      el.innerHTML = `
        <div class="eb-bubble">${text}</div>
        <span class="eb-timestamp">${time || formatTime()}</span>
      `;
      messages.appendChild(el);
      scrollToBottom();
      return el;
    }

    function showTyping() {
      const el = document.createElement('div');
      el.className = 'eb-message eb-bot';
      el.id = 'eb-typing';
      el.innerHTML = `<div class="eb-typing-bubble"><div class="eb-typing-dot"></div><div class="eb-typing-dot"></div><div class="eb-typing-dot"></div></div>`;
      messages.appendChild(el);
      scrollToBottom();
    }

    function hideTyping() {
      const el = document.getElementById('eb-typing');
      if (el) el.remove();
    }

    /* ── Carga historial ── */
    function renderHistory() {
      messages.innerHTML = '';
      if (history.length === 0) {
        appendMessage('bot', WELCOME_MSG);
      } else {
        history.forEach(m => appendMessage(m.role, m.text, m.time));
      }
    }

    /* ── Abrir/Cerrar ── */
    function setOpen(open) {
      isOpen = open;
      localStorage.setItem(STORAGE_KEY_OPEN, open);
      toggleBtn.classList.toggle('eb-open', open);
      panel.classList.toggle('eb-visible', open);
      if (open) {
        badge.classList.remove('visible');
        setTimeout(() => { input.focus(); scrollToBottom(); }, 350);
      }
    }

    toggleBtn.addEventListener('click', () => setOpen(!isOpen));

    // Restaurar estado si venía abierto de otra página
    if (isOpen) { setOpen(true); }

    /* ── Limpiar chat ── */
    clearBtn.addEventListener('click', () => {
      if (confirm('¿Limpiar toda la conversación?')) {
        history = [];
        saveHistory(history);
        localStorage.removeItem(STORAGE_KEY_SESSION);
        location.reload();
      }
    });

    /* ── Enviar mensaje ── */
    async function sendMessage() {
      const text = input.value.trim();
      if (!text || isLoading) return;

      const time = formatTime();
      input.value = '';
      input.style.height = 'auto';
      isLoading = true;
      sendBtn.disabled = true;

      // Mostrar mensaje usuario
      appendMessage('user', text, time);
      history.push({ role: 'user', text, time });
      saveHistory(history);

      // Typing
      showTyping();

      try {
        const res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${WEBHOOK_TOKEN}`
          },
          body: JSON.stringify({
            chatInput: text,
            sessionId: sessionId
          })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const botText = data.output || data.text || data.message || 'Lo siento, no he podido procesar tu mensaje.';
        const botTime = formatTime();

        hideTyping();
        appendMessage('bot', botText, botTime);
        history.push({ role: 'bot', text: botText, time: botTime });
        saveHistory(history);

        // Badge si está cerrado
        if (!isOpen) badge.classList.add('visible');

      } catch (err) {
        console.error('[EvolveBot]', err);
        hideTyping();
        const errMsg = '⚠️ Error de conexión. Por favor, inténtalo de nuevo.';
        appendMessage('bot', errMsg, formatTime());
      } finally {
        isLoading = false;
        sendBtn.disabled = false;
        input.focus();
      }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });

    /* ── Inicializar ── */
    renderHistory();
  }

  /* ─── INIT ───────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvolveBot);
  } else {
    initEvolveBot();
  }

})();