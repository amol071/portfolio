/* =====================================================
   AMOL VYAVAHARKAR — PORTFOLIO
   Main JavaScript
   ===================================================== */

/* ---- CONFIG — UPDATE THESE ---- */
const CONFIG = {
  github: {
    username: 'amol071',       // ← your GitHub username
    pinnedRepos: [],                    // optional: pin specific repo names first
  },
  youtube: {
    channelId:  'UC6XDWvPa7El3B8CjIuneyRg',  // ← your YouTube channel ID
    channelUrl: 'https://www.youtube.com/@alphamikeoscarlima', // ← your channel URL
    apiKey: 'AIzaSyDlq--6qsA9P6Bcyav9PJ5my46flo3c8j8', // ← your YouTube Data API v3 key (get from Google Cloud Console)
    videos: [
      // This will be populated automatically from API
    ],
    featuredVideoId: 'Q-bwFniLKig',               // ← will be set to latest video automatically
  },
  instagram: {
    handle: 'alphamikeoscarlima',            // ← your Instagram handle
    url: 'https://instagram.com/alphamikeoscarlima',
  },
  social: {
    github:    'https://github.com/amol071',
    youtube:   'https://www.youtube.com/@alphamikeoscarlima',
    instagram: 'https://instagram.com/alphamikeoscarlima',
    twitter:   'https://x.com/Amol07Amol',                     // optional
  }
};

/* =====================================================
   THEME TOGGLE
   ===================================================== */
(function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  document.querySelectorAll('.theme-toggle i').forEach(icon => {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  });
}

/* =====================================================
   NAVIGATION
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // Hamburger toggle
  const hamburger = document.querySelectorAll('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  hamburger.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      mobileMenu && mobileMenu.classList.toggle('open');
    });
  });

  // Close menu on link click
  document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.hamburger').forEach(b => b.classList.remove('open'));
      mobileMenu && mobileMenu.classList.remove('open');
    });
  });

  // Nav scroll effect
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Active nav link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('active');
  });

  // Theme toggle buttons
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Scroll reveal
  initReveal();

  // Scroll-to-top
  document.querySelectorAll('.footer-scroll-top').forEach(btn => {
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  });

  // Page-specific init
  const page = currentPage.replace('.html', '');
  if (page === 'index' || page === '')   initHomePage();
  if (page === 'projects')               initProjectsPage();
  if (page === 'videos')                 initVideosPage();
  if (page === 'about')                  initAboutPage();
  if (page === 'contact')                initContactPage();
});

/* =====================================================
   SCROLL REVEAL (Intersection Observer)
   ===================================================== */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
}

/* =====================================================
   HOME PAGE
   ===================================================== */
function initHomePage() {
  typewriterEffect();
  loadFeaturedProjects();
}

// Typewriter
function typewriterEffect() {
  const el = document.querySelector('.typed-text');
  if (!el) return;
  const roles = ['Web Developer', 'Game Streamer', 'Frontend Engineer', 'Content Creator', 'UI Designer'];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 60 : 100);
  }
  tick();
}

// Load 3 featured projects from GitHub for home page
async function loadFeaturedProjects() {
  const grid = document.querySelector('#featured-projects-grid');
  if (!grid) return;

  try {
    const res  = await fetch(`https://api.github.com/users/${CONFIG.github.username}/repos?sort=updated&per_page=6`);
    const repos = await res.json();
    if (!Array.isArray(repos)) { grid.innerHTML = fallbackProjects(); return; }

    const top = repos.filter(r => !r.fork).slice(0, 3);
    grid.innerHTML = top.map(r => repoCardHTML(r)).join('');
    initReveal();
  } catch {
    grid.innerHTML = fallbackProjects();
  }
}

/* =====================================================
   PROJECTS PAGE
   ===================================================== */
function initProjectsPage() {
  loadAllProjects();
  initFilterBar();
}

async function loadAllProjects() {
  const grid = document.querySelector('#projects-grid');
  if (!grid) return;
  grid.innerHTML = `<div class="loading-spinner" style="grid-column:1/-1"><div class="spinner"></div><p>Loading repos...</p></div>`;

  try {
    const res  = await fetch(`https://api.github.com/users/${CONFIG.github.username}/repos?sort=updated&per_page=30`);
    const repos = await res.json();
    if (!Array.isArray(repos)) throw new Error();
    const filtered = repos.filter(r => !r.fork);
    grid.innerHTML = filtered.map(r => `<div class="card repo-card reveal" data-lang="${(r.language||'other').toLowerCase()}">${repoCardInnerHTML(r)}</div>`).join('');
    initReveal();
  } catch {
    grid.innerHTML = `<p style="color:var(--clr-text-2);padding:2rem;">Could not load repositories. <a href="${CONFIG.social.github}" target="_blank" style="color:var(--clr-accent)">View on GitHub ↗</a></p>`;
  }
}

