import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

document.addEventListener('DOMContentLoaded', () => {
    createChat({
        webhookUrl: 'https://n8n-n8n.gk97dq.easypanel.host/webhook/7ab9aee7-372e-4069-a168-d0039d22605b/chat',

        target: '#n8n-chat',
        mode: 'window',

        showWelcomeScreen: true,
        loadPreviousSession: true,
        metadata: {},
        initialMessages: [
            'Hola 👋',
            'Soy EvolveBot, el asistente virtual de EvolveHub.',
            '¿En qué puedo ayudarte hoy?'
        ],
        i18n: {
		en: {
			title: 'EvolveHub',
			subtitle: "Inicia un chat. Estamos aqui para ayudarte las 24/7.\n Agenda una reunion para más información.",
			footer: '',
			getStarted: 'New Conversation',
			inputPlaceholder: 'Type your question..',
		},
	},


  branding: {
    logo: 'https://evolvehub.es/logo_evolvehub.png',
    name: 'EvolveHub AI'
  },

        enableStreaming: false
    });
});