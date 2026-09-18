// Chronova 2.0 - Core Application Orchestrator
// Handlers, Interactivity, Real-time Countdown Loop, Modals & Dynamic Views

const ChronovaApp = {
  countdownTimerId: null,

  init() {
    // 0. Support URL query params (?mode=study, ?mode=clubs)
    const urlParams = new URLSearchParams(window.location.search);
    const initialMode = urlParams.get('mode');
    if (initialMode && ['events', 'study', 'clubs'].includes(initialMode)) {
      window.chronovaState.currentMode = initialMode;
    }

    // 1. Initial State subscription
    window.chronovaState.subscribe((event, payload) => {
      this.handleStateChange(event, payload);
    });

    // 2. Initialize Chatbot
    if (window.chronoBot) {
      window.chronoBot.init();
    }

    // 3. Render Initial View
    this.renderHeaderAuth();
    this.renderHeroStats();
    this.updateModeUI(window.chronovaState.currentMode);
    this.renderMainContent();
    this.startCountdownLoop();

    // 4. Attach global event listeners
    this.attachEventListeners();

    // 5. Initial icons hydration
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // 6. Deep link auto-open (?open=login or ?open=chat)
    const openTarget = urlParams.get('open');
    if (openTarget === 'login') {
      setTimeout(() => this.openAuthModal(urlParams.get('role') || 'student'), 150);
    } else if (openTarget === 'chat') {
      setTimeout(() => window.chronovaState.toggleChat(true), 150);
    }

    console.log("⚡ Chronova 2.0 SPA Initialized successfully!");
  },

  attachEventListeners() {
    // Search input listener
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const mode = window.chronovaState.currentMode;
        if (mode === 'events') {
          window.chronovaState.setEventFilter('searchQuery', e.target.value);
        } else if (mode === 'study') {
          window.chronovaState.setStudyFilter('searchQuery', e.target.value);
        } else if (mode === 'clubs') {
          window.chronovaState.setClubFilter('searchQuery', e.target.value);
        }
      });
    }

    // ESC key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
      // Shortcut '/' to search
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const search = document.getElementById('globalSearchInput');
        if (search) search.focus();
      }
    });
  },

  handleStateChange(event, payload) {
    if (event === 'mode_changed') {
      this.updateModeUI(payload.mode);
      this.renderMainContent();
    } else if (event === 'filters_changed' || event === 'data_added' || event === 'bookmark_toggled' || event === 'event_registered' || event === 'club_joined') {
      this.renderMainContent();
      this.renderHeroStats();
    } else if (event === 'auth_changed') {
      this.renderHeaderAuth();
      this.renderHeroStats();
      this.renderMainContent();
    }
  },

  // Switch Active Mode ('events' | 'study' | 'clubs')
  setMode(mode) {
    window.chronovaState.setMode(mode);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', mode);
      window.history.replaceState({}, '', url);
    } catch (e) {}
  },

  updateModeUI(mode) {
    // 1. Update pill toggle buttons
    const buttons = document.querySelectorAll('.mode-toggle-btn');
    buttons.forEach(btn => {
      const btnMode = btn.getAttribute('data-mode');
      if (btnMode === mode) {
        btn.classList.add('active', 'text-white');
        btn.classList.remove('text-slate-400');
      } else {
        btn.classList.remove('active', 'text-white');
        btn.classList.add('text-slate-400');
      }
    });

    // 2. Reposition slider pill
    const slider = document.getElementById('modeToggleSlider');
    const activeBtn = document.querySelector(`.mode-toggle-btn[data-mode="${mode}"]`);
    if (slider && activeBtn) {
      const parentRect = activeBtn.parentElement.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      slider.style.width = `${btnRect.width}px`;
      slider.style.left = `${btnRect.left - parentRect.left}px`;
    }

    // 3. Update Hero Title & Description
    const heroTitle = document.getElementById('heroTitle');
    const heroSub = document.getElementById('heroSubtitle');
    const heroBadge = document.getElementById('heroModeBadge');

    if (mode === 'events') {
      if (heroBadge) heroBadge.innerHTML = `<i data-lucide="sparkles" class="w-3.5 h-3.5 text-cyan-400"></i> CAMPUS EVENT PORTAL`;
      if (heroTitle) heroTitle.innerHTML = `Unleash Your <span class="accent-gradient-text">Campus Energy</span> & Compete`;
      if (heroSub) heroSub.textContent = `Discover hackathons, live robotics races, developer workshops, and cultural galas. Register in one click with verified digital passes.`;
    } else if (mode === 'study') {
      if (heroBadge) heroBadge.innerHTML = `<i data-lucide="book-open" class="w-3.5 h-3.5 text-violet-400"></i> STUDY MATERIAL HUB`;
      if (heroTitle) heroTitle.innerHTML = `Master Every <span class="accent-gradient-text">Subject & Semester</span>`;
      if (heroSub) heroSub.textContent = `High-yield lecture notes, 10-year solved question banks, interactive cheatsheets, and verified faculty guides curated by university rankers.`;
    } else if (mode === 'clubs') {
      if (heroBadge) heroBadge.innerHTML = `<i data-lucide="users" class="w-3.5 h-3.5 text-emerald-400"></i> STUDENT CLUBS & SOCIETIES`;
      if (heroTitle) heroTitle.innerHTML = `Connect With <span class="accent-gradient-text">Passionate Communities</span>`;
      if (heroSub) heroSub.textContent = `Find your tribe among technical developer collectives, robotics guilds, design studios, and competitive e-sports leagues.`;
    }

    // 4. Update Filter Bar Markup
    this.renderFilterBar(mode);

    // 5. Update Admin Action Bar
    this.renderAdminBar();

    if (window.lucide) window.lucide.createIcons();
  },

  renderFilterBar(mode) {
    const filterContainer = document.getElementById('modeFilterControls');
    if (!filterContainer) return;

    if (mode === 'events') {
      const activeCat = window.chronovaState.filters.events.category;
      const categories = [
        { key: 'all', label: 'All Events' },
        { key: 'hackathons', label: 'Hackathons 🚀' },
        { key: 'workshops', label: 'Workshops 🛠️' },
        { key: 'cultural', label: 'Cultural & Arts 🎭' },
        { key: 'talks', label: 'Guest Talks 🎤' },
        { key: 'sports', label: 'Gaming & Sports 🎮' }
      ];

      filterContainer.innerHTML = `
        <div class="flex items-center justify-between gap-4 flex-wrap w-full">
          <!-- Categories -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            ${categories.map(cat => `
              <button onclick="ChronovaApp.setEventCategory('${cat.key}')" 
                      class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        activeCat === cat.key
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-900/60 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                      }">
                ${cat.label}
              </button>
            `).join('')}
          </div>

          <!-- Status toggle -->
          <div class="flex items-center gap-2 text-xs">
            <span class="text-slate-400 text-xs hidden sm:inline">Status:</span>
            <select onchange="ChronovaApp.setEventStatus(this.value)" 
                    class="glass-input text-xs rounded-xl px-3 py-1.5 cursor-pointer bg-slate-900 text-slate-200">
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming Only</option>
              <option value="ongoing">Live / Ongoing</option>
            </select>
          </div>
        </div>
      `;
    } else if (mode === 'study') {
      const activeType = window.chronovaState.filters.study.type;
      const types = [
        { key: 'all', label: 'All Resources' },
        { key: 'notes', label: 'Lecture Notes 📘' },
        { key: 'cheatsheet', label: 'Cheat Sheets ⚡' },
        { key: 'questionbank', label: 'Question Banks 📝' },
        { key: 'labmanual', label: 'Lab Manuals 🔬' },
        { key: 'video', label: 'Video Masterclasses 🎬' }
      ];

      filterContainer.innerHTML = `
        <div class="flex items-center justify-between gap-4 flex-wrap w-full">
          <!-- Resource Types -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            ${types.map(t => `
              <button onclick="ChronovaApp.setStudyType('${t.key}')" 
                      class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        activeType === t.key
                          ? 'bg-violet-600 text-white font-bold shadow-lg shadow-violet-600/25'
                          : 'bg-slate-900/60 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                      }">
                ${t.label}
              </button>
            `).join('')}
          </div>

          <!-- Dropdowns: Department & Semester -->
          <div class="flex items-center gap-2 text-xs">
            <select onchange="ChronovaApp.setStudyDepartment(this.value)" 
                    class="glass-input text-xs rounded-xl px-3 py-1.5 cursor-pointer bg-slate-900 text-slate-200">
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="AI & Data Science">AI & Data Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Electronics & Comm">Electronics</option>
              <option value="Information Technology">Information Tech</option>
            </select>

            <select onchange="ChronovaApp.setStudySemester(this.value)" 
                    class="glass-input text-xs rounded-xl px-3 py-1.5 cursor-pointer bg-slate-900 text-slate-200">
              <option value="all">All Semesters</option>
              <option value="1">Sem 1</option>
              <option value="2">Sem 2</option>
              <option value="3">Sem 3</option>
              <option value="4">Sem 4</option>
              <option value="5">Sem 5</option>
              <option value="6">Sem 6</option>
              <option value="7">Sem 7</option>
              <option value="8">Sem 8</option>
            </select>
          </div>
        </div>
      `;
    } else if (mode === 'clubs') {
      const activeCat = window.chronovaState.filters.clubs.category;
      const categories = [
        { key: 'all', label: 'All Societies' },
        { key: 'technical', label: 'Tech & Code 💻' },
        { key: 'creative', label: 'Design & Creative 🎨' },
        { key: 'sports', label: 'E-Sports & Sports 🏆' },
        { key: 'cultural', label: 'Arts & Culture ✨' }
      ];

      filterContainer.innerHTML = `
        <div class="flex items-center justify-between gap-4 flex-wrap w-full">
          <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            ${categories.map(cat => `
              <button onclick="ChronovaApp.setClubCategory('${cat.key}')" 
                      class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        activeCat === cat.key
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-900/60 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                      }">
                ${cat.label}
              </button>
            `).join('')}
          </div>
          <span class="text-xs text-slate-400 font-mono">
            ${window.chronovaState.clubs.length} Verified Student Guilds
          </span>
        </div>
      `;
    }
  },

  renderMainContent() {
    const gridContainer = document.getElementById('mainCardsGrid');
    const timelineContainer = document.getElementById('timelineContainer');
    if (!gridContainer) return;

    const mode = window.chronovaState.currentMode;

    if (mode === 'events') {
      const events = this.getFilteredEvents();
      if (events.length === 0) {
        gridContainer.innerHTML = this.renderEmptyState("No events match your selected filters.");
      } else {
        gridContainer.innerHTML = events.map(evt => {
          const isReg = window.chronovaState.registeredEventIds.has(evt.id);
          return ChronovaComponents.renderEventCard(evt, isReg);
        }).join('');
      }

      // Show Timeline preview in Event mode
      if (timelineContainer) {
        timelineContainer.classList.remove('hidden');
        timelineContainer.innerHTML = ChronovaComponents.renderTimelineSection(window.chronovaState.events);
      }
    } else if (mode === 'study') {
      const materials = this.getFilteredStudyMaterials();
      if (materials.length === 0) {
        gridContainer.innerHTML = this.renderEmptyState("No study materials found for this criteria.");
      } else {
        gridContainer.innerHTML = materials.map(mat => {
          const isSaved = window.chronovaState.savedMaterialIds.has(mat.id);
          return ChronovaComponents.renderStudyCard(mat, isSaved);
        }).join('');
      }

      if (timelineContainer) {
        timelineContainer.classList.add('hidden');
      }
    } else if (mode === 'clubs') {
      const clubs = this.getFilteredClubs();
      if (clubs.length === 0) {
        gridContainer.innerHTML = this.renderEmptyState("No clubs match your query.");
      } else {
        gridContainer.innerHTML = clubs.map(club => {
          const isJoined = window.chronovaState.joinedClubIds.has(club.id);
          return ChronovaComponents.renderClubCard(club, isJoined);
        }).join('');
      }

      if (timelineContainer) {
        timelineContainer.classList.add('hidden');
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  renderEmptyState(message) {
    return `
      <div class="col-span-full py-16 text-center glass-panel rounded-2xl border border-white/10">
        <i data-lucide="search-x" class="w-12 h-12 text-slate-500 mx-auto mb-3"></i>
        <h4 class="text-base font-bold text-white mb-1">No Results Found</h4>
        <p class="text-xs text-slate-400 mb-4 max-w-sm mx-auto">${message}</p>
        <button onclick="ChronovaApp.resetFilters()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white border border-white/10">
          Reset All Filters
        </button>
      </div>
    `;
  },

  resetFilters() {
    window.chronovaState.filters.events = { category: 'all', status: 'all', searchQuery: '' };
    window.chronovaState.filters.study = { department: 'all', semester: 'all', type: 'all', searchQuery: '' };
    window.chronovaState.filters.clubs = { category: 'all', searchQuery: '' };
    const search = document.getElementById('globalSearchInput');
    if (search) search.value = '';
    this.renderFilterBar(window.chronovaState.currentMode);
    this.renderMainContent();
  },

  getFilteredEvents() {
    const { category, status, searchQuery } = window.chronovaState.filters.events;
    return window.chronovaState.events.filter(e => {
      const matchesCat = category === 'all' || e.category === category;
      const matchesStatus = status === 'all' || e.status === status;
      const matchesSearch = !searchQuery || 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesStatus && matchesSearch;
    });
  },

  getFilteredStudyMaterials() {
    const { department, semester, type, searchQuery } = window.chronovaState.filters.study;
    return window.chronovaState.studyMaterials.filter(m => {
      const matchesDept = department === 'all' || m.department === department;
      const matchesSem = semester === 'all' || m.semester.toString() === semester.toString();
      const matchesType = type === 'all' || m.type === type;
      const matchesSearch = !searchQuery || 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSem && matchesType && matchesSearch;
    });
  },

  getFilteredClubs() {
    const { category, searchQuery } = window.chronovaState.filters.clubs;
    return window.chronovaState.clubs.filter(c => {
      const matchesCat = category === 'all' || c.category === category;
      const matchesSearch = !searchQuery || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lead.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  },

  // Hero section stats counter
  renderHeroStats() {
    const statsContainer = document.getElementById('heroStatsRow');
    if (!statsContainer) return;

    const totalEvents = window.chronovaState.events.length;
    const totalMaterials = window.chronovaState.studyMaterials.length;
    const totalClubs = window.chronovaState.clubs.length;
    const totalRegistered = window.chronovaState.registeredEventIds.size;

    statsContainer.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <i data-lucide="sparkles" class="w-5 h-5"></i>
        </div>
        <div>
          <span class="block text-lg font-black font-mono text-white">${totalEvents}+ Active</span>
          <span class="text-[11px] text-slate-400">Hackathons & Meets</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <i data-lucide="book-open" class="w-5 h-5"></i>
        </div>
        <div>
          <span class="block text-lg font-black font-mono text-white">${totalMaterials * 150}+</span>
          <span class="text-[11px] text-slate-400">Verified Notes & Solved Papers</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <i data-lucide="users" class="w-5 h-5"></i>
        </div>
        <div>
          <span class="block text-lg font-black font-mono text-white">${totalClubs} Societies</span>
          <span class="text-[11px] text-slate-400">Campus Guilds</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <i data-lucide="check-circle" class="w-5 h-5"></i>
        </div>
        <div>
          <span class="block text-lg font-black font-mono text-white">${totalRegistered} Enrolled</span>
          <span class="text-[11px] text-slate-400">Your Activity</span>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: statsContainer });
  },

  // Auth & Header Profile
  renderHeaderAuth() {
    const authBtnContainer = document.getElementById('navAuthContainer');
    if (!authBtnContainer) return;

    const user = window.chronovaState.currentUser;
    if (user) {
      const isAdmin = user.role === 'admin';
      authBtnContainer.innerHTML = `
        <div class="flex items-center gap-3">
          <button onclick="ChronovaApp.openBookmarksDrawer()" 
                  class="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-white/10 relative transition-colors"
                  title="My Bookmarks & Passes">
            <i data-lucide="bookmark" class="w-4 h-4"></i>
            ${window.chronovaState.savedMaterialIds.size > 0 ? `
              <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center font-mono">
                ${window.chronovaState.savedMaterialIds.size}
              </span>
            ` : ''}
          </button>

          <div class="flex items-center gap-2 pl-2 border-l border-white/10">
            <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-xl object-cover border border-cyan-400/40" />
            <div class="hidden md:block text-left">
              <span class="text-xs font-bold text-white block leading-tight truncate max-w-[120px]">${user.name}</span>
              <span class="text-[10px] uppercase font-mono tracking-wider ${isAdmin ? 'text-amber-400 font-bold' : 'text-cyan-400'}">
                ${isAdmin ? '★ Admin Mode' : '● Student'}
              </span>
            </div>
          </div>

          <button onclick="ChronovaApp.handleLogout()" 
                  class="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-500/10 border border-white/10 transition-colors"
                  title="Sign Out">
            <i data-lucide="log-out" class="w-4 h-4"></i>
          </button>
        </div>
      `;
    } else {
      authBtnContainer.innerHTML = `
        <button onclick="ChronovaApp.openAuthModal('student')" 
                class="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 shadow-sm">
          <i data-lucide="log-in" class="w-4 h-4"></i>
          <span>Log In</span>
        </button>
      `;
    }

    if (window.lucide) window.lucide.createIcons({ root: authBtnContainer });
  },

  // Floating Admin Bar
  renderAdminBar() {
    const adminBar = document.getElementById('floatingAdminBar');
    if (!adminBar) return;

    const user = window.chronovaState.currentUser;
    if (user && user.role === 'admin') {
      adminBar.classList.remove('hidden');
    } else {
      adminBar.classList.add('hidden');
    }
  },

  // Real-time countdown loop for all cards
  startCountdownLoop() {
    if (this.countdownTimerId) clearInterval(this.countdownTimerId);

    const updateClocks = () => {
      const countdownEls = document.querySelectorAll('.event-countdown');
      const now = new Date().getTime();

      countdownEls.forEach(el => {
        const targetStr = el.getAttribute('data-target');
        if (!targetStr) return;

        const target = new Date(targetStr).getTime();
        const diff = target - now;

        if (diff <= 0) {
          el.innerHTML = `<span class="text-rose-400 font-bold animate-pulse">In Progress</span>`;
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);

          el.innerHTML = `${days}d ${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
        }
      });
    };

    updateClocks();
    this.countdownTimerId = setInterval(updateClocks, 1000);
  },

  // Filter dispatchers
  setEventCategory(cat) {
    window.chronovaState.setEventFilter('category', cat);
    this.renderFilterBar('events');
  },

  setEventStatus(status) {
    window.chronovaState.setEventFilter('status', status);
  },

  setStudyType(type) {
    window.chronovaState.setStudyFilter('type', type);
    this.renderFilterBar('study');
  },

  setStudyDepartment(dept) {
    window.chronovaState.setStudyFilter('department', dept);
  },

  setStudySemester(sem) {
    window.chronovaState.setStudyFilter('semester', sem);
  },

  setClubCategory(cat) {
    window.chronovaState.setClubFilter('category', cat);
    this.renderFilterBar('clubs');
  },

  // Bookmark Toggle
  toggleBookmark(matId, event) {
    if (event) event.stopPropagation();
    const isNowSaved = window.chronovaState.toggleBookmark(matId);
    const mat = window.chronovaState.studyMaterials.find(m => m.id === matId);
    const title = mat ? mat.title : 'Study Resource';

    ChronovaComponents.showToast(
      isNowSaved ? 'Saved to Bookmarks' : 'Removed from Bookmarks',
      isNowSaved ? `"${title}" is saved for offline review.` : `"${title}" removed from your list.`,
      isNowSaved ? 'success' : 'info'
    );
  },

  // Download Simulated Action
  downloadMaterial(matId) {
    const mat = window.chronovaState.studyMaterials.find(m => m.id === matId);
    if (!mat) return;

    mat.downloads += 1;
    ChronovaComponents.showToast(
      'Downloading File',
      `Downloading "${mat.title}.${mat.format.toLowerCase()}" (${mat.size})...`,
      'info'
    );

    setTimeout(() => {
      ChronovaComponents.showToast(
        'Download Complete',
        `Successfully saved ${mat.title}.${mat.format.toLowerCase()} to your device.`,
        'success'
      );
      this.renderMainContent();
    }, 1200);
  },

  // Modal Openers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons({ root: modal });
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  },

  closeAllModals() {
    const modals = document.querySelectorAll('.chronova-modal');
    modals.forEach(m => m.classList.add('hidden'));
    document.body.style.overflow = 'auto';
  },

  // Event Details Modal
  openEventDetails(eventId) {
    const event = window.chronovaState.events.find(e => e.id === eventId);
    if (!event) return;

    const modalBody = document.getElementById('eventDetailsModalContent');
    const isRegistered = window.chronovaState.registeredEventIds.has(eventId);

    modalBody.innerHTML = `
      <div class="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl">
        <img src="${event.coverImage}" alt="${event.title}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/60 to-transparent"></div>
        <button onclick="ChronovaApp.closeModal('eventDetailsModal')" 
                class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors border border-white/20">
          ✕
        </button>

        <div class="absolute bottom-6 left-6 right-6">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              ${event.category}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900/80 text-amber-300 border border-amber-500/30">
              ${event.price}
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white leading-tight">${event.title}</h2>
        </div>
      </div>

      <div class="p-6 sm:p-8 space-y-6">
        <!-- Quick Meta grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 text-xs">
          <div>
            <span class="text-slate-500 block uppercase text-[10px]">Date & Time</span>
            <span class="font-bold text-white">${event.date}</span>
            <span class="text-cyan-400 block">${event.time}</span>
          </div>
          <div>
            <span class="text-slate-500 block uppercase text-[10px]">Venue / Location</span>
            <span class="font-bold text-white">${event.venue}</span>
          </div>
          <div>
            <span class="text-slate-500 block uppercase text-[10px]">Organizer</span>
            <span class="font-bold text-white">${event.clubName}</span>
          </div>
          <div>
            <span class="text-slate-500 block uppercase text-[10px]">Capacity</span>
            <span class="font-mono font-bold text-amber-400">${event.registered} / ${event.capacity} Registered</span>
          </div>
        </div>

        <!-- Details -->
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <i data-lucide="file-text" class="w-4 h-4 text-cyan-400"></i> Event Overview
          </h3>
          <p class="text-sm text-slate-300 leading-relaxed">${event.fullDetails || event.description}</p>
        </div>

        <!-- Speaker / Host info if available -->
        ${event.speaker ? `
          <div class="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center gap-3">
            <i data-lucide="mic" class="w-5 h-5 text-cyan-400"></i>
            <div>
              <span class="text-xs text-slate-400 block">Featured Keynote Speaker / Judge:</span>
              <span class="text-sm font-bold text-white">${event.speaker}</span>
            </div>
          </div>
        ` : ''}

        <!-- Schedule -->
        ${event.schedule ? `
          <div>
            <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <i data-lucide="list-ordered" class="w-4 h-4 text-cyan-400"></i> Event Schedule Breakdown
            </h3>
            <div class="space-y-2 border-l-2 border-cyan-500/40 pl-4">
              ${event.schedule.map(s => `
                <div class="text-xs">
                  <span class="font-mono text-cyan-400 font-bold">${s.time}</span>
                  <p class="text-slate-200 font-medium">${s.title}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Registration CTA row -->
        <div class="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <div>
            <span class="text-xs text-slate-400">Registration Status:</span>
            <span class="block text-sm font-bold ${isRegistered ? 'text-emerald-400' : 'text-white'}">
              ${isRegistered ? '✓ You are Registered' : 'Registration Open for all Students'}
            </span>
          </div>
          <button onclick="ChronovaApp.handleEventRegistrationTrigger('${event.id}')" 
                  class="py-3 px-6 rounded-xl text-sm font-bold ${
                    isRegistered
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'accent-glow-btn text-white'
                  } transition-all flex items-center gap-2">
            <i data-lucide="${isRegistered ? 'ticket' : 'check-circle'}" class="w-4 h-4"></i>
            ${isRegistered ? 'View Digital Pass' : 'Claim Free Pass'}
          </button>
        </div>
      </div>
    `;

    this.openModal('eventDetailsModal');
  },

  // Registration Trigger -> either show ticket or registration form modal
  handleEventRegistrationTrigger(eventId) {
    const isRegistered = window.chronovaState.registeredEventIds.has(eventId);
    const event = window.chronovaState.events.find(e => e.id === eventId);
    if (!event) return;

    if (isRegistered) {
      // Show ticket pass modal
      this.showTicketModal(event);
    } else {
      // Show registration form modal
      this.showRegisterFormModal(event);
    }
  },

  showRegisterFormModal(event) {
    const user = window.chronovaState.currentUser || {};
    const content = document.getElementById('eventRegisterModalContent');

    content.innerHTML = `
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <span class="text-xs font-mono uppercase text-cyan-400 block">Instant Student Enrollment</span>
            <h2 class="text-xl font-bold text-white">${event.title}</h2>
          </div>
          <button onclick="ChronovaApp.closeModal('eventRegisterModal')" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onsubmit="ChronovaApp.submitEventRegistration(event, '${event.id}')" class="space-y-4 text-xs">
          <div>
            <label class="block text-slate-300 font-semibold mb-1.5">Full Name</label>
            <input type="text" id="regName" required value="${user.name || ''}" placeholder="e.g. Arya Patel" 
                   class="glass-input w-full px-3.5 py-2.5 rounded-xl" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-300 font-semibold mb-1.5">Campus Email</label>
              <input type="email" id="regEmail" required value="${user.email || ''}" placeholder="student@chronova.edu" 
                     class="glass-input w-full px-3.5 py-2.5 rounded-xl" />
            </div>
            <div>
              <label class="block text-slate-300 font-semibold mb-1.5">Roll / Student ID</label>
              <input type="text" id="regId" required value="${user.studentId || ''}" placeholder="CHRO-2024-CS089" 
                     class="glass-input w-full px-3.5 py-2.5 rounded-xl" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-300 font-semibold mb-1.5">Department</label>
              <select id="regDept" class="glass-input w-full px-3.5 py-2.5 rounded-xl bg-slate-900">
                <option value="Computer Science">Computer Science</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Electronics & Comm">Electronics</option>
                <option value="Mechanical / Mechatronics">Mechanical</option>
                <option value="Information Tech">Information Tech</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-300 font-semibold mb-1.5">Semester</label>
              <select id="regSem" class="glass-input w-full px-3.5 py-2.5 rounded-xl bg-slate-900">
                <option value="4">Semester 4</option>
                <option value="2">Semester 2</option>
                <option value="6">Semester 6</option>
                <option value="8">Semester 8</option>
              </select>
            </div>
          </div>

          <div class="pt-3">
            <button type="submit" 
                    class="w-full py-3 rounded-xl font-bold text-white accent-glow-btn flex items-center justify-center gap-2 text-sm">
              <i data-lucide="zap" class="w-4 h-4"></i> Confirm & Generate Digital Ticket
            </button>
          </div>
        </form>
      </div>
    `;

    this.openModal('eventRegisterModal');
  },

  submitEventRegistration(e, eventId) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const studentId = document.getElementById('regId').value;

    const event = window.chronovaState.registerForEvent(eventId, { name, email, studentId });
    this.closeModal('eventRegisterModal');
    this.closeModal('eventDetailsModal');

    ChronovaComponents.showToast(
      'Registration Confirmed!',
      `You are successfully registered for "${event.title}". Digital pass generated.`,
      'success'
    );

    this.showTicketModal(event, { name, studentId });
  },

  showTicketModal(event, customStudent = null) {
    const user = customStudent || window.chronovaState.currentUser || { name: "Guest Student", studentId: "CHRO-STD-2026" };
    const content = document.getElementById('ticketModalContent');

    content.innerHTML = `
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <i data-lucide="ticket" class="w-4 h-4 text-cyan-400"></i> Your Digital Entry Pass
          </h2>
          <button onclick="ChronovaApp.closeModal('ticketModal')" class="text-slate-400 hover:text-white">✕</button>
        </div>

        ${ChronovaComponents.renderTicketPass(event, user)}

        <div class="mt-6 flex items-center justify-center gap-3">
          <button onclick="window.print()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-2">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print Pass
          </button>
          <button onclick="ChronovaComponents.showToast('Pass Saved', 'Saved digital pass to device photos', 'success')" class="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2">
            <i data-lucide="download" class="w-3.5 h-3.5"></i> Download Pass
          </button>
        </div>
      </div>
    `;

    this.openModal('ticketModal');
  },

  // Study Material Preview Modal
  openStudyPreview(materialId) {
    const mat = window.chronovaState.studyMaterials.find(m => m.id === materialId);
    if (!mat) return;

    const modalBody = document.getElementById('studyPreviewModalContent');

    modalBody.innerHTML = `
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                ${mat.code} • Sem ${mat.semester}
              </span>
              <span class="text-xs text-slate-400">${mat.department}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-white">${mat.title}</h2>
          </div>
          <button onclick="ChronovaApp.closeModal('studyPreviewModal')" class="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <!-- Meta Bar -->
        <div class="flex items-center justify-between flex-wrap gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-white/10">
          <span class="text-slate-300 flex items-center gap-1.5">
            <i data-lucide="user" class="w-3.5 h-3.5 text-violet-400"></i> ${mat.author}
          </span>
          <span class="text-slate-300 flex items-center gap-1.5">
            <i data-lucide="file-text" class="w-3.5 h-3.5 text-rose-400"></i> ${mat.format} (${mat.size})
          </span>
          <span class="text-amber-400 flex items-center gap-1.5 font-bold">
            <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i> ${mat.rating} (${mat.reviewsCount} reviews)
          </span>
          <span class="text-slate-400 flex items-center gap-1.5">
            <i data-lucide="download" class="w-3.5 h-3.5"></i> ${mat.downloads.toLocaleString()} downloads
          </span>
        </div>

        <!-- Document Viewer Simulator -->
        <div class="border border-white/10 rounded-2xl bg-slate-950/80 overflow-hidden">
          <div class="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-white/10 text-xs text-slate-400 font-mono">
            <span>CHRONOVA_READER v2.4 • Preview Mode</span>
            <span>Page 1 of 42</span>
          </div>

          <div class="p-6 max-h-72 overflow-y-auto space-y-4 text-xs font-sans text-slate-300 leading-relaxed">
            <h4 class="text-sm font-bold text-white mb-2">Table of Contents:</h4>
            <ul class="space-y-1.5 list-disc pl-4 text-violet-300 font-mono text-[11px]">
              ${(mat.toc || []).map(item => `<li>${item}</li>`).join('')}
            </ul>

            <h4 class="text-sm font-bold text-white mt-4 mb-2">Excerpts from Document:</h4>
            <div class="p-4 rounded-xl bg-slate-900/90 border border-white/5 font-mono text-[11px] text-slate-300 leading-normal">
              ${mat.sampleContent || mat.description}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between gap-4 pt-2">
          <button onclick="ChronovaApp.toggleBookmark('${mat.id}')" 
                  class="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-2">
            <i data-lucide="bookmark" class="w-4 h-4 text-amber-400"></i> Save for Exam
          </button>
          <button onclick="ChronovaApp.downloadMaterial('${mat.id}'); ChronovaApp.closeModal('studyPreviewModal');" 
                  class="px-6 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 flex items-center gap-2">
            <i data-lucide="download-cloud" class="w-4 h-4"></i> Download Full Material
          </button>
        </div>
      </div>
    `;

    this.openModal('studyPreviewModal');
  },

  // Club Details & Join Flow
  openClubDetails(clubId) {
    const club = window.chronovaState.clubs.find(c => c.id === clubId);
    if (!club) return;

    const modalBody = document.getElementById('clubDetailsModalContent');
    const isJoined = window.chronovaState.joinedClubIds.has(clubId);

    modalBody.innerHTML = `
      <div class="p-6 sm:p-8 space-y-6">
        <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <i data-lucide="${club.icon || 'users'}" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ${club.badge}
              </span>
              <h2 class="text-xl font-bold text-white mt-1">${club.name}</h2>
            </div>
          </div>
          <button onclick="ChronovaApp.closeModal('clubDetailsModal')" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-3">
          <p class="text-xs text-emerald-400 font-medium">"${club.tagline}"</p>
          <p class="text-xs text-slate-300 leading-relaxed">${club.description}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-xs p-4 rounded-xl bg-slate-900/60 border border-white/10">
          <div>
            <span class="text-slate-500 block uppercase text-[10px]">Club Lead</span>
            <span class="font-bold text-white">${club.lead}</span>
            <span class="text-slate-400 block">${club.leadContact}</span>
          </div>
          <div>
            <span class="text-slate-500 block uppercase text-[10px]">Community Size</span>
            <span class="font-bold text-white">${club.membersCount} Active Members</span>
            <span class="text-cyan-400 block">${club.activeEvents} Upcoming Events</span>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-bold text-slate-300 uppercase mb-2">Joining Requirements:</h4>
          <p class="text-xs text-slate-400 p-3 rounded-xl bg-slate-950/60 border border-white/5">${club.requirements}</p>
        </div>

        <div class="pt-3 border-t border-white/10 flex items-center justify-between">
          <span class="text-xs text-slate-400">
            Status: ${club.recruitmentOpen ? '<span class="text-emerald-400 font-bold">● Applications Active</span>' : '<span class="text-slate-500">Invitations Only</span>'}
          </span>
          <button onclick="ChronovaApp.handleClubJoinTrigger('${club.id}')" 
                  class="py-2.5 px-5 rounded-xl text-xs font-bold ${
                    isJoined ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  } transition-all flex items-center gap-2">
            <i data-lucide="${isJoined ? 'check-circle' : 'user-plus'}" class="w-4 h-4"></i>
            ${isJoined ? 'Already a Member' : 'Submit Application'}
          </button>
        </div>
      </div>
    `;

    this.openModal('clubDetailsModal');
  },

  handleClubJoinTrigger(clubId) {
    const isJoined = window.chronovaState.joinedClubIds.has(clubId);
    const club = window.chronovaState.clubs.find(c => c.id === clubId);
    if (!club) return;

    if (isJoined) {
      ChronovaComponents.showToast('Membership Active', `You are already an enrolled member of ${club.name}.`, 'info');
      return;
    }

    const updated = window.chronovaState.joinClub(clubId);
    this.closeModal('clubDetailsModal');
    ChronovaComponents.showToast(
      'Welcome to the Club! 🎉',
      `Your application to ${updated.name} has been approved. Check Discord server for orientation.`,
      'success'
    );
  },

  // Auth Modal & Login Flow
  openAuthModal(initialRole = 'student') {
    this.setAuthModalTab(initialRole);
    this.openModal('authModal');
  },

  setAuthModalTab(role) {
    const studentBtn = document.getElementById('authTabStudent');
    const adminBtn = document.getElementById('authTabAdmin');
    const studentForm = document.getElementById('authStudentForm');
    const adminForm = document.getElementById('authAdminForm');

    if (role === 'student') {
      studentBtn.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
      studentBtn.classList.remove('text-slate-400');
      adminBtn.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
      adminBtn.classList.add('text-slate-400');

      studentForm.classList.remove('hidden');
      adminForm.classList.add('hidden');
    } else {
      adminBtn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      adminBtn.classList.remove('text-slate-400');
      studentBtn.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
      studentBtn.classList.add('text-slate-400');

      adminForm.classList.remove('hidden');
      studentForm.classList.add('hidden');
    }
  },

  fillDemoCredentials(role) {
    if (role === 'student') {
      document.getElementById('studentEmail').value = 'student@chronova.edu';
      document.getElementById('studentPassword').value = 'student123';
      ChronovaComponents.showToast('Credentials Populated', 'Student demo credentials filled. Click Sign In.', 'info');
    } else {
      document.getElementById('adminEmail').value = 'admin@chronova.edu';
      document.getElementById('adminPassword').value = 'admin123';
      ChronovaComponents.showToast('Credentials Populated', 'Admin demo credentials filled. Click Sign In.', 'info');
    }
  },

  handleLoginSubmit(e, role) {
    e.preventDefault();
    const success = window.chronovaState.login(role);
    if (success) {
      this.closeModal('authModal');
      ChronovaComponents.showToast(
        'Welcome Back!',
        `Logged in as ${window.chronovaState.currentUser.name} (${role.toUpperCase()})`,
        'success'
      );
    }
  },

  handleLogout() {
    window.chronovaState.logout();
    ChronovaComponents.showToast('Logged Out', 'You have been signed out safely.', 'info');
  },

  // Admin: Open Create Event Modal
  openCreateEventModal() {
    this.openModal('adminCreateEventModal');
  },

  submitNewEvent(e) {
    e.preventDefault();
    const title = document.getElementById('adminEventTitle').value;
    const category = document.getElementById('adminEventCategory').value;
    const date = document.getElementById('adminEventDate').value;
    const time = document.getElementById('adminEventTime').value;
    const venue = document.getElementById('adminEventVenue').value;
    const capacity = parseInt(document.getElementById('adminEventCapacity').value, 10) || 100;
    const price = document.getElementById('adminEventPrice').value || 'Free';
    const description = document.getElementById('adminEventDesc').value;

    window.chronovaState.addNewEvent({
      title,
      category,
      status: 'upcoming',
      date,
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      time,
      venue,
      capacity,
      price,
      description,
      clubName: 'Academic Directorate',
      coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      tags: ['Official', category]
    });

    this.closeModal('adminCreateEventModal');
    ChronovaComponents.showToast('Event Published', `"${title}" is now visible to all students!`, 'success');
  },

  // Admin: Open Upload Material Modal
  openUploadMaterialModal() {
    this.openModal('adminUploadModal');
  },

  submitNewMaterial(e) {
    e.preventDefault();
    const title = document.getElementById('adminMatTitle').value;
    const code = document.getElementById('adminMatCode').value;
    const department = document.getElementById('adminMatDept').value;
    const semester = parseInt(document.getElementById('adminMatSem').value, 10) || 1;
    const type = document.getElementById('adminMatType').value;
    const format = document.getElementById('adminMatFormat').value;
    const author = document.getElementById('adminMatAuthor').value;
    const description = document.getElementById('adminMatDesc').value;

    window.chronovaState.addNewMaterial({
      title,
      code,
      department,
      semester,
      type,
      format,
      author: author || 'Faculty Verified',
      size: '12.5 MB',
      description,
      toc: ["Chapter 1: Overview", "Chapter 2: Key Formulas", "Chapter 3: Solved Problems"]
    });

    this.closeModal('adminUploadModal');
    ChronovaComponents.showToast('Resource Published', `"${title}" has been added to the Study Hub.`, 'success');
  },

  // Bookmarks & Saved Drawer
  openBookmarksDrawer() {
    const drawer = document.getElementById('bookmarksDrawer');
    const content = document.getElementById('bookmarksDrawerContent');

    const savedMatIds = [...window.chronovaState.savedMaterialIds];
    const registeredIds = [...window.chronovaState.registeredEventIds];

    const savedMats = window.chronovaState.studyMaterials.filter(m => savedMatIds.includes(m.id));
    const regEvents = window.chronovaState.events.filter(e => registeredIds.includes(e.id));

    content.innerHTML = `
      <div class="space-y-6">
        <!-- Registered Events Section -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-3">
            <i data-lucide="ticket" class="w-4 h-4"></i> My Event Registrations (${regEvents.length})
          </h4>
          ${regEvents.length === 0 ? `
            <p class="text-xs text-slate-500 italic">No events registered yet.</p>
          ` : `
            <div class="space-y-2">
              ${regEvents.map(evt => `
                <div class="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-2">
                  <div class="truncate">
                    <h5 class="text-xs font-bold text-white truncate">${evt.title}</h5>
                    <span class="text-[10px] text-slate-400">${evt.date} • ${evt.venue}</span>
                  </div>
                  <button onclick="ChronovaApp.showTicketModal(window.chronovaState.events.find(e => e.id === '${evt.id}'))" 
                          class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
                    Pass
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Saved Study Notes Section -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 mb-3">
            <i data-lucide="bookmark" class="w-4 h-4"></i> Saved Study Notes (${savedMats.length})
          </h4>
          ${savedMats.length === 0 ? `
            <p class="text-xs text-slate-500 italic">No notes bookmarked yet.</p>
          ` : `
            <div class="space-y-2">
              ${savedMats.map(mat => `
                <div class="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-2">
                  <div class="truncate">
                    <h5 class="text-xs font-bold text-white truncate">${mat.title}</h5>
                    <span class="text-[10px] text-slate-400 font-mono">${mat.code} • Sem ${mat.semester} (${mat.format})</span>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button onclick="ChronovaApp.openStudyPreview('${mat.id}')" 
                            class="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                      <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="ChronovaApp.toggleBookmark('${mat.id}'); ChronovaApp.openBookmarksDrawer();" 
                            class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    this.openModal('bookmarksDrawer');
  }
};

window.ChronovaApp = ChronovaApp;

// Auto boot on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  ChronovaApp.init();
});
