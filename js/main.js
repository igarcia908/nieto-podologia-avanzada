const header  = document.getElementById('header');
const bttBtn  = document.getElementById('btt');
const progressBar = document.getElementById('progress-bar');

function scrollToEl(el) {
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - header.offsetHeight - 12, behavior: 'smooth' });
}

const heroBlob1   = document.querySelector('.hero__blob1');
const heroBlob2   = document.querySelector('.hero__blob2');
const heroVisual  = document.querySelector('.hero__visual');

/* =============================================
   SCROLL: progress bar + header + btt + parallax
   ============================================= */
let scrollMax = document.documentElement.scrollHeight - window.innerHeight;
window.addEventListener('resize', () => {
  scrollMax = document.documentElement.scrollHeight - window.innerHeight;
}, { passive: true });

window.addEventListener('scroll', () => {
  const y = scrollY;
  if (progressBar) progressBar.style.width = (y / scrollMax * 100) + '%';
  header.classList.toggle('header--scrolled', y > 10);
  bttBtn.classList.toggle('btt--show', y > 400);
  if (y < 800) {
    if (heroBlob1)  heroBlob1.style.transform  = `translateY(${y * 0.25}px)`;
    if (heroBlob2)  heroBlob2.style.transform  = `translateY(${y * -0.18}px)`;
    if (heroVisual) heroVisual.style.transform  = `translateY(${y * 0.07}px)`;
  }
}, { passive: true });

/* =============================================
   MOBILE NAV TOGGLE
   ============================================= */
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('nav--open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

mainNav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('nav--open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* =============================================
   BACK TO TOP
   ============================================= */
bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =============================================
   SMOOTH SCROLL FOR ANCHORS
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      scrollToEl(target);
    }
  });
});

/* =============================================
   SCROLL REVEAL
   ============================================= */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('rv--vis');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));

/* =============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link[href^="#"]');

function updateActiveNav() {
  const threshold = header.offsetHeight + 20;
  let currentId = '';
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= threshold) {
      currentId = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('nav__link--active', link.getAttribute('href') === '#' + currentId);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1600;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.style.animation = 'countPop 0.35s var(--ease-spring) forwards';
    }
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

/* =============================================
   3D CARD TILT (service cards + team cards)
   ============================================= */
document.querySelectorAll('.svc-card, .team-card, .news-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'box-shadow 280ms ease, border-color 280ms ease';
  });

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-5px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'box-shadow 280ms ease, border-color 280ms ease, transform 450ms cubic-bezier(0.34,1.56,0.64,1)';
    card.style.transform  = '';
  });
});

/* =============================================
   CERT CARDS: icon spin on hover (handled in CSS,
   but stagger delay is set here)
   ============================================= */
document.querySelectorAll('.certs__grid .cert').forEach((el, i) => {
  el.style.transitionDelay = `${i * 60}ms`;
});

/* =============================================
   BUTTON RIPPLE
   ============================================= */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 1.4;
    ripple.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
      background:rgba(255,255,255,0.25);
      border-radius:50%;
      transform:scale(0);
      animation:ripple 0.55s ease forwards;
      pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple keyframe injected once
if (!document.getElementById('ripple-style')) {
  const style = document.createElement('style');
  style.id = 'ripple-style';
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/* =============================================
   STAGGER GRID CHILDREN (extra delay boost)
   ============================================= */
document.querySelectorAll('.services__grid, .news__grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    // Only set if no existing rv-dX delay class
    if (!child.className.match(/rv-d[1-6]/)) {
      child.style.transitionDelay = `${i * 75}ms`;
    }
  });
});

/* =============================================
   TREATMENT FILTER (condition → tratamientos)
   ============================================= */
(function () {
  const svcCards  = document.querySelectorAll('.svc-card[data-svc]');
  const filterBar = document.getElementById('filterBar');
  const filterLbl = document.getElementById('filterLabel');
  const filterClr = document.getElementById('filterClear');
  const tratSection = document.getElementById('tratamientos');

  function applyFilter(treats, conditionName) {
    const active = new Set(treats.split(','));
    svcCards.forEach(card => {
      const match = active.has(card.dataset.svc);
      card.classList.toggle('svc-card--dim', !match);
      card.classList.toggle('svc-card--highlight', match);
    });
    filterLbl.textContent = 'Filtrando por: ' + conditionName;
    filterBar.removeAttribute('hidden');
  }

  function clearFilter() {
    svcCards.forEach(card => {
      card.classList.remove('svc-card--dim', 'svc-card--highlight');
    });
    filterBar.setAttribute('hidden', '');
  }

  document.querySelectorAll('.dol-card[data-treats] .dol-card__cta').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const card         = link.closest('.dol-card');
      const treats       = card.dataset.treats;
      const conditionName = card.querySelector('.dol-card__title').textContent;
      applyFilter(treats, conditionName);
      scrollToEl(tratSection);
    });
  });

  if (filterClr) filterClr.addEventListener('click', clearFilter);
}());