function initFilterBar() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      document.querySelectorAll('.repo-card').forEach(card => {
        const show = filter === 'all' || card.dataset.lang === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

/* =====================================================
   VIDEOS PAGE
   ===================================================== */
async function initVideosPage() {
  await fetchYouTubeVideos();
  renderVideos();
}

async function fetchYouTubeVideos() {
  if (!CONFIG.youtube.apiKey || !CONFIG.youtube.channelId) {
    console.warn('YouTube API key or channel ID not configured. Using fallback.');
    return;
  }

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${CONFIG.youtube.apiKey}&channelId=${CONFIG.youtube.channelId}&part=snippet&order=date&maxResults=20&type=video`);
    const data = await response.json();

    if (data.error) {
      console.error('YouTube API error:', data.error);
      return;
    }

    CONFIG.youtube.videos = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      date: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description
    }));

    // Set featured video to the latest one
    if (CONFIG.youtube.videos.length > 0) {
      CONFIG.youtube.featuredVideoId = CONFIG.youtube.videos[0].id;
    }
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
  }
}

function renderVideos() {
  const grid = document.querySelector('#videos-grid');
  if (!grid) return;
  if (CONFIG.youtube.videos.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--clr-text-2);">
        <p style="font-size:2rem;margin-bottom:1rem;">🎮</p>
        <p style="font-family:var(--ff-head);font-size:1.1rem;margin-bottom:0.5rem;">No videos loaded.</p>
        <p>Check console for API errors or configure your YouTube API key in <code style="color:var(--clr-accent)">js/main.js</code>.</p>
        <a href="${CONFIG.youtube.channelUrl}" target="_blank" class="btn btn-primary" style="margin-top:1.5rem;display:inline-flex;">
          <i class="fab fa-youtube"></i> View Channel
        </a>
      </div>`;
    return;
  }
  grid.innerHTML = CONFIG.youtube.videos.map(v => videoCardHTML(v)).join('');
  initReveal();
}

function videoCardHTML(v) {
  const thumbUrl = v.thumbnail || `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`;
  return `
    <a href="https://youtube.com/watch?v=${v.id}" target="_blank" class="card video-card reveal" style="padding:0;text-decoration:none;">
      <div class="video-thumb">
        <img src="${thumbUrl}" alt="${v.title}" loading="lazy">
        <div class="video-play-overlay"><i class="fas fa-play-circle"></i></div>
      </div>
      <div class="video-card-body">
        <p class="video-title">${v.title}</p>
        <div class="video-meta-row">
          <span><i class="fas fa-calendar-alt"></i> ${v.date || ''}</span>
        </div>
      </div>
    </a>`;
}

/* =====================================================
   ABOUT PAGE
   ===================================================== */
function initAboutPage() {
  // Nothing dynamic needed; skills/bio are in HTML
}

/* =====================================================
   CONTACT PAGE
   ===================================================== */
function initContactPage() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    // Swap with your backend / Formspree / EmailJS endpoint
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      form.reset();
      setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; btn.style.background = ''; }, 3500);
    }, 1200);
  });
}

/* =====================================================
   HELPERS — GitHub repo card HTML
   ===================================================== */
const LANG_COLORS = {
  javascript:'#f7df1e', typescript:'#3178c6', python:'#3776ab', html:'#e34f26',
  css:'#1572b6', php:'#777bb4', java:'#ed8b00', 'c#':'#68217a', c:'#555',
  'c++':'#f34b7d', ruby:'#cc342d', go:'#00acd7', rust:'#dea584', swift:'#ffac45',
  kotlin:'#7f52ff', vue:'#41b883', svelte:'#ff3e00', shell:'#89e051',
};

function repoCardHTML(r) {
  return `<a href="${r.html_url}" target="_blank" class="card project-card reveal" data-lang="${(r.language||'other').toLowerCase()}" style="text-decoration:none;">
    ${repoCardInnerHTML(r)}
  </a>`;
}

function repoCardInnerHTML(r) {
  const lang  = r.language || 'Other';
  const color = LANG_COLORS[lang.toLowerCase()] || '#94a3b8';
  const desc  = r.description || 'No description provided.';
  const tags  = [r.language, r.topics?.[0], r.topics?.[1]].filter(Boolean);
  return `
    <div class="repo-card-top">
      <div class="project-title">${r.name}</div>
      <span class="repo-visibility">Public</span>
    </div>
    <div class="repo-desc">${desc.length > 110 ? desc.slice(0, 110) + '…' : desc}</div>
    <div class="project-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    <div class="repo-meta">
      ${r.language ? `<span class="repo-meta-item"><span class="repo-lang-dot" style="background:${color}"></span>${lang}</span>` : ''}
      <span class="repo-meta-item"><i class="fas fa-star" style="color:#f59e0b"></i>${r.stargazers_count}</span>
      <span class="repo-meta-item"><i class="fas fa-code-branch" style="color:var(--clr-accent)"></i>${r.forks_count}</span>
    </div>`;
}

function fallbackProjects() {
  const demos = [
    { name:'Portfolio Site', desc:'Personal portfolio website built with HTML, CSS & JS.', lang:'HTML', icon:'🌐' },
    { name:'Game Tracker', desc:'Track your game progress, sessions, and stats.', lang:'JavaScript', icon:'🎮' },
    { name:'UI Components', desc:'Reusable component library for modern web apps.', lang:'CSS', icon:'🎨' },
  ];
  return demos.map(d => `
    <div class="card project-card reveal">
      <div class="project-card-header"><div class="project-icon">${d.icon}</div></div>
      <div class="project-title">${d.name}</div>
      <div class="project-desc">${d.desc}</div>
      <div class="project-tags"><span class="tag">${d.lang}</span></div>
    </div>`).join('');
}
