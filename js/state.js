// Chronova 2.0 - Reactive State Store
// Centralized store for Modes, Auth, Filters, Bookmarks, and UI Events

class ChronovaState {
  constructor() {
    // 1. Core Mode: 'events' | 'study' | 'clubs' | 'calendar'
    this.currentMode = 'events';

    // 2. Authentication State
    this.currentUser = null; // null or user object from CHRONOVA_DATA.users

    // 3. Filter States
    this.filters = {
      events: {
        category: 'all',    // all, hackathons, workshops, talks, cultural, sports
        status: 'all',      // all, upcoming, ongoing
        searchQuery: ''
      },
      study: {
        department: 'all',  // all, Computer Science, AI & Data Science, Mathematics, Electronics & Comm, Information Technology
        semester: 'all',    // all, 1, 2, 3, 4, 5, 6, 7, 8
        type: 'all',        // all, notes, cheatsheet, questionbank, labmanual, video
        searchQuery: ''
      },
      clubs: {
        category: 'all',    // all, technical, creative, sports, cultural
        searchQuery: ''
      }
    };

    // 4. User data overrides (persisted to localStorage)
    this.savedMaterialIds = new Set();
    this.registeredEventIds = new Set();
    this.joinedClubIds = new Set();

    // 5. Dynamic data arrays (can be added to at runtime by Admin!)
    this.events = [...CHRONOVA_DATA.events];
    this.studyMaterials = [...CHRONOVA_DATA.studyMaterials];
    this.clubs = [...CHRONOVA_DATA.clubs];

    // 6. Chat state
    this.isChatOpen = false;
    this.unreadChatCount = 0;
    this.chatHistory = [
      {
        sender: 'bot',
        text: "👋 Hi there! I'm **ChronoBot**, your 24/7 campus guide. Ask me anything about upcoming hackathons, semester study notes, joining clubs, or how to use Chronova!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionChip: null
      }
    ];

    // 7. Event listeners registry
    this.listeners = [];

    // Load initial storage
    this.loadPersistence();
  }

  // Subscribe to state updates
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(eventKey, payload = {}) {
    this.listeners.forEach(cb => {
      try {
        cb(eventKey, payload, this);
      } catch (err) {
        console.error("State listener error:", err);
      }
    });
  }

