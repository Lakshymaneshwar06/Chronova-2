// Chronova 2.0 - Unified Data Store
// Realistic dummy data for Events, Study Materials, Clubs, and Chatbot Knowledge Base

const CHRONOVA_DATA = {
  // 1. EVENTS DATABASE
  events: [
    {
      id: "evt-001",
      title: "ChronoHacks 2026: 36-Hour National Hackathon",
      category: "hackathons",
      status: "upcoming",
      date: "Oct 24 - 26, 2026",
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 14).toISOString(), // ~5.5 days from now
      time: "09:00 AM IST",
      venue: "Turing Main Hall & Online Discord",
      clubId: "club-001",
      clubName: "ChronoCode Developers",
      coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      description: "Build cutting-edge AI, Web3, and Climate-Tech solutions with 500+ student developers. \$15,000+ prize pool, sponsored by top tech giants.",
      fullDetails: "Join Chronova's flagship 36-hour hackathon! Compete in 4 tracks: Generative AI, Decentralized Systems, FinTech & Healthcare. Mentorship from ex-Google and Microsoft engineers. Free swag kits, 24/7 food & beverages, and fast-track job interviews for top finalists.",
      capacity: 500,
      registered: 412,
      price: "Free",
      tags: ["AI/ML", "Hackathon", "Open Source", "Prizes"],
      featured: true,
      speaker: "Dr. Elena Rostova (AI Research Fellow)",
      schedule: [
        { time: "Day 1 - 09:00 AM", title: "Opening Ceremony & Track Announcement" },
        { time: "Day 1 - 11:00 AM", title: "Hacking Begins & Mentor Matching" },
        { time: "Day 2 - 08:00 PM", title: "Midnight Pitch Rehearsal" },
        { time: "Day 3 - 03:00 PM", title: "Final Demos & Award Showcase" }
      ]
    },
    {
      id: "evt-002",
      title: "Neural Networks & Deep Vision Masterclass",
      category: "workshops",
      status: "upcoming",
      date: "Oct 12, 2026",
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 6).toISOString(), // ~2.25 days from now
      time: "02:00 PM - 06:00 PM",
      venue: "Lab 402 (Advanced Computing Block)",
      clubId: "club-003",
      clubName: "AI Nexus Society",
      coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      description: "Hands-on implementation of CNNs, Vision Transformers, and Diffusion models with PyTorch. GPU compute provided on cloud nodes.",
      fullDetails: "Dive deep into modern computer vision architectures. You will build and fine-tune a multimodal vision transformer to detect campus anomalies. Prerequisites: Basic Python knowledge and linear algebra.",
      capacity: 80,
      registered: 76,
      price: "Free",
      tags: ["PyTorch", "Vision AI", "Hands-on", "Certification"],
      featured: true,
      speaker: "Prof. Arvind Shenoy & AI Nexus Core",
      schedule: [
        { time: "02:00 PM", title: "Foundations of Convolutional & Attention Layers" },
        { time: "03:30 PM", title: "Live Lab: Training ViT on Cloud H100 GPUs" },
        { time: "05:15 PM", title: "Q&A, Project Assessment & Certificates" }
      ]
    },
    {
      id: "evt-003",
      title: "Autonomous Drone Robotics Exhibition & Battle",
      category: "workshops",
      status: "ongoing",
      date: "Today (Live)",
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(), // 8 hours from now
      time: "10:00 AM - 07:00 PM",
      venue: "East Sports Pavilion Arena",
      clubId: "club-002",
      clubName: "ChronoRobotics Guild",
      coverImage: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
      description: "Watch high-speed FPV obstacle races and autonomous micro-drone combat. Interactive simulator booth for spectators.",
      fullDetails: "Experience state-of-the-art quadcopter avionics! See teams test computer-vision navigation through indoor obstacle corridors with laser telemetry.",
      capacity: 350,
      registered: 350,
      price: "Free Pass",
      tags: ["Robotics", "Drones", "IoT", "Live Combat"],
      featured: false,
      speaker: "Kavya Nair (President, Robotics Guild)"
    },
    {
      id: "evt-004",
      title: "Zero-Day Exploit Analysis & Red Teaming CTF",
      category: "hackathons",
      status: "upcoming",
      date: "Nov 02, 2026",
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
      time: "06:00 PM IST (Online)",
      venue: "CyberSec Virtual Lab / VPN",
      clubId: "club-005",
      clubName: "CyberSec Syndicate",
      coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      description: "A 24-hour Capture-The-Flag challenge spanning reverse engineering, web exploits, binary analysis, and cryptography.",
      fullDetails: "Level up your defensive and offensive cybersecurity chops. Realistic enterprise targets, jeopardy-style scoring, and prizes for top 3 teams.",
      capacity: 300,
      registered: 189,
      price: "Free",
      tags: ["Cybersecurity", "CTF", "Ethical Hacking", "Networking"],
      featured: false,
      speaker: "Security Operations Team"
    },
    {
      id: "evt-005",
      title: "UI/UX Design Jam: Designing for Spatial Computing",
      category: "workshops",
      status: "upcoming",
      date: "Nov 08, 2026",
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
      time: "11:00 AM - 04:00 PM",
      venue: "Design Studio Room 201",
      clubId: "club-004",
      clubName: "PixelForge Design Society",
      coverImage: "https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=800&q=80",
      description: "Learn spatial UI paradigms, Figma 3D plugins, gesture controls, and prototype interactive visionOS concepts.",
      fullDetails: "A high-energy workshop exploring the next frontier of user interfaces. Hands-on Figma exercises, design critique circles, and Figma community templates.",
      capacity: 60,
      registered: 52,
      price: "Free",
      tags: ["Design", "UI/UX", "Figma", "Spatial UX"],
      featured: false,
      speaker: "Siddharth Verma (Product Designer)"
    },
    {
      id: "evt-006",
      title: "Aura 2026: Annual Inter-College Cultural Gala",
      category: "cultural",
      status: "upcoming",
      date: "Nov 15 - 17, 2026",
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
      time: "05:00 PM Onwards",
      venue: "Grand Open Air Amphitheatre",
      clubId: "club-007",
      clubName: "Cultural Affairs Council",
      coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      description: "Music bands, street theater, flash mobs, EDM night, and art installations across campus. 3 days of pure energy.",
      fullDetails: "The biggest cultural festival of the semester. Over 40 performance events, food trucks, celebrity musical guest artist, and battle of the bands.",
      capacity: 2500,
      registered: 1840,
      price: "Student ID Pass",
      tags: ["Music", "Dance", "Drama", "Festival"],
      featured: true,
      speaker: "Student Council"
    },
    {
      id: "evt-007",
      title: "Quantum Computing & Post-Quantum Cryptography Talk",
      category: "talks",
      status: "upcoming",
      date: "Nov 22, 2026",
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 32).toISOString(),
      time: "04:00 PM - 05:30 PM",
      venue: "Auditorium Hall B",
      clubId: "club-001",
      clubName: "ChronoCode Developers",
      coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
      description: "Keynote on Qubits, Shor's Algorithm, and the NIST standards for lattice-based cryptographic algorithms.",
      fullDetails: "Understand how quantum computing disrupts conventional RSA and ECC cryptography and what engineering teams must do to prepare.",
      capacity: 150,
      registered: 94,
      price: "Free",
      tags: ["Quantum", "Cryptography", "Keynote", "Math"],
      featured: false,
      speaker: "Dr. Marcus Vance (Guest Scientist)"
    },
    {
      id: "evt-008",
      title: "Inter-Campus Valorant & Rocket League Cup",
      category: "sports",
      status: "ongoing",
      date: "Live This Weekend",
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
      time: "01:00 PM IST",
      venue: "Student Activity Center & Twitch Stream",
      clubId: "club-006",
      clubName: "Chrono E-Sports Guild",
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      description: "32 collegiate teams battling for the championship trophy and gaming gear sponsors. Live commentary & spectator giveaways.",
      fullDetails: "Double elimination bracket for 5v5 tactical shooter and 3v3 Rocket League. Live projected screen in SAC and Twitch stream.",
      capacity: 200,
      registered: 200,
      price: "Free Entry",
      tags: ["Gaming", "E-Sports", "Tournament", "Livestream"],
      featured: false,
      speaker: "E-Sports Core Team"
    }
  ],

  // 2. STUDY MATERIALS DATABASE
  studyMaterials: [
    {
      id: "mat-001",
      title: "Advanced Data Structures & Algorithms (Complete Unit 1-5)",
      code: "CS401",
      department: "Computer Science",
      semester: 4,
      type: "notes",
      format: "PDF",
      size: "18.4 MB",
      author: "Prof. S. R. Ramanujan & Peer Council",
      downloads: 3840,
      rating: 4.9,
      reviewsCount: 142,
      uploadDate: "Sep 2026",
      verified: true,
      description: "Handcrafted master notes covering AVL Trees, Red-Black Trees, Graph Algorithms (Dijkstra, Bellman-Ford, Tarjan's SCC), Dynamic Programming patterns, and NP-Completeness.",
      toc: [
        "Unit 1: Self-Balancing Trees & Fibonacci Heaps",
        "Unit 2: Graph Theory & Shortest Path Algorithms",
        "Unit 3: Greedy vs Dynamic Programming Memoization",
        "Unit 4: String Matching (KMP & Rabin-Karp)",
        "Unit 5: Complexity Classes P, NP, and Reductions"
      ],
      sampleContent: "Binary Search Trees maintain the invariant that for any node X, all left descendants have keys < X.key and right descendants have keys > X.key. In Red-Black Trees, we preserve balanced height O(log N) through 5 rigid coloring invariants..."
    },
    {
      id: "mat-002",
      title: "Operating Systems Internals: Concurrency, Memory & Kernels",
      code: "CS402",
      department: "Computer Science",
      semester: 4,
      type: "notes",
      format: "PDF",
      size: "24.1 MB",
      author: "Dr. Alistair Ross (Head of OS Lab)",
      downloads: 4210,
      rating: 5.0,
      reviewsCount: 204,
      uploadDate: "Aug 2026",
      verified: true,
      description: "Comprehensive guide to process synchronization, mutex semaphores, deadlock handling, virtual memory paging, translation lookaside buffers (TLB), and Linux VFS file systems.",
      toc: [
        "1. Process Control Blocks & Context Switching",
        "2. Inter-Process Communication & Dining Philosophers",
        "3. Virtual Memory & Inverted Page Tables",
        "4. Disk Scheduling Algorithms & RAID Architectures",
        "5. Linux Kernel Modules & System Call Traps"
      ],
      sampleContent: "When an interrupt occurs, the hardware pushes PC and processor flags onto the kernel stack. The scheduler swaps register context into the task_struct and updates CR3 register with the page directory base..."
    },
    {
      id: "mat-003",
      title: "Machine Learning & Neural Foundations: Cheat Sheet & Formula Deck",
      code: "AI502",
      department: "AI & Data Science",
      semester: 5,
      type: "cheatsheet",
      format: "PDF",
      size: "6.2 MB",
      author: "Chrono AI Student Guild",
      downloads: 5890,
      rating: 4.9,
      reviewsCount: 310,
      uploadDate: "Sep 2026",
      verified: true,
      description: "Ultra-condensed 12-page quick revision sheet: Loss functions, Backprop calculus derivations, Optimizer comparisons (AdamW, RMSProp), Transformer Attention formula, and Regularization.",
      toc: [
        "Formula 1: Cross-Entropy, KL Divergence & Focal Loss",
        "Formula 2: Matrix Calculus of Multi-Head Self-Attention",
        "Formula 3: Gradient Descent Variants & Learning Rate Schedulers",
        "Formula 4: Metric Evaluation (ROC-AUC, Precision, Recall, F1)"
      ],
      sampleContent: "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V. Scaling by sqrt(d_k) prevents softmax gradient saturation in high-dimensional embedding spaces."
    },
    {
      id: "mat-004",
      title: "Database Management Systems: Solved 10-Year Question Bank",
      code: "CS303",
      department: "Computer Science",
      semester: 3,
      type: "questionbank",
      format: "PDF",
      size: "14.8 MB",
      author: "Academic Resource Cell",
      downloads: 2950,
      rating: 4.8,
      reviewsCount: 88,
      uploadDate: "Jul 2026",
      verified: true,
      description: "Step-by-step solved university exam questions with relational algebra schemas, SQL query optimizations, B+ tree index insertions, and BCNF normalization proofs.",
      toc: [
        "Section A: Relational Algebra & Tuple Calculus",
        "Section B: Normal Forms 1NF to 5NF & Dependency Preservation",
        "Section C: Concurrency Control (2PL, Timestamp, Serializability)",
        "Section D: Query Optimization Trees & Index Cost Estimations"
      ],
      sampleContent: "Problem 14: Given R(A, B, C, D, E) with F = {A->BC, CD->E, B->D, E->A}. Compute candidate keys. Solution: (A)+ = {A,B,C,D,E}. Since E->A, (E)+ = {E,A,B,C,D}. Hence candidate keys are {A}, {E}, {CD}..."
    },
    {
      id: "mat-005",
      title: "Computer Networks & Sockets Lab Manual (C & Python)",
      code: "CS504",
      department: "Computer Science",
      semester: 5,
      type: "labmanual",
      format: "ZIP",
      size: "32.0 MB",
      author: "Dept. of Computer Engineering",
      downloads: 1820,
      rating: 4.7,
      reviewsCount: 65,
      uploadDate: "Aug 2026",
      verified: true,
      description: "Fully documented lab experiments with code files: Raw TCP/UDP socket servers, packet sniffing with Wireshark scripts, Distance Vector routing simulation, and CRC error detection.",
      toc: [
        "Exp 1: Client-Server Socket Architecture in C",
        "Exp 2: Stop-and-Wait & Sliding Window Protocol Simulator",
        "Exp 3: Wireshark Packet Dissection of HTTP/2 vs HTTP/3",
        "Exp 4: Subnetting Calculator and RIP Routing Table Emulation"
      ],
      sampleContent: "int server_fd = socket(AF_INET, SOCK_STREAM, 0); bind(server_fd, (struct sockaddr *)&address, sizeof(address)); listen(server_fd, 5); new_socket = accept(server_fd, ...);"
    },
    {
      id: "mat-006",
      title: "Linear Algebra, Vector Calculus & Differential Equations",
      code: "MA201",
      department: "Mathematics",
      semester: 2,
      type: "notes",
      format: "PDF",
      size: "21.5 MB",
      author: "Prof. H. V. Kothari (Distinguished Chair)",
      downloads: 3410,
      rating: 4.8,
      reviewsCount: 112,
      uploadDate: "Sep 2026",
      verified: true,
      description: "Rigorous lecture notes covering Eigenvalues, SVD decomposition, Vector fields (Green's, Stokes' and Gauss Divergence theorems), and Second-order PDE boundary value problems.",
      toc: [
        "Chapter 1: Vector Spaces, Nullity & Rank Theorem",
        "Chapter 2: Orthogonality & Gram-Schmidt Process",
        "Chapter 3: Diagonalization & Singular Value Decomposition",
        "Chapter 4: Line, Surface, and Volume Integrals",
        "Chapter 5: Heat and Wave Equations with Fourier Transforms"
      ],
      sampleContent: "Every real symmetric matrix A can be orthogonally diagonalized as A = Q * Lambda * Q^T, where Q contains orthonormal eigenvectors and Lambda contains real eigenvalues..."
    },
    {
      id: "mat-007",
      title: "Modern Web Engineering: Fullstack Microservices Masterclass",
      code: "IT602",
      department: "Information Technology",
      semester: 6,
      type: "video",
      format: "MP4",
      size: "1.4 GB",
      author: "Karan Johar (Tech Lead & Alum)",
      downloads: 2190,
      rating: 4.9,
      reviewsCount: 175,
      uploadDate: "Aug 2026",
      verified: true,
      description: "4-hour video workshop recording breaking down REST/gRPC API architectures, Redis distributed caching, Docker container orchestration, and CI/CD pipelines.",
      toc: [
        "Video 1: Microservice Boundaries & Event-Driven messaging",
        "Video 2: High Throughput Redis Cache-Aside & Locking",
        "Video 3: Docker multi-stage builds and Docker Compose",
        "Video 4: JWT Authentication with Refresh Token rotation"
      ],
      sampleContent: "Video Lecture: Access recorded stream, accompanied by GitHub repository boilerplates and architectural diagram notes."
    },
    {
      id: "mat-008",
      title: "Digital Logic Design & Microprocessor 8086 Instruction Guide",
      code: "EC301",
      department: "Electronics & Comm",
      semester: 3,
      type: "notes",
      format: "PDF",
      size: "15.7 MB",
      author: "Prof. Sunita Deshmukh",
      downloads: 1640,
      rating: 4.6,
      reviewsCount: 54,
      uploadDate: "May 2026",
      verified: true,
      description: "Comprehensive notes for Karnaugh Maps, Combinational circuits, Flip-Flops, 8086 architecture, Pin diagram, and Assembly language timing diagrams.",
      toc: [
        "Unit 1: Boolean Algebra Minimization & Quine-McCluskey",
        "Unit 2: Synchronous & Asynchronous Counter Design",
        "Unit 3: 8086 Bus Architecture & Memory Segmentation",
        "Unit 4: Addressing Modes & Interrupt Vector Tables"
      ],
      sampleContent: "The 8086 uses 20-bit physical addresses calculated as Physical Address = (Segment Register << 4) + Offset Register. The BIU and EU operate asynchronously to perform instruction pipelining..."
    }
  ],

  // 3. STUDENT CLUBS DATABASE
  clubs: [
    {
      id: "club-001",
      name: "ChronoCode Developers",
      tagline: "Building scalable code, open source tools, and championship hack teams.",
      category: "technical",
      badge: "Tech & Coding",
      membersCount: 420,
      activeEvents: 3,
      lead: "Aarav Sharma (President, Final Year CS)",
      leadContact: "aarav@chronova.edu",
      icon: "code-2",
      accentColor: "#00f2fe",
      description: "The primary technical developer community on campus. We organize weekly algorithmic sprints, open-source hack nights, web3 build weekends, and host the national ChronoHacks.",
      socials: { github: "https://github.com", discord: "https://discord.gg", linkedin: "https://linkedin.com" },
      requirements: "Passionate about programming in any language. Open to all branches and years.",
      recruitmentOpen: true
    },
    {
      id: "club-002",
      name: "ChronoRobotics & IoT Guild",
      tagline: "Where hardware meets intelligence: Autonomous rovers, drones, and mechatronics.",
      category: "technical",
      badge: "Robotics & Hardware",
      membersCount: 260,
      activeEvents: 2,
      lead: "Kavya Nair (President, 3rd Year Mechatronics)",
      leadContact: "kavya@chronova.edu",
      icon: "bot",
      accentColor: "#f6ad55",
      description: "Dedicated to mechanical prototyping, embedded firmware, ROS2 robotics stacks, and competitive drone racing. High-precision laser cutters and 3D printing lab access.",
      socials: { github: "https://github.com", discord: "https://discord.gg", linkedin: "https://linkedin.com" },
      requirements: "Interest in microcontrollers (ESP32/Arduino), CAD design, or control theory.",
      recruitmentOpen: true
    },
    {
      id: "club-003",
      name: "AI Nexus Society",
      tagline: "Exploring neural architectures, LLMs, Computer Vision, and Ethical AI.",
      category: "technical",
      badge: "AI & Deep Learning",
      membersCount: 380,
      activeEvents: 2,
      lead: "Rohan Varma (Lead AI Researcher, 4th Year AI)",
      leadContact: "rohan@chronova.edu",
      icon: "brain-circuit",
      accentColor: "#8b5cf6",
      description: "A research-focused society publishing undergraduate papers, hosting Kaggle competitions, reading research papers weekly, and training bespoke neural models.",
      socials: { github: "https://github.com", discord: "https://discord.gg", linkedin: "https://linkedin.com" },
      requirements: "Familiarity with Python and basic machine learning concepts.",
      recruitmentOpen: true
    },
    {
      id: "club-004",
      name: "PixelForge Design & UX Guild",
      tagline: "Crafting beautiful digital experiences, design systems, and brand identities.",
      category: "creative",
      badge: "UI/UX & Creative",
      membersCount: 190,
      activeEvents: 1,
      lead: "Tanvi Saxena (Creative Director)",
      leadContact: "tanvi@chronova.edu",
      icon: "palette",
      accentColor: "#ec4899",
      description: "Home for UI designers, product strategists, 3D illustrators, and motion animators. We run design sprints, audit campus applications, and create visual guidelines.",
      socials: { figma: "https://figma.com", behance: "https://behance.net", instagram: "https://instagram.com" },
      requirements: "Curiosity for user empathy and aesthetic craft. Portfolio preferred but not mandatory.",
      recruitmentOpen: false
    },
    {
      id: "club-005",
      name: "CyberSec Syndicate",
      tagline: "Penetration testing, cryptographic security, and defensive cyber warfare.",
      category: "technical",
      badge: "Cybersecurity",
      membersCount: 210,
      activeEvents: 1,
      lead: "Devansh Mittal (CTF Captain)",
      leadContact: "devansh@chronova.edu",
      icon: "shield-alert",
      accentColor: "#10b981",
      description: "Elite campus red-teaming and blue-teaming collective. We compete internationally in DEFCON qualifier CTFs and educate students on secure coding.",
      socials: { github: "https://github.com", discord: "https://discord.gg" },
      requirements: "Understanding of Linux basics, computer networks, and ethical hacking code of conduct.",
      recruitmentOpen: true
    },
    {
      id: "club-006",
      name: "Chrono E-Sports Arena",
      tagline: "Competitive collegiate gaming, broadcast production, and esports management.",
      category: "sports",
      badge: "Gaming & Sports",
      membersCount: 340,
      activeEvents: 1,
      lead: "Sameer Kulkarni (Esports Manager)",
      leadContact: "sameer@chronova.edu",
      icon: "gamepad-2",
      accentColor: "#06b6d4",
      description: "Host of inter-college collegiate tournaments across Valorant, Rocket League, CS2, and FIFA. We also train casters, video directors, and tournament admins.",
      socials: { twitch: "https://twitch.tv", youtube: "https://youtube.com", discord: "https://discord.gg" },
      requirements: "Competitive gaming drive or interest in esports media production.",
      recruitmentOpen: true
    },
    {
      id: "club-007",
      name: "Cultural Affairs & Arts Society",
      tagline: "Celebrating music, performing arts, literary expression, and campus vibrance.",
      category: "cultural",
      badge: "Arts & Culture",
      membersCount: 520,
      activeEvents: 2,
      lead: "Ananya Iyer (General Secretary)",
      leadContact: "ananya@chronova.edu",
      icon: "sparkles",
      accentColor: "#eab308",
      description: "Organizers of Aura Fest, open mic nights, theatrical drama productions, and classical fusion concerts.",
      socials: { instagram: "https://instagram.com", youtube: "https://youtube.com" },
      requirements: "Love for music, dance, theatre, or organizing large-scale festivals.",
      recruitmentOpen: true
    }
  ],

  // 4. CHATBOT KNOWLEDGE BASE & QUICK QUERIES
  chatKnowledge: {
    quickChips: [
      { text: "📅 Next Hackathon", query: "When is the next hackathon?" },
      { text: "📚 Sem 4 OS Notes", query: "Where can I download Operating Systems notes for Semester 4?" },
      { text: "👥 Join Robotics Club", query: "How do I join the Robotics and IoT Club?" },
      { text: "⚡ Today's Events", query: "What events are happening today?" },
      { text: "🔑 Admin Login", query: "How do I log in as an Admin to post events?" }
    ],
    faqs: [
      {
        keywords: ["hackathon", "chronohacks", "coding competition", "prize"],
        response: `🚀 **ChronoHacks 2026** is our flagship 36-hour national hackathon!
- **Dates**: Oct 24 - 26, 2026 (Starts 09:00 AM IST)
- **Venue**: Turing Main Hall & Discord
- **Prize Pool**: \$15,000+
- **Spots**: 500 capacity (412 already registered)

Would you like to register now? You can register directly from the Event Mode tab!`,
        actionType: "view_event",
        actionId: "evt-001",
        actionLabel: "View ChronoHacks Details"
      },
      {
        keywords: ["operating systems", "os", "cs402", "concurrency", "sem 4 os"],
        response: `📖 We have verified **Operating Systems Internals** notes authored by **Dr. Alistair Ross**:
- **Code**: CS402 (Semester 4)
- **Format**: PDF (24.1 MB)
- **Rating**: ⭐ 5.0 / 5.0 (204 reviews, 4,200+ downloads)
- **Topics**: Concurrency, Mutex, Deadlocks, Paging, TLB, Virtual Memory.

You can preview or download it right away!`,
        actionType: "view_study",
        actionId: "mat-002",
        actionLabel: "Open OS Notes Preview"
      },
      {
        keywords: ["data structures", "dsa", "algorithms", "cs401", "ramanujan"],
        response: `📘 **Advanced Data Structures & Algorithms (CS401)** notes are available:
- **Author**: Prof. S. R. Ramanujan
- **Semester**: 4 | **Format**: PDF (18.4 MB)
- **Rating**: ⭐ 4.9 / 5.0
- Includes AVL/Red-Black trees, Dijkstra, DP memoization, and string matching.`,
        actionType: "view_study",
        actionId: "mat-001",
        actionLabel: "Open DSA Notes"
      },
      {
        keywords: ["machine learning", "ml", "ai502", "neural", "formula", "cheatsheet"],
        response: `🧠 Check out the **Machine Learning & Neural Foundations Formula Deck (AI502)**:
- **Author**: Chrono AI Student Guild
- **Format**: High-yield 12-page Cheat Sheet (6.2 MB)
- **Rating**: ⭐ 4.9 / 5.0 with 5,800+ student downloads.`,
        actionType: "view_study",
        actionId: "mat-003",
        actionLabel: "View ML Cheatsheet"
      },
      {
        keywords: ["robotics", "drone", "iot", "club-002", "kavya"],
        response: `🤖 The **ChronoRobotics & IoT Guild** is currently recruiting!
- **President**: Kavya Nair (3rd Year Mechatronics)
- **Active Members**: 260
- **Facilities**: Access to high-precision laser cutters, ROS2 workbenches, and 3D printers.
- **Events**: Autonomous Drone Combat is live today at the East Pavilion!`,
        actionType: "view_club",
        actionId: "club-002",
        actionLabel: "View Robotics Guild"
      },
      {
        keywords: ["today", "live", "happening now", "ongoing"],
        response: `🔴 **Happening Today on Chronova**:
1. **Autonomous Drone Robotics Exhibition & Battle** - Live at East Sports Pavilion Arena until 07:00 PM!
2. **Inter-Campus Valorant Cup** - Streaming live on Twitch & SAC.

Check the Event Mode tab with the "Ongoing" filter to jump into live streams!`,
        actionType: "switch_mode",
        actionId: "events",
        actionLabel: "Explore Ongoing Events"
      },
      {
        keywords: ["admin", "login", "credentials", "upload", "post event"],
        response: `🔐 **Chronova Access Roles**:
- **Student Login**: Use \`student@chronova.edu\` (Password: \`student123\`) to bookmark notes, register for events, and manage club memberships.
- **Admin Login**: Use \`admin@chronova.edu\` (Password: \`admin123\`) to unlock the Admin Action Bar to post new events and publish verified study notes!

Click the **Log In** button at top right to try it instantly!`,
        actionType: "open_login",
        actionId: "admin",
        actionLabel: "Open Admin Login"
      },
      {
        keywords: ["club", "clubs", "join club", "societies", "membership"],
        response: `👥 Chronova hosts 7 vibrant campus clubs including **ChronoCode Developers**, **Robotics Guild**, **AI Nexus**, and **PixelForge**.
You can view upcoming events hosted by each club and submit an instant recruitment application in the **Clubs Showcase** tab!`,
        actionType: "switch_mode",
        actionId: "clubs",
        actionLabel: "Browse Campus Clubs"
      }
    ]
  },

  // 5. MOCK CREDENTIALS & INITIAL USERS
  users: {
    student: {
      id: "usr-std-101",
      email: "student@chronova.edu",
      password: "student123",
      name: "Arya Patel",
      role: "student",
      department: "Computer Science & Eng.",
      semester: 4,
      studentId: "CHRO-2024-CS089",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      registeredEventIds: ["evt-001", "evt-002"],
      savedMaterialIds: ["mat-001", "mat-002", "mat-003"],
      joinedClubIds: ["club-001"]
    },
    admin: {
      id: "usr-adm-001",
      email: "admin@chronova.edu",
      password: "admin123",
      name: "Prof. Dev Sharma (Admin)",
      role: "admin",
      department: "Campus Academic & Event Directorate",
      staffId: "CHRO-ADM-004",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      registeredEventIds: [],
      savedMaterialIds: [],
      joinedClubIds: []
    }
  }
};