/* =============================================
   BEFORE / AFTER COMPARISON SLIDERS
   ============================================= */
function initSliders(root) {
  (root || document).querySelectorAll('.case-comp__slider').forEach(slider => {
    if (slider.dataset.sliderInit) return;
    slider.dataset.sliderInit = '1';
    const range  = slider.querySelector('.case-comp__range');
    const handle = slider.querySelector('.case-comp__handle');

    function setPos(pct) {
      const clamped = Math.max(2, Math.min(98, pct));
      slider.style.setProperty('--pos', clamped + '%');
      handle.style.left = clamped + '%';
    }

    range.addEventListener('input', e => setPos(Number(e.target.value)));

    let active = false;
    slider.addEventListener('pointerdown', e => {
      active = true; slider.setPointerCapture(e.pointerId); update(e);
    });
    slider.addEventListener('pointermove', e => { if (active) update(e); });
    slider.addEventListener('pointerup', () => { active = false; });

    function update(e) {
      const rect = slider.getBoundingClientRect();
      const pct  = (e.clientX - rect.left) / rect.width * 100;
      setPos(pct); range.value = pct;
    }
  });
}

initSliders();

/* =============================================
   CUSTOM CURSOR (pointer devices only)
   ============================================= */
(function () {
  // Only run on true pointer devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const ring  = document.getElementById('cursor-ring');
  const dot   = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mouseX = -200, mouseY = -200;
  let ringX  = -200, ringY  = -200;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX - 3.5}px, ${mouseY - 3.5}px)`;
    document.body.classList.add('cursor-active');
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-active');
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.09;
    ringY += (mouseY - ringY) * 0.09;
    if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactives = 'a, button, [role="button"], .hero__tag, .svc-card, .dol-card, .nav__link';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}());

/* =============================================
   SERVICE DETAIL MODAL
   ============================================= */
(function () {
  function buildCaseComp(num, name, tech, beforeSrc, afterSrc) {
    return `<div class="case-comp">
        <div class="case-comp__meta">
          <span class="case-comp__num">${num}</span>
          <div>
            <div class="case-comp__name">${name}</div>
            <div class="case-comp__tech">${tech}</div>
          </div>
        </div>
        <div class="case-comp__slider" style="--pos:50%">
          <img class="case-comp__img--after" src="${afterSrc}" alt="Después - ${name}" loading="lazy">
          <div class="case-comp__before-wrap">
            <img src="${beforeSrc}" alt="Antes - ${name}" loading="lazy">
          </div>
          <div class="case-comp__handle" aria-hidden="true">
            <div class="case-comp__line"></div>
            <div class="case-comp__btn"><svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"/></svg></div>
          </div>
          <input type="range" class="case-comp__range" min="0" max="100" value="50" aria-label="Comparar antes y después caso ${num}">
          <div class="case-comp__lbl-before">Antes</div>
          <div class="case-comp__lbl-after">Después</div>
        </div>
      </div>`;
  }

  const CASE_COMPS_HTML = `<div class="svc-modal__cases">
      ${buildCaseComp('01', 'Corrección de Hallux Valgus', 'Cirugía MIS · Anestesia local',
        'images/antes1-600x600.jpg',
        'images/despues1-600x600.jpg')}
      ${buildCaseComp('02', 'Corrección digital percutánea', 'Cirugía MIS · Técnica percutánea',
        'images/antes2-600x600.jpg',
        'images/despues2-600x600.jpg')}
    </div>`;

  const SVC_DATA = {
    cirugia: {
      badge: 'Cirugía del pie',
      title: 'Cirugía Mínimamente Invasiva (MIS)',
      img: 'images/pexels-photo-6291071.jpeg',
      imgAlt: 'Cirugía mínimamente invasiva del pie',
      desc: `<p>La cirugía mínimamente invasiva (MIS) permite corregir deformidades del pie con incisiones de apenas 3–4 mm, bajo anestesia local y sin hospitalización. El paciente <strong>camina el mismo día</strong> de la intervención y la recuperación se mide en días, no en semanas.</p>
             <p>Llevamos más de 35 años realizando este tipo de cirugías, siendo <strong>pioneros en Euskadi desde 1988</strong>. Cada caso se planifica con diagnóstico por imagen (radiología, ecografía) para garantizar la máxima precisión.</p>
             <p><strong>Patologías que tratamos:</strong></p>
             <ul>
               <li>Hallux Valgus (juanetes)</li>
               <li>Dedos en garra y martillo</li>
               <li>Espolón calcáneo</li>
               <li>Neuroma de Morton</li>
               <li>Metatarsalgias</li>
               <li>Uñas encarnadas complicadas</li>
               <li>Artrosis del pie</li>
               <li>Exostosis y deformidades digitales</li>
             </ul>`,
      casesSection: true
    },
    ortopodologia: {
      badge: 'Ortopodología',
      title: 'Plantillas y ortesis a medida',
      img: 'images/pexels-photo-6111616.jpeg',
      imgAlt: 'Plantillas ortopédicas personalizadas',
      exampleImg: 'images/example_orto.jpeg',
      exampleAlt: 'Ejemplo de plantilla ortopédica personalizada',
      desc: `<p>Fabricamos plantillas y ortesis plantares completamente personalizadas mediante un <strong>estudio biomecánico exhaustivo</strong> en estática y dinámica. Analizamos la pisada y la alineación de todo el miembro inferior para detectar desequilibrios y corregirlos desde la base.</p>
             <p>Las plantillas se elaboran con materiales de alta calidad adaptados a cada tipo de calzado y actividad: uso cotidiano, práctica deportiva o calzado de trabajo. El proceso incluye:</p>
             <ul>
               <li>Estudio de la pisada en plataforma</li>
               <li>Exploración en descarga y carga</li>
               <li>Toma de moldes o escaneo 3D</li>
               <li>Fabricación a medida en nuestro taller</li>
               <li>Revisiones y ajustes posteriores</li>
               <li>Plantillas deportivas especializadas</li>
             </ul>`
    },
    deportiva: {
      badge: 'Podología deportiva',
      title: 'Biomecánica y lesiones deportivas',
      img: 'images/pexels-photo-2526878.jpeg',
      imgAlt: 'Análisis biomecánico deportivo',
      exampleImg: 'images/example_podo_deportiva.jpg',
      exampleAlt: 'Ejemplo de plantilla deportiva personalizada',
      desc: `<p>El pie del deportista soporta cargas hasta <strong>tres veces el peso corporal</strong> en cada zancada. Un pequeño desequilibrio puede desencadenar lesiones en cadena en rodilla, cadera o columna. Nuestro análisis biomecánico completo detecta y corrige estos problemas antes de que se conviertan en lesiones crónicas.</p>
             <p>Trabajamos con deportistas de todos los niveles, desde aficionados hasta atletas de élite, en disciplinas como running, fútbol, ciclismo, tenis y más.</p>
             <ul>
               <li>Análisis de la pisada en cinta y pista</li>
               <li>Estudio en vídeo de la zancada</li>
               <li>Plantillas deportivas personalizadas</li>
               <li>Tratamiento de fascitis plantar</li>
               <li>Tendinopatías y periostitis</li>
               <li>Asesoramiento de calzado deportivo</li>
             </ul>`
    },
    quiropodia: {
      badge: 'Quiropodia',
      title: 'Cuidado y salud del pie',
      img: 'images/quiropodia-barakaldo-1.png',
      imgAlt: 'Quiropodia profesional en Barakaldo',
      desc: `<p>La quiropodia abarca el conjunto de técnicas dedicadas al <strong>cuidado, higiene y mantenimiento del pie</strong>. Un tratamiento regular previene la aparición de patologías más complejas y mantiene los pies en óptimas condiciones.</p>
             <p>Recomendamos revisiones periódicas cada 1–3 meses según el perfil de cada paciente (personas mayores, diabéticos, deportistas). Nuestros tratamientos incluyen:</p>
             <ul>
               <li>Corte y cuidado de uñas</li>
               <li>Deslaminación de callosidades y durezas</li>
               <li>Tratamiento de helomas (ojos de gallo)</li>
               <li>Cuidado de uñas engrosadas (onicogrifosis)</li>
               <li>Tratamiento de uñas encarnadas leves</li>
               <li>Curas podológicas especializadas</li>
             </ul>`
    },
    ondas: {
      badge: 'Ondas de choque',
      title: 'Terapia con ondas de choque extracorpóreas',
      img: 'images/pexels-photo-7446996.jpeg',
      imgAlt: 'Equipo de ondas de choque terapéuticas',
      desc: `<p>La terapia con ondas de choque extracorpóreas (ESWT) utiliza <strong>pulsos acústicos de alta energía</strong> para estimular la curación de tejidos dañados, reducir la inflamación y aliviar el dolor crónico de manera rápida y sin cirugía.</p>
             <p>El tratamiento dura entre 10 y 20 minutos por sesión, no requiere anestesia y permite retomar la actividad normal prácticamente de inmediato. Se recomienda un ciclo de 3–5 sesiones separadas por una semana.</p>
             <ul>
               <li>Fascitis plantar crónica</li>
               <li>Tendinopatía aquílea</li>
               <li>Espolón calcáneo</li>
               <li>Calcificaciones tendinosas</li>
               <li>Neuroma de Morton</li>
               <li>Metatarsalgias persistentes</li>
             </ul>`
    },
    ecografia: {
      badge: 'Ecografía',
      title: 'Diagnóstico ecográfico del pie',
      img: 'images/Ecografo-1024x768.jpg',
      imgAlt: 'Ecógrafo podológico de alta resolución',
      desc: `<p>La ecografía podológica permite visualizar en tiempo real las estructuras del pie: tendones, ligamentos, músculos, nervios y partes blandas. Es una herramienta diagnóstica <strong>fundamental y no invasiva</strong> que complementa la exploración clínica con imágenes de alta resolución.</p>
             <p>A diferencia de la radiografía, la ecografía permite explorar el tejido blando con detalle milimétrico, y puede realizarse tanto en reposo como en movimiento dinámico. También permite <strong>guiar infiltraciones</strong> terapéuticas con precisión.</p>
             <ul>
               <li>Diagnóstico de fascitis plantar</li>
               <li>Roturas y tendinopatías</li>
               <li>Neuromas de Morton</li>
               <li>Quistes sinoviales</li>
               <li>Bursitis y lesiones ligamentosas</li>
               <li>Guía para infiltraciones precisas</li>
             </ul>`
    },
    laser: {
      badge: 'Técnicas Láser',
      title: 'Láser de diodo podológico',
      img: 'images/pexels-photo-3845126.jpeg',
      imgAlt: 'Equipo de láser de diodo para podología',
      desc: `<p>El <strong>láser de diodo</strong> es un dispositivo terapéutico que emite luz coherente de longitud de onda específica, produciendo efectos biológicos beneficiosos sin calor ni daño tisular colateral. Es un tratamiento indoloro, no invasivo y sin tiempo de recuperación.</p>
             <p>En nuestra clínica lo aplicamos en una amplia variedad de patologías del pie, con resultados clínicamente demostrados en estudios internacionales:</p>
             <ul>
               <li>Onicomicosis (hongos en uñas)</li>
               <li>Verrugas plantares (papilomas)</li>
               <li>Lesiones osteomusculares y ligamentosas</li>
               <li>Reducción de inflamación y dolor</li>
               <li>Aceleración de la cicatrización</li>
               <li>Neuralgia y dolor neuropático</li>
             </ul>`
    }
  };

  const modal     = document.getElementById('svcModal');
  const inner     = document.getElementById('svcModalInner');
  const closeBtn  = document.getElementById('svcModalClose');
  const backdrop  = document.getElementById('svcModalBackdrop');

  function openModal(svcId) {
    const data = SVC_DATA[svcId];
    if (!data) return;

    const exampleSection = data.casesSection
      ? `<div class="svc-modal__section-title">Casos reales · Resultados cirugía MIS</div>${CASE_COMPS_HTML}`
      : `<div class="svc-modal__section-title">Ejemplo</div>
             <div class="svc-modal__example-img"><img src="${data.exampleImg || data.img}" alt="${data.exampleAlt || data.imgAlt}" loading="lazy"></div>`;

    inner.innerHTML = `
      <div class="svc-modal__hero">
        <img src="${data.img}" alt="${data.imgAlt}" loading="eager">
      </div>
      <span class="svc-modal__badge">${data.badge}</span>
      <h2 class="svc-modal__title" id="svcModalTitle">${data.title}</h2>
      <div class="svc-modal__desc">${data.desc}</div>
      ${exampleSection}
      <div class="svc-modal__cta">
        <a href="tel:944380595" class="btn btn-warm">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
          Pedir cita
        </a>
        <a href="mailto:info@podologosantiagonieto.com" class="btn btn-outline">Consulta por email</a>
      </div>`;

    modal.removeAttribute('hidden');
    document.body.classList.add('modal-open');

    if (data.casesSection) {
      requestAnimationFrame(() => initSliders(inner));
    }
    requestAnimationFrame(() => closeBtn.focus());
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.classList.remove('modal-open');
    inner.innerHTML = '';
  }

  document.querySelectorAll('[data-expand]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(btn.dataset.expand);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });
}());