  loadPersistence() {
    try {
      const savedAuth = localStorage.getItem('chronova_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (CHRONOVA_DATA.users[parsed.role]) {
          this.currentUser = { ...CHRONOVA_DATA.users[parsed.role], ...parsed };
        }
      }

      const savedBookmarks = localStorage.getItem('chronova_bookmarks');
      if (savedBookmarks) {
        this.savedMaterialIds = new Set(JSON.parse(savedBookmarks));
      } else if (this.currentUser) {
        this.savedMaterialIds = new Set(this.currentUser.savedMaterialIds || []);
      }

      const savedRegs = localStorage.getItem('chronova_registrations');
      if (savedRegs) {
        this.registeredEventIds = new Set(JSON.parse(savedRegs));
      } else if (this.currentUser) {
        this.registeredEventIds = new Set(this.currentUser.registeredEventIds || []);
      }

      const savedClubs = localStorage.getItem('chronova_clubs');
      if (savedClubs) {
        this.joinedClubIds = new Set(JSON.parse(savedClubs));
      } else if (this.currentUser) {
        this.joinedClubIds = new Set(this.currentUser.joinedClubIds || []);
      }
    } catch (e) {
      console.warn("Storage access restricted or empty:", e);
    }
  }

  savePersistence() {
    try {
      if (this.currentUser) {
        localStorage.setItem('chronova_auth', JSON.stringify({
          role: this.currentUser.role,
          name: this.currentUser.name,
          email: this.currentUser.email
        }));
      } else {
        localStorage.removeItem('chronova_auth');
      }

      localStorage.setItem('chronova_bookmarks', JSON.stringify([...this.savedMaterialIds]));
      localStorage.setItem('chronova_registrations', JSON.stringify([...this.registeredEventIds]));
      localStorage.setItem('chronova_clubs', JSON.stringify([...this.joinedClubIds]));
    } catch (e) {
      console.warn("Failed saving state:", e);
    }
  }

  // Mode Switcher
  setMode(mode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;
    document.body.classList.remove('mode-events', 'mode-study', 'mode-clubs');
    document.body.classList.add(`mode-${mode}`);
    this.notify('mode_changed', { mode });
  }

  // Auth actions
  login(role, customData = {}) {
    if (CHRONOVA_DATA.users[role]) {
      this.currentUser = { ...CHRONOVA_DATA.users[role], ...customData };
      if (role === 'student') {
        this.currentUser.savedMaterialIds.forEach(id => this.savedMaterialIds.add(id));
        this.currentUser.registeredEventIds.forEach(id => this.registeredEventIds.add(id));
        this.currentUser.joinedClubIds.forEach(id => this.joinedClubIds.add(id));
      }
      this.savePersistence();
      this.notify('auth_changed', { user: this.currentUser });
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
    this.savePersistence();
    this.notify('auth_changed', { user: null });
  }

  // Filter setters
  setEventFilter(key, value) {
    this.filters.events[key] = value;
    this.notify('filters_changed', { type: 'events', key, value });
  }

  setStudyFilter(key, value) {
    this.filters.study[key] = value;
    this.notify('filters_changed', { type: 'study', key, value });
  }

  setClubFilter(key, value) {
    this.filters.clubs[key] = value;
    this.notify('filters_changed', { type: 'clubs', key, value });
  }

  // Toggle Bookmark
  toggleBookmark(materialId) {
    const isSaved = this.savedMaterialIds.has(materialId);
    if (isSaved) {
      this.savedMaterialIds.delete(materialId);
    } else {
      this.savedMaterialIds.add(materialId);
    }
    this.savePersistence();
    this.notify('bookmark_toggled', { materialId, isSaved: !isSaved });
    return !isSaved;
  }

  // Register for Event
  registerForEvent(eventId, studentDetails = {}) {
    this.registeredEventIds.add(eventId);
    const event = this.events.find(e => e.id === eventId);
    if (event && event.registered < event.capacity) {
      event.registered += 1;
    }
    this.savePersistence();
    this.notify('event_registered', { eventId, details: studentDetails });
    return event;
  }

  // Join Club
  joinClub(clubId, application = {}) {
    this.joinedClubIds.add(clubId);
    const club = this.clubs.find(c => c.id === clubId);
    if (club) {
      club.membersCount += 1;
    }
    this.savePersistence();
    this.notify('club_joined', { clubId, application });
    return club;
  }

  // Admin: Add New Event
  addNewEvent(newEvent) {
    const created = {
      id: `evt-${Date.now()}`,
      registered: 0,
      featured: false,
      ...newEvent
    };
    this.events.unshift(created);
    this.notify('data_added', { type: 'event', item: created });
    return created;
  }

  // Admin: Add New Study Material
  addNewMaterial(newMat) {
    const created = {
      id: `mat-${Date.now()}`,
      downloads: 0,
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      uploadDate: "Just now",
      ...newMat
    };
    this.studyMaterials.unshift(created);
    this.notify('data_added', { type: 'material', item: created });
    return created;
  }

  // Chat message management
  addChatMessage(sender, text, action = null) {
    const msg = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action
    };
    this.chatHistory.push(msg);
    if (!this.isChatOpen && sender === 'bot') {
      this.unreadChatCount += 1;
    }
    this.notify('chat_updated', { message: msg });
    return msg;
  }

  clearChat() {
    this.chatHistory = [
      {
        sender: 'bot',
        text: "👋 Chat reset. Ask me anything about Chronova events, study materials, or campus clubs!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: null
      }
    ];
    this.unreadChatCount = 0;
    this.notify('chat_cleared');
  }

  toggleChat(forceOpen = null) {
    this.isChatOpen = forceOpen !== null ? forceOpen : !this.isChatOpen;
    if (this.isChatOpen) {
      this.unreadChatCount = 0;
    }
    this.notify('chat_visibility_changed', { isOpen: this.isChatOpen });
  }
}

// Global single instance
window.chronovaState = new ChronovaState();
