// Chronova 2.0 - ChronoBot Query Chatbot Assistant
// Natural language matching across Events, Study Materials, Clubs, and Portals

class ChronoBot {
  constructor() {
    this.container = null;
    this.chatBody = null;
    this.inputEl = null;
    this.chipsEl = null;
    this.isTyping = false;
  }

  init() {
    this.container = document.getElementById('chatbotWidget');
    this.chatBody = document.getElementById('chatMessagesBody');
    this.inputEl = document.getElementById('chatInput');
    this.chipsEl = document.getElementById('chatQuickChips');

    this.renderChips();
    this.renderMessages();

    // Listen to state changes
    window.chronovaState.subscribe((event, payload) => {
      if (event === 'chat_updated' || event === 'chat_cleared') {
        this.renderMessages();
      }
      if (event === 'chat_visibility_changed') {
        this.updateVisibility(payload.isOpen);
      }
    });

    // Enter key trigger
    if (this.inputEl) {
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleUserSend();
        }
      });
    }
  }

  renderChips() {
    if (!this.chipsEl) return;
    const chips = CHRONOVA_DATA.chatKnowledge.quickChips;
    this.chipsEl.innerHTML = chips.map(chip => `
      <button onclick="window.chronoBot.sendQuery('${chip.query.replace(/'/g, "\\'")}')" 
              class="px-2.5 py-1 rounded-full text-xs bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 whitespace-nowrap transition-all flex-shrink-0">
        ${chip.text}
      </button>
    `).join('');
  }

  renderMessages() {
    if (!this.chatBody) return;
    const history = window.chronovaState.chatHistory;

    this.chatBody.innerHTML = history.map(msg => {
      const isBot = msg.sender === 'bot';
      return `
        <div class="flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'} animate-fade-in">
          ${isBot ? `
            <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <i data-lucide="bot" class="w-4 h-4"></i>
            </div>
          ` : `
            <div class="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-white shrink-0">
              <i data-lucide="user" class="w-4 h-4"></i>
            </div>
          `}
          
          <div class="max-w-[82%]">
            <div class="p-3 text-xs leading-relaxed ${isBot ? 'chat-bubble-bot text-slate-200' : 'chat-bubble-user text-white'}">
              ${this.formatMarkdown(msg.text)}
            </div>

            <!-- Action Button if attached -->
            ${msg.action ? `
              <div class="mt-2">
                <button onclick="window.chronoBot.triggerAction('${msg.action.type}', '${msg.action.id}')" 
                        class="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 flex items-center gap-1.5 transition-colors font-medium">
                  <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                  ${msg.action.label}
                </button>
              </div>
            ` : ''}

            <span class="text-[10px] text-slate-500 mt-1 block ${isBot ? '' : 'text-right'}">
              ${msg.timestamp}
            </span>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons({ root: this.chatBody });
    this.scrollToBottom();
  }

  formatMarkdown(text) {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/40 text-cyan-300 font-mono text-[11px]">$1</code>')
      .replace(/\n- (.*?)/g, '<br>• $1')
      .replace(/\n/g, '<br>');
    return formatted;
  }

  scrollToBottom() {
    if (this.chatBody) {
      setTimeout(() => {
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
      }, 50);
    }
  }

  updateVisibility(isOpen) {
    if (!this.container) return;
    const badge = document.getElementById('chatBadgePulse');
    if (isOpen) {
      this.container.classList.remove('hidden', 'scale-95', 'opacity-0');
      this.container.classList.add('scale-100', 'opacity-100');
      if (badge) badge.classList.add('hidden');
      setTimeout(() => {
        if (this.inputEl) this.inputEl.focus();
        this.scrollToBottom();
      }, 100);
    } else {
      this.container.classList.add('scale-95', 'opacity-0');
      setTimeout(() => this.container.classList.add('hidden'), 200);
    }
  }

  handleUserSend() {
    const query = this.inputEl.value.trim();
    if (!query || this.isTyping) return;
    this.sendQuery(query);
    this.inputEl.value = '';
  }

  sendQuery(query) {
    if (this.isTyping) return;

    // 1. Add user message
    window.chronovaState.addChatMessage('user', query);

    // 2. Open chat if not open
    if (!window.chronovaState.isChatOpen) {
      window.chronovaState.toggleChat(true);
    }

    // 3. Show typing indicator
    this.isTyping = true;
    this.showTypingIndicator();

    // 4. Process response with realistic delay
    setTimeout(() => {
      this.removeTypingIndicator();
      const reply = this.generateResponse(query);
      window.chronovaState.addChatMessage('bot', reply.text, reply.action);
      this.isTyping = false;
    }, 650);
  }

  showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.id = 'chatTypingIndicator';
    typingEl.className = 'flex items-center gap-2 text-xs text-slate-400 p-2 animate-pulse';
    typingEl.innerHTML = `
      <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
      <div class="w-2 h-2 rounded-full bg-cyan-400 animation-delay-200"></div>
      <div class="w-2 h-2 rounded-full bg-cyan-400 animation-delay-400"></div>
      <span class="ml-1 text-[11px] font-mono">ChronoBot is searching knowledge base...</span>
    `;
    this.chatBody.appendChild(typingEl);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const el = document.getElementById('chatTypingIndicator');
    if (el) el.remove();
  }

  generateResponse(query) {
    const qLower = query.toLowerCase();

    // A. Check FAQ knowledge matches
    const faqs = CHRONOVA_DATA.chatKnowledge.faqs;
    for (const faq of faqs) {
      const match = faq.keywords.some(k => qLower.includes(k.toLowerCase()));
      if (match) {
        return {
          text: faq.response,
          action: faq.actionType ? {
            type: faq.actionType,
            id: faq.actionId,
            label: faq.actionLabel
          } : null
        };
      }
    }

    // B. Search through live Events
    const matchingEvent = window.chronovaState.events.find(e => 
      e.title.toLowerCase().includes(qLower) || 
      e.category.toLowerCase().includes(qLower) ||
      e.tags.some(t => qLower.includes(t.toLowerCase()))
    );

    if (matchingEvent) {
      return {
        text: `🎯 I found an event matching your search: **${matchingEvent.title}**!\n- **Category**: ${matchingEvent.category}\n- **Date**: ${matchingEvent.date} (${matchingEvent.time})\n- **Venue**: ${matchingEvent.venue}\n- **Price**: ${matchingEvent.price}`,
        action: {
          type: "view_event",
          id: matchingEvent.id,
          label: `Open ${matchingEvent.title.slice(0, 20)}...`
        }
      };
    }

    // C. Search through live Study Materials
    const matchingStudy = window.chronovaState.studyMaterials.find(m => 
      m.title.toLowerCase().includes(qLower) || 
      m.code.toLowerCase().includes(qLower) ||
      m.department.toLowerCase().includes(qLower) ||
      m.description.toLowerCase().includes(qLower)
    );

    if (matchingStudy) {
      return {
        text: `📚 I found relevant study material: **${matchingStudy.title}** (${matchingStudy.code})!\n- **Department**: ${matchingStudy.department}\n- **Semester**: ${matchingStudy.semester} | **Format**: ${matchingStudy.format}\n- **Rating**: ⭐ ${matchingStudy.rating} (${matchingStudy.downloads} downloads)\n- **Author**: ${matchingStudy.author}`,
        action: {
          type: "view_study",
          id: matchingStudy.id,
          label: "Read & Preview Material"
        }
      };
    }

    // D. Search through Clubs
    const matchingClub = window.chronovaState.clubs.find(c => 
      c.name.toLowerCase().includes(qLower) || 
      c.tagline.toLowerCase().includes(qLower) ||
      c.description.toLowerCase().includes(qLower)
    );

    if (matchingClub) {
      return {
        text: `👥 Found the **${matchingClub.name}** campus society!\n- **Lead**: ${matchingClub.lead}\n- **Members**: ${matchingClub.membersCount}\n- **Focus**: ${matchingClub.tagline}\n- **Recruitment**: ${matchingClub.recruitmentOpen ? '🟢 Applications Open' : '🔴 Closed'}`,
        action: {
          type: "view_club",
          id: matchingClub.id,
          label: "View Club Profile"
        }
      };
    }

    // E. Fallback response
    return {
      text: `🤖 I'm here to help with all things Chronova! You can try asking about:
- Upcoming hackathons, workshops, or cultural events
- Study notes & question banks for Semester 1 through 8
- Joining clubs like ChronoCode or Robotics Guild
- How to log in as a Student or Admin

Or pick one of the quick chips above!`,
      action: {
        type: "switch_mode",
        id: "events",
        label: "Browse All Events"
      }
    };
  }

  triggerAction(type, id) {
    if (type === 'view_event') {
      window.ChronovaApp.openEventDetails(id);
    } else if (type === 'view_study') {
      window.ChronovaApp.openStudyPreview(id);
    } else if (type === 'view_club') {
      window.ChronovaApp.openClubDetails(id);
    } else if (type === 'switch_mode') {
      window.chronovaState.setMode(id);
    } else if (type === 'open_login') {
      window.ChronovaApp.openAuthModal(id);
    }
  }
}

window.chronoBot = new ChronoBot();
