/* ═══════════════════════════════════════════════════════════════
   script.js — Rediseña SpA
   Toda la lógica de frontend: modales, scroll-reveal, EmailJS,
   copiar correo y comportamientos de la navbar.
═══════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────────────────────
   EMAILJS — INICIALIZACIÓN
   Reemplaza "TU_PUBLIC_KEY" con la clave de tu cuenta EmailJS.
   La encontrarás en: dashboard.emailjs.com → Account → Public Key
───────────────────────────────────────────────────────────────── */
emailjs.init({
    publicKey: "TU_PUBLIC_KEY"
});


/* ─────────────────────────────────────────────────────────────────
   DATOS DE PROYECTOS
   Modifica este array para actualizar el portafolio sin tocar el HTML.
   Cada objeto representa una tarjeta y su ficha de validación modal.
───────────────────────────────────────────────────────────────── */
const PROJECTS = [
    {
        id: 1,
        name: "Plaza de los Espejos",
        client: "Seat Chile / Municipalidad de Las Condes",
        type: "Comercial",
        tags: ["Estructura Metálica", "Espacio Público", "Fabricación y Montaje"],
    },
    {
        id: 2,
        name: "Ampliación Clínica Alemana",
        client: "Clínica Alemana",
        type: "Industrial",
        tags: ["Losa Colaborante", "Vigas de Alta Capacidad", "Obras Civiles"],
    },
    {
        id: 3,
        name: "Casa Matriz Transportes Huerta",
        client: "Transportes Huerta",
        type: "Residencial",
        tags: ["Memoria de Cálculo", "Planos Estructurales", "Especificaciones Técnicas"],
    },
    {
        id: 4,
        name: "Infraestructura Educacional",
        client: "Liceo Hernando de Magallanes (San Bernardo)",
        type: "Público",
        tags: ["Infraestructura Pública", "Estructura Metálica"],
    },
    {
        id: 5,
        name: "Refuerzo Nave Industrial",
        client: "Christensen Boyles",
        type: "Público",
        tags: ["Modificación Estructural", "Retiro de Pilares", "Cerchas"],
    },
    {
        id: 6,
        name: "Jaulas Heliportables Mineras",
        client: "Operación Internacional (Colombia)",
        type: "Industrial",
        tags: ["Fabricación Estructural", "Control Dimensional"],
    }
];

/* Clases de color Tailwind por tipo de proyecto */
const TYPE_STYLES = {
    "Comercial":   { bg: "bg-blue-50",   text: "text-blue-600"   },
    "Industrial":  { bg: "bg-slate-100", text: "text-slate-600"  },
    "Residencial": { bg: "bg-sky-50",    text: "text-sky-600"    },
    "Público":     { bg: "bg-indigo-50", text: "text-indigo-600" }
};


