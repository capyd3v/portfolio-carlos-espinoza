const yearElement = document.getElementById('year');
const themeToggle = document.querySelector('.theme-toggle');
const counterElements = document.querySelectorAll('[data-target]');
const profileImage = document.querySelector('[data-profile-image]');
const profileFallback = document.querySelector('[data-profile-fallback]');
const projectList = document.getElementById('project-list');

// INICIO PROYECTOS: añade aquí cada enlace que quieras mostrar en el portfolio.
const projects = [
  { title: 'Estudio Musical', url: 'https://capyd3v.github.io/music-web/' },
  { title: 'Editor de Voxeles', url: 'https://capyd3v.github.io/Voxel-Editor-Online/' },
  { title: 'Portfolio de Manuel Nottaro', url: 'https://portfolio-manuel-nottaro.netlify.app/' },
];
// FIN PROYECTOS

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (profileImage) {
  const showProfileFallback = () => {
    profileImage.hidden = true;
    if (profileFallback) {
      profileFallback.hidden = false;
    }
  };

  const tryProfilePngOrFallback = () => {
    if (profileImage.src.endsWith('profile.jpg')) {
      profileImage.src = 'profile.png';
      setTimeout(() => {
        if (profileImage.complete && profileImage.naturalWidth === 0) {
          showProfileFallback();
        }
      }, 0);
      return;
    }

    showProfileFallback();
  };

  profileImage.addEventListener('error', tryProfilePngOrFallback);
  profileImage.addEventListener('load', () => {
    if (profileImage.naturalWidth === 0) {
      tryProfilePngOrFallback();
    }
  });

  if (profileImage.complete && profileImage.naturalWidth === 0) {
    tryProfilePngOrFallback();
  }
}

const renderProjects = () => {
  if (!projectList) {
    return;
  }

  projectList.innerHTML = projects
    .filter(({ url }) => url && !url.includes('tu-enlace-'))
    .map(
      ({ title, url }, index) => `
        <article class="project-link-card">
          <div class="project-link-header">
            <span class="project-link-tag">Proyecto ${index + 1}</span>
            <strong>${title}</strong>
          </div>
          <iframe
            class="project-preview"
            src="${url}"
            title="Vista previa de ${title}"
            loading="lazy"
          ></iframe>
          <div class="project-link-content">
            <a href="${url}" target="_blank" rel="noreferrer">Ejecutar proyecto</a>
          </div>
        </article>
      `
    )
    .join('');
};

if (projectList && 'IntersectionObserver' in window) {
  const projectObserver = new IntersectionObserver(
    (entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        renderProjects();
        observer.disconnect();
      }
    },
    { rootMargin: '240px' }
  );

  projectObserver.observe(projectList);
} else {
  renderProjects();
}

const setTheme = (isDark) => {
  document.body.classList.toggle('light-theme', !isDark);
  document.body.classList.toggle('dark-mode', isDark);
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  setTheme(false);
} else {
  setTheme(true);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    setTheme(!isDark);
  });
}

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  const duration = 1200;
  const startTime = performance.now();

  const update = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(target * eased);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  };

  requestAnimationFrame(update);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counterElements.forEach((element) => observer.observe(element));
