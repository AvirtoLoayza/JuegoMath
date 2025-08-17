document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // 🎵 Control de Audio y Música de Fondo        //
    // =============================================
    const bgMusic = document.getElementById('bg-music');
    const dragonRoarSfx = document.getElementById('dragon-roar-sfx');
    const bubblePopSfx = document.getElementById('bubble-pop-sfx');
    const magicHumSfx = document.getElementById('magic-hum-sfx');
    const successSfx = document.getElementById('success-sfx');
    const failSfx = document.getElementById('fail-sfx');
    const clickSfx = document.getElementById('click-sfx');

    let isMusicPlaying = false;

    // Función para reproducir sonido con un pequeño retraso y volumen
    const playSfx = (audioElement, volume = 0.8) => {
        if (audioElement) {
            audioElement.volume = volume;
            audioElement.currentTime = 0; // Reinicia el audio si ya está sonando
            audioElement.play().catch(e => console.warn("Audio play prevented:", e));
        }
    };

    // Auto-reproducción de música al primer scroll/interacción
    const handleFirstInteraction = () => {
        if (!isMusicPlaying) {
            playSfx(bgMusic, 0.4); // Volumen inicial de la música de fondo
            isMusicPlaying = true;
            document.removeEventListener('scroll', handleFirstInteraction);
            document.removeEventListener('click', handleFirstInteraction);
        }
    };

    document.addEventListener('scroll', handleFirstInteraction, { once: true });
    document.addEventListener('click', handleFirstInteraction, { once: true });

    // =============================================
    // 🏞️ Animaciones al hacer Scroll (Intersection Observer)
    // =============================================
    const sections = document.querySelectorAll('.banner-section');
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.4 // El 40% de la sección debe estar visible
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            const navLink = document.querySelector(`.main-nav ul li a[data-nav-target="#${sectionId}"]`);

            if (entry.isIntersecting) {
                // Añadir clase 'animate' a los elementos internos de la sección actual
                entry.target.querySelectorAll('.hidden, .initial-animation, .section-content, .character, .recordatorio-marco, .image-gallery-container, .magic-portal-effect, #hero-play-button').forEach(el => {
                    el.classList.add('animate');
                    el.classList.remove('hidden'); // Asegura que la visibilidad también se active
                });

                // Activar la música de fondo si aún no lo está (redundante pero seguro)
                handleFirstInteraction();

                // Efectos específicos por sección
                switch (sectionId) {
                    case 'intro-scene':
                        // El dragón entra volando
                        document.getElementById('dragon-intro-char').classList.add('animate');
                        document.querySelector('.scroll-down-indicator').classList.add('animate');
                        break;
                    case 'dragon-challenge':
                        // El jugador aparece
                        document.getElementById('player-character').classList.add('animate');
                        playSfx(dragonRoarSfx); // Rugido del dragón al entrar a esta sección
                        break;
                    case 'magic-guide-section':
                        // El mago aparece
                        document.getElementById('magic-guide-char').classList.add('animate');
                        playSfx(magicHumSfx); // Sonido mágico
                        break;
                    case 'final-showcase-section':
                        // Activa la primera imagen de la galería si no está activa
                        const firstGalleryImage = document.querySelector('#final-showcase-section .gallery-image');
                        if (firstGalleryImage && !firstGalleryImage.classList.contains('active-image')) {
                            firstGalleryImage.classList.add('active-image');
                            const firstCaption = firstGalleryImage.nextElementSibling;
                            if (firstCaption) firstCaption.classList.add('animate'); // Animamos el caption también
                        }
                        break;
                    case 'call-to-action-section':
                        // El portal final se activa
                        document.querySelector('.magic-portal-effect').classList.add('animate');
                        break;
                }

                // Resaltar el enlace de navegación activo
                if (navLink) {
                    navLink.classList.add('active');
                }

            } else {
                // Quitar clase 'animate' cuando la sección no está visible
                entry.target.querySelectorAll('.animate').forEach(el => {
                    el.classList.remove('animate');
                    // Opcional: añadir 'hidden' de nuevo si quieres que se desvanezcan
                    // el.classList.add('hidden');
                });
                // Desactivar el enlace de navegación
                if (navLink) {
                    navLink.classList.remove('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, options);
    sections.forEach(section => {
        observer.observe(section);
    });

    // Animar la sección de introducción inmediatamente
    document.getElementById('intro-scene').classList.add('active-section');
    document.getElementById('central-text-banner').classList.add('animate');
    document.querySelector('.scroll-down-indicator').classList.add('animate');

    // =============================================
    // 🫧 Burbujas Interactivas (Matemáticas para Niños) //
    // =============================================
    const bubblesContainer = document.getElementById('bubbles-container');
    const maxBubbles = 15; // Número máximo de burbujas en pantalla
    const bubbleLifeTime = 10000; // Vida útil de la burbuja en ms (10 segundos)
    const bubbleSpawnInterval = 1500; // Intervalo para generar nuevas burbujas en ms

    // Generador de preguntas matemáticas simples
    const generateMathQuestion = () => {
        const operators = ['+', '-', 'x']; // No incluir división por ahora para simplificar
        const op = operators[Math.floor(Math.random() * operators.length)];
        let num1, num2, question, answer;

        do {
            num1 = Math.floor(Math.random() * 10) + 1; // Números del 1 al 10
            num2 = Math.floor(Math.random() * 10) + 1;

            if (op === '+') {
                answer = num1 + num2;
                question = `${num1} + ${num2} = ?`;
            } else if (op === '-') {
                // Asegura que la respuesta no sea negativa
                if (num1 < num2) {
                    [num1, num2] = [num2, num1]; // Intercambiar para que num1 sea mayor
                }
                answer = num1 - num2;
                question = `${num1} - ${num2} = ?`;
            } else if (op === 'x') {
                answer = num1 * num2;
                question = `${num1} x ${num2} = ?`;
            }
        } while (answer < 0 || answer > 20); // Mantiene las respuestas en un rango manejable para niños (ej. 0-20)

        return { question, answer };
    };

    const createBubble = () => {
        if (document.querySelectorAll('.magic-bubble').length >= maxBubbles) {
            return; // No crear más si ya hay demasiadas
        }

        const bubble = document.createElement('div');
        bubble.classList.add('magic-bubble');

        // Posición inicial aleatoria en el borde inferior o superior
        const startEdge = Math.random() < 0.5 ? 'bottom' : 'top';
        if (startEdge === 'bottom') {
            bubble.style.bottom = '-100px'; // Fuera de vista
            bubble.style.left = `${Math.random() * 100}vw`;
        } else {
            bubble.style.top = '-100px'; // Fuera de vista
            bubble.style.left = `${Math.random() * 100}vw`;
        }


        const { question, answer } = generateMathQuestion();
        bubble.dataset.answer = answer; // Guardar la respuesta correcta

        // Contenido interactivo de la burbuja
        bubble.innerHTML = `
            <div class="bubble-text bubble-question">${question}</div>
            <div class="bubble-input-container hidden">
                <input type="number" class="bubble-input" placeholder="Tu respuesta">
                <button class="bubble-check-btn">¡Comprobar!</button>
            </div>
        `;

        bubblesContainer.appendChild(bubble);

        // Activación de la animación de flotación
        setTimeout(() => {
            // Generar un destino aleatorio para la animación
            const endX = Math.random() * 100; // Porcentaje del ancho de la vista
            const endY = Math.random() * 100; // Porcentaje de la altura de la vista
            const floatDuration = bubbleLifeTime + (Math.random() * 5000); // Variar la duración

            bubble.style.setProperty('--startX', bubble.style.left);
            bubble.style.setProperty('--startY', startEdge === 'bottom' ? '110vh' : '-10vh'); // Usar vh para asegurar que viene de fuera
            bubble.style.setProperty('--endX', `${endX}vw`);
            bubble.style.setProperty('--endY', `${endY}vh`);
            bubble.style.setProperty('--floatDuration', `${floatDuration}ms`);

            bubble.style.animation = `freeFloatBubble var(--floatDuration) linear forwards`;
            bubble.style.opacity = 1; // Hacer visible la burbuja

            // Eliminar la burbuja después de su vida útil
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.classList.add('pop'); // Animación de pop antes de remover
                    playSfx(bubblePopSfx);
                    setTimeout(() => bubble.remove(), 300); // Remover después de la animación de pop
                }
            }, floatDuration);
        }, 100); // Pequeño retraso para que CSS aplique la posición inicial

        // Event listener para la interacción de la burbuja
        bubble.addEventListener('click', (event) => {
            playSfx(clickSfx, 0.5); // Sonido al clickear la burbuja
            const inputContainer = bubble.querySelector('.bubble-input-container');
            const questionText = bubble.querySelector('.bubble-question');

            if (inputContainer.classList.contains('hidden')) {
                // Mostrar el input y ocultar la pregunta
                inputContainer.classList.remove('hidden');
                questionText.classList.add('hidden');
                const inputElement = bubble.querySelector('.bubble-input');
                setTimeout(() => inputElement.focus(), 50); // Enfocar el input
            }
            // Si no está oculto, es que ya está en modo de input, no hacer nada o podrías hacer un toggle para cerrar
        });

        // Event listener para el botón de comprobar respuesta
        const checkBtn = bubble.querySelector('.bubble-check-btn');
        checkBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Evitar que el clic en el botón active el bubble.addEventListener
            const inputElement = bubble.querySelector('.bubble-input');
            const userAnswer = parseInt(inputElement.value);
            const correctAnswer = parseInt(bubble.dataset.answer);

            if (userAnswer === correctAnswer) {
                playSfx(successSfx);
                bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(144, 238, 144, 0.7), rgba(60, 179, 113, 0.4))'; // Verde claro
                bubble.style.boxShadow = '0 0 20px rgba(144, 238, 144, 0.9), inset 0 0 15px rgba(255,255,255,0.7)';
                bubble.querySelector('.bubble-text').textContent = '¡Correcto!';
                bubble.querySelector('.bubble-input-container').classList.add('hidden');
                bubble.querySelector('.bubble-question').classList.remove('hidden');
                bubble.querySelector('.bubble-question').style.fontSize = '1.8em'; // Más grande
                bubble.querySelector('.bubble-question').style.color = '#006400'; // Verde oscuro
                bubble.style.cursor = 'default';
                bubble.removeEventListener('click', (event) => {}); // Deshabilita clics posteriores

                // Animar "pop" después de un breve momento
                setTimeout(() => {
                    bubble.classList.add('pop');
                    setTimeout(() => bubble.remove(), 300);
                }, 1000); // 1 segundo para ver la respuesta

            } else {
                playSfx(failSfx);
                bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255, 99, 71, 0.7), rgba(220, 20, 60, 0.4))'; // Rojo
                bubble.style.boxShadow = '0 0 20px rgba(255, 99, 71, 0.9), inset 0 0 15px rgba(255,255,255,0.7)';
                bubble.querySelector('.bubble-text').textContent = '¡Incorrecto! Intenta de nuevo.';
                inputElement.value = ''; // Limpiar input
                inputElement.classList.add('shake'); // Efecto de sacudida
                setTimeout(() => inputElement.classList.remove('shake'), 500); // Quitar sacudida
            }
        });

        // Permitir envío con "Enter"
        const inputElement = bubble.querySelector('.bubble-input');
        inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkBtn.click();
            }
        });
    };

    // Generar burbujas inicialmente y luego a intervalos
    for (let i = 0; i < 5; i++) { // Empezar con unas pocas burbujas
        createBubble();
    }
    setInterval(createBubble, bubbleSpawnInterval);


    // =============================================
    // ⚡ Rayos de Energía Mágica (Efecto de Fondo) //
    // =============================================
    const magicRaysContainer = document.getElementById('magic-rays-container');
    const maxRays = 8;
    const raySpawnInterval = 3000; // Cada 3 segundos

    const createMagicRay = () => {
        if (document.querySelectorAll('.magic-ray').length >= maxRays) {
            return;
        }

        const ray = document.createElement('div');
        ray.classList.add('magic-ray');

        // Posición inicial aleatoria en la parte superior o inferior, moviéndose horizontalmente
        const startY = Math.random() * 100; // Porcentaje de la altura de la vista
        const duration = 2 + Math.random() * 3; // Duración de 2 a 5 segundos
        const delay = Math.random() * 2; // Retraso para que no aparezcan todas al mismo tiempo

        ray.style.top = `${startY}vh`;
        ray.style.animationDuration = `${duration}s`;
        ray.style.animationDelay = `${delay}s`;

        magicRaysContainer.appendChild(ray);

        // Eliminar el rayo después de que termine su animación
        ray.addEventListener('animationend', () => {
            ray.remove();
        });
    };

    // Generar rayos mágicos
    for (let i = 0; i < 3; i++) { // Unos pocos al inicio
        createMagicRay();
    }
    setInterval(createMagicRay, raySpawnInterval);


    // =============================================
    // 🧭 Navegación entre Secciones              //
    // =============================================
    const navLinks = document.querySelectorAll('.main-nav a, .nav-play-button');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            playSfx(clickSfx, 0.6); // Sonido al clickear enlaces de navegación
            e.preventDefault();
            const targetId = link.dataset.navTarget;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // =============================================
    // 🖼️ Lógica de la Galería de Imágenes         //
    // =============================================
    const galleryImages = document.querySelectorAll('#final-showcase-section .gallery-image');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    let currentImageIndex = 0;

    const showImage = (index) => {
        galleryImages.forEach((img, i) => {
            img.classList.remove('active-image');
            const caption = img.nextElementSibling;
            if (caption && caption.classList.contains('image-caption')) {
                caption.classList.remove('animate');
            }
            // Asegura que las imágenes no visibles tengan opacity 0
            img.style.opacity = '0';
        });

        if (galleryImages[index]) {
            galleryImages[index].classList.add('active-image');
            galleryImages[index].style.opacity = '1'; // Asegura la visibilidad
            const caption = galleryImages[index].nextElementSibling;
            if (caption) {
                caption.classList.add('animate');
            }
        }
    };

    const nextImage = () => {
        playSfx(clickSfx, 0.5);
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        showImage(currentImageIndex);
    };

    const prevImage = () => {
        playSfx(clickSfx, 0.5);
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage(currentImageIndex);
    };

    if (prevButton) prevButton.addEventListener('click', prevImage);
    if (nextButton) nextButton.addEventListener('click', nextImage);

    // Inicializar la galería
    if (galleryImages.length > 0) {
        showImage(currentImageIndex);
    }

    // =============================================
    // 🌟 Otros Elementos Interactivos              //
    // =============================================

    // Mago guía: revelar pista secreta
    const revealClueButton = document.querySelector('.reveal-clue-button');
    const guideDialogue = document.querySelector('.guide-dialogue');
    if (revealClueButton && guideDialogue) {
        revealClueButton.addEventListener('click', () => {
            playSfx(magicHumSfx, 0.7);
            const clues = [
                "¡El secreto de la fuerza es el producto de tu perseverancia y conocimiento!",
                "Si la duda te abruma, divide el problema en partes más pequeñas.",
                "Para conquistar grandes sumas, comienza por dominar las unidades.",
                "En la resta, el orden de los factores sí altera el producto... ¡o más bien, el resultado!"
            ];
            const randomClue = clues[Math.floor(Math.random() * clues.length)];
            guideDialogue.textContent = randomClue;
            guideDialogue.classList.add('visible');
            setTimeout(() => {
                guideDialogue.classList.remove('visible');
            }, 5000); // El diálogo desaparece después de 5 segundos
        });
    }

    // Animación de la respiración del dragón (simulado)
    const dragonBreathElement = document.querySelector('.dragon-breath');
    if (dragonBreathElement) {
        // La animación `dragonBreath` se activará cuando la sección `intro-scene` sea intersectada
        // y se reiniciará para un efecto continuo si el usuario vuelve a la sección
        // Esto se maneja dentro de animateOnScroll.
    }

    // Cursor personalizado (asegúrate de que la imagen 'magic-cursor.png' exista)
    // Ya está en CSS, pero puedes añadir JS para cambiarlo dinámicamente si quieres.
});

// =============================================
// Estilos CSS para el efecto de sacudida del input
// Esto debería ir en style.css, pero lo incluyo aquí como recordatorio
// por si no lo agregaste y para la explicación.
// @keyframes shake {
//     0%, 100% { transform: translateX(0); }
//     20%, 60% { transform: translateX(-5px); }
//     40%, 80% { transform: translateX(5px); }
// }
// .bubble-input.shake {
//     animation: shake 0.5s ease-in-out;
// }