/* ─────────────────────────────────────────────────────────────────
   RENDERIZADO DE TARJETAS DE PROYECTO
   Genera el marcado HTML de cada tarjeta dinámicamente y lo inyecta
   en #projectsGrid. Así el portafolio se mantiene en un único lugar
   (el array PROJECTS) sin duplicar HTML.
───────────────────────────────────────────────────────────────── */
function renderProjects() {
    const grid = document.getElementById('projectsGrid');

    PROJECTS.forEach((project, i) => {
        const style    = TYPE_STYLES[project.type] || TYPE_STYLES["Industrial"];
        const delay    = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'][i % 3];
        const tagsHTML = project.tags.map(t =>
            `<span class="tag inline-block px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">${t}</span>`
        ).join('');

        const card = document.createElement('article');
        card.className = `project-card reveal ${delay} bg-white border border-gray-100 rounded-xl p-6 cursor-pointer`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Ver ficha: ${project.name}`);

        card.innerHTML = `
            <div class="flex items-start justify-between mb-5">
                <span class="tag inline-flex items-center px-2.5 py-1 ${style.bg} ${style.text} rounded-full font-semibold">
                    ${project.type}
                </span>
                <div class="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center">
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </div>
            </div>
            <h3 class="text-[14px] font-bold text-gray-900 leading-snug mb-1.5">${project.name}</h3>
            <p  class="text-[12.5px] text-gray-400 mb-4">${project.client}</p>
            <div class="flex flex-wrap gap-1.5">${tagsHTML}</div>
        `;

        /* Abre el modal al hacer clic o al presionar Enter/Espacio */
        const openHandler = () => openModal(project.id);
        card.addEventListener('click', openHandler);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openHandler();
            }
        });

        grid.appendChild(card);
    });
}


/* ─────────────────────────────────────────────────────────────────
   MODAL DE PROYECTO
   Transición: el panel aparece con opacity + translateY + scale
   usando doble rAF para garantizar que el navegador aplique el
   estado inicial antes de disparar la transición CSS.
───────────────────────────────────────────────────────────────── */
function openModal(projectId) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    /* Poblar campos del modal */
    document.getElementById('modalTitle').textContent        = project.name;
    document.getElementById('modalClient').textContent       = project.client;

    document.getElementById('modalTags').innerHTML = project.tags.map(t =>
        `<span class="text-[12px] px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full font-medium">${t}</span>`
    ).join('');

    /* Mostrar el diálogo */
    const modal    = document.getElementById('projectModal');
    const backdrop = document.getElementById('modalBackdrop');
    const panel    = document.getElementById('modalPanel');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    /* Doble rAF: primero el navegador pinta el estado "hidden",
       luego aplica las clases de entrada disparando la transición */
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

    /* Revertir clases de entrada → dispara la transición de salida */
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    panel.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
    panel.classList.add('opacity-0', 'translate-y-3', 'scale-[0.97]');

    /* Ocultar el contenedor tras completar la transición (300ms) */
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 280);
}

/* Cerrar con tecla Escape */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

/* Cerrar al hacer clic en el backdrop */
document.getElementById('modalBackdrop').addEventListener('click', closeModal);


/* ─────────────────────────────────────────────────────────────────
   FORMULARIO DE CONTACTO — EMAILJS
   Flujo de estados:
     1. Normal    → botón activo, texto "Enviar Mensaje"
     2. Cargando  → botón deshabilitado + spinner, texto "Enviando..."
     3. Éxito     → formulario se desvanece (fade-out 0.4s),
                    aparece el card de confirmación (.fade-in-up)
     4. Error     → banner de error bajo el formulario, botón re-activo
───────────────────────────────────────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn        = document.getElementById('submitBtn');
    const btnText    = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const formError  = document.getElementById('formError');
    const errorText  = document.getElementById('formErrorText');

    /* Validación de campos vacíos en cliente */
    const fieldIds = ['user_name', 'user_company', 'user_email', 'message'];
    const hasEmpty = fieldIds.some(id => !document.getElementById(id).value.trim());

    if (hasEmpty) {
        errorText.textContent = 'Por favor completa todos los campos antes de enviar.';
        formError.classList.remove('hidden');
        return;
    }

    /* Estado: cargando */
    formError.classList.add('hidden');
    btn.disabled = true;
    btnText.textContent = 'Enviando...';
    btnSpinner.classList.remove('hidden');

    /* Envío asíncrono con EmailJS */
    emailjs.sendForm(
        'TU_SERVICE_ID',   // ← REEMPLAZA: dashboard.emailjs.com → Email Services
        'TU_TEMPLATE_ID',  // ← REEMPLAZA: dashboard.emailjs.com → Email Templates
        this               //   'this' apunta al <form> con los name="…" correctos
    )
    .then(() => {
        /* Estado: éxito — fade-out del formulario */
        const formContainer = document.getElementById('formContainer');
        const successState  = document.getElementById('successState');

        formContainer.style.transition = 'opacity 0.4s ease';
        formContainer.style.opacity    = '0';

        setTimeout(() => {
            formContainer.classList.add('hidden');
            successState.classList.remove('hidden');
            /* La clase .fade-in-up en el contenedor hijo dispara la animación CSS */
        }, 420);
    })
    .catch(err => {
        /* Estado: error */
        console.error('EmailJS error:', err);
        errorText.textContent = 'Ocurrió un error al enviar. Por favor inténtalo nuevamente o copia nuestro correo directamente.';
        formError.classList.remove('hidden');

        /* Restaurar botón */
        btn.disabled = false;
        btnText.textContent = 'Enviar Mensaje';
        btnSpinner.classList.add('hidden');
    });
});


/* ─────────────────────────────────────────────────────────────────
   COPIAR CORREO AL PORTAPAPELES
   Microinteracción: el texto cambia a "¡Copiado!" por 2 segundos
   y luego vuelve al estado original.
───────────────────────────────────────────────────────────────── */
function copyEmail() {
    const EMAIL    = 'm.salazarmuoz@gmail.com';
    const textSpan = document.getElementById('copyEmailText');
    const btn      = document.getElementById('copyEmailBtn');

    navigator.clipboard.writeText(EMAIL)
        .then(() => {
            textSpan.textContent = '¡Copiado!';
            btn.classList.add('text-green-500');
            btn.classList.remove('text-gray-400');

            setTimeout(() => {
                textSpan.textContent = 'O copia nuestro correo: ' + EMAIL;
                btn.classList.remove('text-green-500');
                btn.classList.add('text-gray-400');
            }, 2000);
        })
        .catch(() => {
            /* Fallback para entornos sin permisos de portapapeles */
            textSpan.textContent = EMAIL + ' (copia manual)';
        });
}


/* ─────────────────────────────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver
   Observa todos los elementos .reveal y .hero-instant.
   Al entrar en el viewport les agrega .visible, disparando la
   transición CSS definida en styles.css.
───────────────────────────────────────────────────────────────── */
const scrollObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    {
        threshold:   0.08,
        rootMargin: '0px 0px -30px 0px'
    }
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
    document.getElementById('navbar').classList.toggle('shadow-sm', window.scrollY > 10);
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

/* Llamada desde los links del menú móvil via atributo onclick en el HTML */
function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.add('hidden');
    document.getElementById('iconOpen').classList.remove('hidden');
    document.getElementById('iconClose').classList.add('hidden');
}


/* ─────────────────────────────────────────────────────────────────
   INICIALIZACIÓN
   Orden de arranque tras el DOMContentLoaded:
     1. Renderizar tarjetas de proyecto (inyecta elementos .reveal)
     2. Iniciar el observer con un pequeño delay para que los
        elementos recién inyectados estén en el DOM antes de ser
        observados.
───────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    setTimeout(initScrollReveal, 60);
});
