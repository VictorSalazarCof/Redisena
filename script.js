/* ═══════════════════════════════════════════════════════════════
   script.js — Rediseña SpA
   Toda la lógica de frontend: modales, scroll-reveal,
   copiar correo y comportamientos de la navbar.
═══════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────────────────────
   DATOS DE PROYECTOS
   Modifica este array para actualizar el portafolio sin tocar el HTML.
───────────────────────────────────────────────────────────────── */
const PROJECTS = [
    {
        id: 1,
        name: "Plaza de los Espejos",
        client: "Seat Chile / Municipalidad de Las Condes",
        type: "Comercial",
        tags: ["Estructura Metálica", "Espacio Público", "Fabricación y Montaje"],
        images: ["assets/plaza-espejos-modelo.jpg", "assets/plaza-espejos-obra.jpg"],
    },
    {
        id: 2,
        name: "Ampliación Clínica Alemana",
        client: "Clínica Alemana",
        type: "Industrial",
        tags: ["Losa Colaborante", "Vigas de Alta Capacidad", "Obras Civiles"],
        images: ["assets/clinica-alemana-modelo.jpg", "assets/clinica-alemana-obra.jpg"],
    },
    {
        id: 3,
        name: "Casa Matriz Transportes Huerta",
        client: "Transportes Huerta",
        type: "Residencial",
        tags: ["Memoria de Cálculo", "Planos Estructurales", "Especificaciones Técnicas"],
        images: ["assets/transportes-huerta-modelo.jpg", "assets/transportes-huerta-obra.jpg"],
    },
    {
        id: 4,
        name: "Infraestructura Educacional",
        client: "Liceo Hernando de Magallanes (San Bernardo)",
        type: "Público",
        tags: ["Infraestructura Pública", "Estructura Metálica"],
        images: ["assets/liceo-magallanes-modelo.jpg", "assets/liceo-magallanes-obra.jpg"],
    },
    {
        id: 5,
        name: "Refuerzo Nave Industrial",
        client: "Christensen Boyles",
        type: "Industrial",
        tags: ["Modificación Estructural", "Retiro de Pilares", "Cerchas"],
        images: ["assets/christensen-boyles-modelo.jpg", "assets/christensen-boyles-obra.jpg"],
    },
    {
        id: 6,
        name: "Jaulas Heliportables Mineras",
        client: "Operación Internacional (Colombia)",
        type: "Industrial",
        tags: ["Fabricación Estructural", "Control Dimensional"],
        images: ["assets/jaulas-heliportables-modelo.jpg", "assets/jaulas-heliportables-obra.jpg"],
    }
];

/* Clases Tailwind por tipo — dark-mode compatible */
const TYPE_STYLES = {
    "Comercial":   { bg: "bg-blue-400/10",   text: "text-blue-400"   },
    "Industrial":  { bg: "bg-slate-400/10",  text: "text-slate-400"  },
    "Residencial": { bg: "bg-cyan-400/10",   text: "text-cyan-400"   },
    "Público":     { bg: "bg-violet-400/10", text: "text-violet-400" }
};


