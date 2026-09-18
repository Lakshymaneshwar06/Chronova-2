// Chronova 2.0 - Component Renderers & Modal Generators
// Modular, clean, reusable HTML generator functions

const ChronovaComponents = {
  // 1. EVENT CARD COMPONENT
  renderEventCard(event, isRegistered = false) {
    const isOngoing = event.status === 'ongoing';
    const percentFilled = Math.min(100, Math.round((event.registered / event.capacity) * 100));

    return `
      <div class="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-cyan-400/40 relative transition-all duration-300">
        <!-- Cover Banner -->
        <div class="relative h-48 overflow-hidden bg-slate-900">
          <img src="${event.coverImage}" alt="${event.title}" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85" 
               loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/30"></div>

          <!-- Badges top row -->
          <div class="absolute top-3 left-3 flex gap-2 flex-wrap">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md ${
              isOngoing 
                ? 'bg-rose-500/80 text-white border border-rose-400/50 animate-pulse' 
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
            }">
              ${isOngoing ? '● Live Now' : event.category}
            </span>
            <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/70 text-slate-300 border border-white/10 backdrop-blur-md">
              ${event.price}
            </span>
          </div>

          <!-- Countdown Overlay Bar -->
          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between backdrop-blur-md bg-slate-950/70 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <span class="text-slate-400 flex items-center gap-1.5">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-cyan-400"></i> Starts in:
            </span>
            <div class="event-countdown font-mono font-bold text-cyan-300 text-xs" data-target="${event.targetDate}">
              Calculating...
            </div>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <!-- Club & Date line -->
            <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span class="flex items-center gap-1 text-cyan-400/90 font-medium">
                <i data-lucide="shield" class="w-3.5 h-3.5"></i> ${event.clubName}
              </span>
              <span class="flex items-center gap-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${event.date}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
              ${event.title}
            </h3>

            <!-- Description -->
            <p class="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
              ${event.description}
            </p>
          </div>

          <!-- Footer Details & CTAs -->
          <div>
            <!-- Venue & Capacity -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span class="flex items-center gap-1 truncate max-w-[180px]">
                  <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-400"></i> ${event.venue}
                </span>
                <span class="font-mono text-[11px] ${percentFilled > 85 ? 'text-amber-400' : 'text-slate-400'}">
                  ${event.registered}/${event.capacity} Filled
                </span>
              </div>
              <div class="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div class="bg-gradient-to-r from-cyan-500 to-amber-400 h-full rounded-full transition-all duration-500" 
                     style="width: ${percentFilled}%"></div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 pt-2 border-t border-white/5">
              <button onclick="ChronovaApp.openEventDetails('${event.id}')" 
                      class="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-white/10 transition-colors flex items-center justify-center gap-1.5">
                <i data-lucide="info" class="w-3.5 h-3.5"></i> Details
              </button>
              
              <button onclick="ChronovaApp.handleEventRegistrationTrigger('${event.id}')" 
                      class="flex-1 py-2 px-3 rounded-xl text-xs font-semibold ${
                        isRegistered
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'accent-glow-btn text-white'
                      } flex items-center justify-center gap-1.5 transition-all">
                <i data-lucide="${isRegistered ? 'ticket' : 'check-circle-2'}" class="w-3.5 h-3.5"></i>
                ${isRegistered ? 'View Ticket' : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 2. STUDY MATERIAL CARD COMPONENT
  renderStudyCard(mat, isBookmarked = false) {
    const formatIcons = {
      PDF: { icon: 'file-text', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
      ZIP: { icon: 'archive', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
      MP4: { icon: 'play-circle', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
      DOCX: { icon: 'file-code-2', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' }
    };

    const style = formatIcons[mat.format] || formatIcons.PDF;

    return `
      <div class="glass-card rounded-2xl p-5 border border-white/10 hover:border-violet-500/40 flex flex-col justify-between group transition-all duration-300 relative">
        <!-- Top row: Format Icon, Semester/Dept, Bookmark -->
        <div>
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl ${style.bg} border flex items-center justify-center ${style.color}">
                <i data-lucide="${style.icon}" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  ${mat.code} • Sem ${mat.semester}
                </span>
                <span class="block text-[11px] text-slate-400 mt-0.5">
                  ${mat.department}
                </span>
              </div>
            </div>

            <!-- Bookmark Button -->
            <button onclick="ChronovaApp.toggleBookmark('${mat.id}', event)" 
                    title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark Material'}"
                    class="p-2 rounded-xl text-slate-400 hover:text-amber-400 bg-slate-900/50 hover:bg-slate-800 border border-white/10 transition-colors">
              <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}"></i>
            </button>
          </div>

          <!-- Title -->
          <h3 class="text-base font-bold text-white group-hover:text-violet-300 transition-colors mb-2 line-clamp-2 leading-snug">
            ${mat.title}
          </h3>

          <!-- Description -->
          <p class="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            ${mat.description}
          </p>
        </div>

        <!-- Meta Info & Action Buttons -->
        <div>
          <!-- Stats: Ratings, Downloads, Size, Author -->
          <div class="grid grid-cols-2 gap-2 text-xs py-2.5 px-3 rounded-xl bg-slate-950/40 border border-white/5 mb-4">
            <div class="flex items-center gap-1.5 text-slate-300">
              <i data-lucide="star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400"></i>
              <span class="font-bold font-mono text-white">${mat.rating}</span>
              <span class="text-slate-500">(${mat.reviewsCount})</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-400 justify-end">
              <i data-lucide="download" class="w-3.5 h-3.5 text-slate-400"></i>
              <span class="font-mono">${mat.downloads.toLocaleString()}</span>
            </div>
            <div class="flex items-center gap-1 text-slate-400 truncate col-span-2 text-[11px] pt-1 border-t border-white/5">
              <i data-lucide="user-check" class="w-3 h-3 text-emerald-400"></i>
              <span class="truncate">By ${mat.author} (${mat.size})</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button onclick="ChronovaApp.openStudyPreview('${mat.id}')" 
                    class="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Read & Preview
            </button>
            <button onclick="ChronovaApp.downloadMaterial('${mat.id}')" 
                    class="py-2 px-4 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 transition-all flex items-center justify-center gap-1.5">
              <i data-lucide="download-cloud" class="w-3.5 h-3.5"></i> Download
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // 3. CLUB CARD COMPONENT
  renderClubCard(club, isJoined = false) {
    return `
      <div class="glass-card rounded-2xl p-6 border border-white/10 hover:border-emerald-500/40 flex flex-col justify-between group transition-all duration-300">
        <div>
          <!-- Header: Icon & Category -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <i data-lucide="${club.icon || 'users'}" class="w-6 h-6"></i>
            </div>
            <div class="flex flex-col items-end">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ${club.badge}
              </span>
              <span class="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <i data-lucide="users" class="w-3 h-3 text-emerald-400"></i> ${club.membersCount} active members
              </span>
            </div>
          </div>

          <!-- Title & Tagline -->
          <h3 class="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
            ${club.name}
          </h3>
          <p class="text-xs text-emerald-400/90 font-medium mb-2">
            "${club.tagline}"
          </p>
          <p class="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
            ${club.description}
          </p>
        </div>

        <div>
          <!-- Club Lead & Stats -->
          <div class="p-3 rounded-xl bg-slate-950/40 border border-white/5 space-y-1.5 mb-4 text-xs">
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500">Club Lead:</span>
              <span class="font-medium text-slate-200">${club.lead}</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500">Hosted Events:</span>
              <span class="font-mono text-cyan-400 font-bold">${club.activeEvents} Upcoming</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button onclick="ChronovaApp.openClubDetails('${club.id}')" 
                    class="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5">
              <i data-lucide="info" class="w-3.5 h-3.5"></i> Club Details
            </button>
            <button onclick="ChronovaApp.handleClubJoinTrigger('${club.id}')" 
                    class="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold ${
                      isJoined 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40'
                    } transition-all flex items-center justify-center gap-1.5">
              <i data-lucide="${isJoined ? 'check-circle' : 'user-plus'}" class="w-3.5 h-3.5"></i>
              ${isJoined ? 'Joined' : 'Join Club'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // 4. TIMELINE / CALENDAR MINI-VIEW COMPONENT
  renderTimelineSection(events) {
    return `
      <div class="glass-card rounded-2xl p-6 border border-white/10 mt-10">
        <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i data-lucide="calendar-range" class="w-5 h-5 text-cyan-400"></i> Upcoming Campus Schedule & Milestones
            </h3>
            <p class="text-xs text-slate-400">Synchronized live with academic and student club calendars</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Fall Semester 2026
          </span>
        </div>

        <!-- Horizontal or vertical timeline items -->
        <div class="relative border-l-2 border-cyan-500/30 ml-3 md:ml-6 pl-4 md:pl-6 space-y-6">
          ${events.slice(0, 5).map(evt => `
            <div class="relative group">
              <!-- Dot -->
              <div class="absolute -left-[23px] md:-left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors shadow-lg"></div>
              
              <div class="bg-slate-900/50 hover:bg-slate-800/60 p-4 rounded-xl border border-white/5 transition-all">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 class="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    ${evt.title}
                  </h4>
                  <span class="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20 self-start sm:self-auto">
                    ${evt.date} • ${evt.time}
                  </span>
                </div>
                <p class="text-xs text-slate-400 mb-2">${evt.description}</p>
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span class="flex items-center gap-1">
                    <i data-lucide="map-pin" class="w-3 h-3 text-amber-400"></i> ${evt.venue}
                  </span>
                  <button onclick="ChronovaApp.openEventDetails('${evt.id}')" class="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                    Details <i data-lucide="arrow-right" class="w-3 h-3"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 5. EVENT TICKET PASS COMPONENT (Generated inside modal)
  renderTicketPass(event, student) {
    const ticketId = `CHRO-${Math.floor(100000 + Math.random() * 900000)}`;
    return `
      <div class="event-ticket rounded-2xl p-6 text-white max-w-md mx-auto relative overflow-hidden shadow-2xl">
        <div class="ticket-notch-left"></div>
        <div class="ticket-notch-right"></div>

        <!-- Header -->
        <div class="flex items-center justify-between border-b border-dashed border-white/20 pb-4 mb-4">
          <div>
            <span class="text-[10px] font-mono tracking-widest uppercase text-cyan-400 block">OFFICIAL EVENT PASS</span>
            <h3 class="text-lg font-black tracking-wide">${event.title}</h3>
          </div>
          <div class="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <i data-lucide="zap" class="w-5 h-5"></i>
          </div>
        </div>

        <!-- Student & Event info -->
        <div class="grid grid-cols-2 gap-3 text-xs mb-4">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase">Attendee</span>
            <span class="font-bold text-white text-sm">${student.name || 'Student Attendee'}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase">Roll / Student ID</span>
            <span class="font-mono text-cyan-300 font-semibold">${student.studentId || 'CHRO-STD-2026'}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase">Date & Time</span>
            <span class="text-slate-200 font-medium">${event.date} • ${event.time}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase">Venue</span>
            <span class="text-slate-200 font-medium">${event.venue}</span>
          </div>
        </div>

        <!-- QR & Security Barcode -->
        <div class="pt-4 border-t border-dashed border-white/20 flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-[10px] font-mono text-slate-400 block">PASS NUMBER</span>
            <span class="font-mono text-xs font-bold text-amber-300">${ticketId}</span>
            <div class="text-[10px] text-emerald-400 flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3"></i> Verified Enrollment
            </div>
          </div>

          <!-- Mock QR matrix visual -->
          <div class="w-16 h-16 bg-white rounded-lg p-1 flex items-center justify-center shadow-lg">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CHRONOVA-${event.id}-${ticketId}" 
                 alt="QR Pass" class="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    `;
  },

  // 6. TOAST NOTIFICATION RENDERER
  showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
      success: { icon: 'check-circle', color: 'text-emerald-400', border: 'border-emerald-500/30' },
      info: { icon: 'info', color: 'text-cyan-400', border: 'border-cyan-500/30' },
      warning: { icon: 'alert-triangle', color: 'text-amber-400', border: 'border-amber-500/30' },
      error: { icon: 'x-circle', color: 'text-rose-400', border: 'border-rose-500/30' }
    };

    const toastCfg = icons[type] || icons.info;
    const toastEl = document.createElement('div');
    toastEl.className = `toast glass-panel rounded-xl p-3.5 max-w-sm flex items-start gap-3 shadow-2xl border ${toastCfg.border} animate-fade-in`;
    toastEl.innerHTML = `
      <i data-lucide="${toastCfg.icon}" class="w-5 h-5 ${toastCfg.color} shrink-0 mt-0.5"></i>
      <div class="flex-1 pr-2">
        <h4 class="text-xs font-bold text-white">${title}</h4>
        <p class="text-[11px] text-slate-300 leading-snug mt-0.5">${message}</p>
      </div>
      <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white text-xs">✕</button>
    `;

    container.appendChild(toastEl);
    if (window.lucide) window.lucide.createIcons({ root: toastEl });

    setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateY(10px)';
      setTimeout(() => toastEl.remove(), 300);
    }, 4000);
  }
};

window.ChronovaComponents = ChronovaComponents;
