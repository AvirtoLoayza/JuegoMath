document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // ✨ Partículas Mágicas que Siguen el Cursor   //
    // =============================================
    const body = document.body;
    let particles = [];
    const maxParticles = 30; // Más partículas para un rastro más denso
    const particleSize = 8; // Tamaño en píxeles

    const createParticle = (x, y) => {
        const particle = document.createElement('div');
        particle.classList.add('magic-particle');
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${particleSize}px`;
        particle.style.height = `${particleSize}px`;
        particle.style.background = `radial-gradient(circle, #FFD700 0%, #FFA500 50%, transparent 100%)`; // Dorado/naranja
        particle.style.borderRadius = '50%';
        particle.style.position = 'absolute';
        particle.style.pointerEvents = 'none'; // No debe interferir con clics
        particle.style.opacity = '1';
        particle.style.transform = 'scale(1)';
        particle.style.zIndex = '9999'; // Asegura que esté siempre encima

        body.appendChild(particle);
        particles.push(particle);

        // Animación de desvanecimiento y encogimiento
        particle.animate([
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0)' }
        ], {
            duration: 800 + Math.random() * 500, // Duración variable
            easing: 'ease-out',
            fill: 'forwards'
        }).onfinish = () => {
            particle.remove();
            particles = particles.filter(p => p !== particle);
        };
    };

    // Escucha el movimiento del ratón
    document.addEventListener('mousemove', (e) => {
        // Limitar la creación de partículas para evitar sobrecarga
        if (particles.length < maxParticles) {
            createParticle(e.clientX + Math.random() * 10 - 5, e.clientY + Math.random() * 10 - 5); // Pequeña aleatoriedad en la posición
        }
    });

    // =============================================
    // 🌟 Efectos de Brillo al Pasar el Ratón      //
    // =============================================
    const glowElements = document.querySelectorAll(
        '.main-nav a, .nav-play-button, .medieval-button, .magic-bubble, .character img'
    );

    glowElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.setProperty('--glow-opacity', 1);
            element.style.setProperty('--glow-color', '#FFD700'); // Dorado
            element.classList.add('glowing-effect');
        });

        element.addEventListener('mouseleave', () => {
            element.classList.remove('glowing-effect');
            element.style.setProperty('--glow-opacity', 0); // Desvanece el brillo
        });
    });

    // Añade el CSS para el efecto de brillo (en style.css)
    // .glowing-effect {
    //     position: relative;
    //     overflow: hidden;
    // }
    // .glowing-effect::before {
    //     content: '';
    //     position: absolute;
    //     top: -50%;
    //     left: -50%;
    //     width: 200%;
    //     height: 200%;
    //     background: radial-gradient(circle at center, var(--glow-color, #FFD700) 0%, transparent 70%);
    //     opacity: var(--glow-opacity, 0);
    //     transition: opacity 0.3s ease-out;
    //     animation: rotateGlow 5s linear infinite;
    //     pointer-events: none;
    //     z-index: -1;
    // }
    // @keyframes rotateGlow {
    //     from { transform: rotate(0deg); }
    //     to { transform: rotate(360deg); }
    // }

    // =============================================
    // 👇 Animación de la Flecha de Scroll Inactiva //
    // =============================================
    const scrollIndicator = document.querySelector('.scroll-down-indicator');
    let scrollTimeout;

    const handleScrollActivity = () => {
        clearTimeout(scrollTimeout);
        scrollIndicator.style.opacity = '1'; // Mostrar indicador

        scrollTimeout = setTimeout(() => {
            scrollIndicator.style.opacity = '0.3'; // Atenuar si inactivo
        }, 3000); // 3 segundos de inactividad
    };

    document.addEventListener('scroll', handleScrollActivity);
    handleScrollActivity(); // Llamar al inicio para establecer el estado inicial

    // =============================================
    // ☁️🌌 Cambio Dinámico del Cielo y las Nubes //
    // =============================================
    const sections = document.querySelectorAll('.banner-section');
    const skyBackground = document.querySelector('.sky-background');
    const cloudLayers = document.querySelectorAll('.cloud-layer');
    const cloudLayer1 = document.querySelector('.cloud-layer-1'); // Nubes diurnas
    const cloudLayer2 = document.querySelector('.cloud-layer-2'); // Nubes diurnas adicionales
    const cloudLayer3 = document.querySelector('.cloud-layer-3'); // Nubes oscuras (Dragon Challenge)
    const cloudLayer4 = document.querySelector('.cloud-layer-4'); // Nubes místicas (Magic Guide)
    const cloudLayer5 = document.querySelector('.cloud-layer-5'); // Nubes para Showcase

    // Definir configuraciones de fondo por sección
    const sectionBackgrounds = {
        'intro-scene': {
            sky: 'linear-gradient(to bottom, #87CEEB, #4682B4)', // Cielo diurno
            clouds: [cloudLayer1, cloudLayer2], // Capas de nubes diurnas
            activeClouds: [1, 2] // Índices de capas activas
        },
        'dragon-challenge': {
            sky: 'linear-gradient(to bottom, #1E002D, #0A0014)', // Noche oscura
            clouds: [cloudLayer3, cloudLayer1], // Nubes oscuras principales, una tenue de día
            activeClouds: [3]
        },
        'magic-guide-section': {
            sky: 'linear-gradient(to bottom, #100020, #05000A)', // Místico
            clouds: [cloudLayer4, cloudLayer2], // Nubes místicas principales
            activeClouds: [4]
        },
        'final-showcase-section': {
            sky: 'linear-gradient(to bottom, #001A00, #000A00)', // Bosque antiguo
            clouds: [cloudLayer5, cloudLayer1], // Nubes de bosque/día
            activeClouds: [5]
        },
        'call-to-action-section': {
            sky: 'linear-gradient(to bottom, #000000, #10001A)', // Portal
            clouds: [], // Sin nubes visibles en el portal final
            activeClouds: []
        }
    };

    let currentSectionId = 'intro-scene'; // Sección inicial

    const updateBackground = (newSectionId) => {
        if (newSectionId === currentSectionId) return; // No hacer nada si es la misma sección

        const config = sectionBackgrounds[newSectionId];
        if (!config) return;

        // Transición de cielo
        skyBackground.style.transition = 'background 1.5s ease-in-out';
        skyBackground.style.background = config.sky;

        // Ocultar todas las nubes primero (suavizado)
        cloudLayers.forEach(layer => {
            layer.style.opacity = '0';
        });

        // Activar las nubes correspondientes con un pequeño retraso para la transición
        setTimeout(() => {
            cloudLayers.forEach((layer, index) => {
                const isActive = config.activeClouds.includes(index + 1); // +1 porque los índices de activeClouds son 1-based
                if (isActive) {
                    layer.style.transition = 'opacity 1s ease-in-out';
                    layer.style.opacity = '0.8'; // Restaurar opacidad
                } else {
                    layer.style.transition = 'opacity 1s ease-in-out'; // Asegurar que se desvanezcan
                    layer.style.opacity = '0'; // Asegurar que estén ocultas
                }
            });
        }, 500); // Espera un poco para que el cielo cambie y luego las nubes

        currentSectionId = newSectionId;
    };

    // Observador para cambiar el fondo según la sección visible
    const backgroundObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.7 // Necesita el 70% de la sección para el cambio de fondo
    };

    const backgroundObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateBackground(entry.target.id);
            }
        });
    }, backgroundObserverOptions);

    sections.forEach(section => {
        backgroundObserver.observe(section);
    });

    // Asegurarse de que el fondo inicial sea el correcto
    updateBackground('intro-scene');


    // =============================================
    // 🐉 Animación de la Respiración del Dragón   //
    // =============================================
    const dragonIntroChar = document.getElementById('dragon-intro-char');
    const dragonBreathElement = document.querySelector('.dragon-breath');

    const triggerDragonBreath = () => {
        if (dragonBreathElement) {
            // Reinicia la animación
            dragonBreathElement.style.animation = 'none';
            void dragonBreathElement.offsetWidth; // Trigger reflow
            dragonBreathElement.style.animation = 'dragonBreath 2s ease-out forwards';
            // playSfx(dragonFireSfx); // Si tuvieras un sonido de fuego/aliento
        }
    };

    // Puedes llamar a triggerDragonBreath cuando quieras que el dragón "respire"
    // Por ejemplo, al entrar en la sección de la intro, o periódicamente.
    // Para este ejemplo, la activaremos cuando la sección de la intro esté animada.
    const introObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('animate')) {
                // Dispara la respiración del dragón con un retraso y luego periódicamente
                setTimeout(triggerDragonBreath, 1500); // Primera respiración
                // Opcional: setInterval para respiraciones repetidas
                // setInterval(triggerDragonBreath, 10000); // Cada 10 segundos
            }
        });
    }, { threshold: 0.5 }); // Cuando la mitad de la intro es visible

    introObserver.observe(document.getElementById('intro-scene'));

});