/* ─────────────────────────────────────────────────────────────────
   RENDERIZADO DE TARJETAS DE PROYECTO
───────────────────────────────────────────────────────────────── */
function renderProjects() {
    const grid = document.getElementById('projectsGrid');

    PROJECTS.forEach((project, i) => {
        const style    = TYPE_STYLES[project.type] || TYPE_STYLES["Industrial"];
        const delay    = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'][i % 3];
        const tagsHTML = project.tags.map(t =>
            `<span class="tag inline-block px-2 py-0.5 rounded-full" style="background:rgba(255,255,255,0.06);color:#6B7A8D">${t}</span>`
        ).join('');

        const card = document.createElement('article');
        card.className = `project-card reveal ${delay} rounded-xl p-6 cursor-pointer`;
        card.style.cssText = 'background:#111829;border:1px solid rgba(255,255,255,0.07)';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Ver ficha: ${project.name}`);

        card.innerHTML = `
            <div class="flex items-start justify-between mb-5">
                <span class="tag inline-flex items-center px-2.5 py-1 ${style.bg} ${style.text} rounded-full font-semibold">
                    ${project.type}
                </span>
                <div class="w-7 h-7 rounded-full flex items-center justify-center" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08)">
                    <svg class="w-3.5 h-3.5" style="color:#4a5568" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </div>
            </div>
            <h3 class="text-[14px] font-bold text-white leading-snug mb-1.5">${project.name}</h3>
            <p class="text-[12.5px] mb-4" style="color:#5A6A7E">${project.client}</p>
            <div class="flex flex-wrap gap-1.5">${tagsHTML}</div>
        `;

        const openHandler = () => openModal(project.id);
        card.addEventListener('click', openHandler);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openHandler(); }
        });

        grid.appendChild(card);
    });
}


/* ─────────────────────────────────────────────────────────────────
   MODAL DE PROYECTO
───────────────────────────────────────────────────────────────── */
const IMAGE_LABELS = ["Modelo estructural", "Proyecto ejecutado"];

const IMAGE_FALLBACK_ICON = `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 17a4 4 0 100-8 4 4 0 000 8z"/>
    </svg>
`;

function openModal(projectId) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    document.getElementById('modalTitle').textContent  = project.name;
    document.getElementById('modalClient').textContent = project.client;

    document.getElementById('modalTags').innerHTML = project.tags.map(t =>
        `<span class="text-[12px] px-3 py-1.5 rounded-full font-medium border" style="background:rgba(32,96,255,0.1);color:#4d80ff;border-color:rgba(32,96,255,0.2)">${t}</span>`
    ).join('');

    const imagesGrid = document.getElementById('modalImages');
    imagesGrid.innerHTML = (project.images || []).map((src, i) => `
        <figure class="relative rounded-lg overflow-hidden aspect-[4/3]" style="background:#0d1525">
            <img
                src="${src}"
                alt="${IMAGE_LABELS[i] || 'Imagen del proyecto'} — ${project.name}"
                class="modal-img w-full h-full object-cover opacity-0 transition-opacity duration-300"
            >
            <div class="modal-img-fallback hidden absolute inset-0 flex-col items-center justify-center gap-1.5" style="background:#0d1525;color:#3d4e63">
                ${IMAGE_FALLBACK_ICON}
                <span class="text-[10px] font-medium px-2 text-center" style="color:#5A6A7E">${IMAGE_LABELS[i] || 'Imagen del proyecto'}</span>
            </div>
            <figcaption class="absolute bottom-0 inset-x-0 text-white text-[10px] font-medium tracking-wide uppercase text-center py-1.5" style="background:rgba(0,0,0,0.65)">
                ${IMAGE_LABELS[i] || ''}
            </figcaption>
        </figure>
    `).join('');

    imagesGrid.querySelectorAll('.modal-img').forEach(img => {
        img.addEventListener('load', () => img.classList.remove('opacity-0'));
        img.addEventListener('error', () => {
            img.classList.add('hidden');
            const fallback = img.nextElementSibling;
            fallback.classList.remove('hidden');
            fallback.classList.add('flex');
        });
    });

    const modal    = document.getElementById('projectModal');
    const backdrop = document.getElementById('modalBackdrop');
    const panel    = document.getElementById('modalPanel');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        panel.classList.remove('opacity-0', 'translate-y-3', 'scale-[0.97]');
        panel.classList.add('opacity-100', 'translate-y-0', 'scale-100');
    }));
}

function closeModal() {
    const modal    = document.getElementById('projectModal');
    const backdrop = document.getElementById('modalBackdrop');
    const panel    = document.getElementById('modalPanel');

    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    panel.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
    panel.classList.add('opacity-0', 'translate-y-3', 'scale-[0.97]');

    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 280);
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.getElementById('modalBackdrop').addEventListener('click', closeModal);


/* ─────────────────────────────────────────────────────────────────
   COPIAR CORREO AL PORTAPAPELES
───────────────────────────────────────────────────────────────── */
function copyEmail() {
    const EMAIL    = 'm.salazarmuoz@gmail.com';
    const textSpan = document.getElementById('copyEmailText');
    const btn      = document.getElementById('copyEmailBtn');

    navigator.clipboard.writeText(EMAIL)
        .then(() => {
            textSpan.textContent = '¡Copiado!';
            btn.classList.add('text-green-400');
            setTimeout(() => {
                textSpan.textContent = EMAIL;
                btn.classList.remove('text-green-400');
            }, 2000);
        })
        .catch(() => {
            textSpan.textContent = EMAIL + ' (copia manual)';
        });
}


/* ─────────────────────────────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────────────────────────────── */
const scrollObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

function initScrollReveal() {
    document.querySelectorAll('.reveal, .hero-instant').forEach(el => {
        scrollObserver.observe(el);
    });
}


/* ─────────────────────────────────────────────────────────────────
   NAVBAR — SOMBRA AL HACER SCROLL
───────────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('shadow-lg', window.scrollY > 10);
}, { passive: true });


/* ─────────────────────────────────────────────────────────────────
   MENÚ MÓVIL
───────────────────────────────────────────────────────────────── */
document.getElementById('menuBtn').addEventListener('click', () => {
    const menu      = document.getElementById('mobileMenu');
    const iconOpen  = document.getElementById('iconOpen');
    const iconClose = document.getElementById('iconClose');
    const isHidden  = menu.classList.contains('hidden');

    menu.classList.toggle('hidden', !isHidden);
    iconOpen.classList.toggle('hidden',   isHidden);
    iconClose.classList.toggle('hidden', !isHidden);
});

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.add('hidden');
    document.getElementById('iconOpen').classList.remove('hidden');
    document.getElementById('iconClose').classList.add('hidden');
}


/* ─────────────────────────────────────────────────────────────────
   INICIALIZACIÓN
───────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    setTimeout(initScrollReveal, 60);
});
