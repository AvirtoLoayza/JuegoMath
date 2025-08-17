document.addEventListener('DOMContentLoaded', () => {

    const galleryImages = document.querySelectorAll('#final-showcase-section .gallery-image');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    let currentImageIndex = 0;

    // Función para reproducir sonido de clic (si existe en el ámbito global o se pasa como parámetro)
    const playClickSfx = () => {
        // Asumiendo que 'clickSfx' es una variable global o una función accesible
        // desde script.js, o que se cargará un audio elemento aquí mismo.
        // Para este archivo, lo haremos simple, pero si quieres reusar el del script.js,
        // deberás pasarlo como parámetro o hacerlo global.
        const audio = new Audio('assets/sfx/button-click.mp3'); // Ruta al sonido de clic
        audio.volume = 0.5;
        audio.play().catch(e => console.warn("Audio play prevented:", e));
    };

    /**
     * Muestra la imagen de la galería en el índice especificado.
     * @param {number} index - El índice de la imagen a mostrar.
     */
    const showImage = (index) => {
        // Asegurarse de que el índice esté dentro de los límites
        if (index < 0) {
            index = galleryImages.length - 1;
        } else if (index >= galleryImages.length) {
            index = 0;
        }
        currentImageIndex = index;

        galleryImages.forEach((img, i) => {
            img.classList.remove('active-image');
            const caption = img.nextElementSibling; // El caption es el hermano siguiente de la imagen
            if (caption && caption.classList.contains('image-caption')) {
                caption.classList.remove('animate'); // Quitar animación del caption anterior
            }
            img.style.opacity = '0'; // Asegura que las imágenes no visibles estén ocultas
            img.style.transform = 'scale(0.9)'; // Reinicia la escala
        });

        // Activar la imagen actual
        if (galleryImages[currentImageIndex]) {
            galleryImages[currentImageIndex].classList.add('active-image');
            galleryImages[currentImageIndex].style.opacity = '1';
            galleryImages[currentImageIndex].style.transform = 'scale(1)';

            const caption = galleryImages[currentImageIndex].nextElementSibling;
            if (caption) {
                caption.classList.add('animate'); // Activa la animación del caption
            }
        }
    };

    /**
     * Navega a la siguiente imagen de la galería.
     */
    const nextImage = () => {
        playClickSfx();
        currentImageIndex++;
        showImage(currentImageIndex);
    };

    /**
     * Navega a la imagen anterior de la galería.
     */
    const prevImage = () => {
        playClickSfx();
        currentImageIndex--;
        showImage(currentImageIndex);
    };

    // AñadirEventListeners a los botones de navegación
    if (prevButton) {
        prevButton.addEventListener('click', prevImage);
    }
    if (nextButton) {
        nextButton.addEventListener('click', nextImage);
    }

    // Inicializar la galería mostrando la primera imagen al cargar
    if (galleryImages.length > 0) {
        showImage(currentImageIndex);
    }

    // Opcional: Auto-avance de la galería después de un tiempo
    let galleryInterval;
    const startGalleryAutoPlay = () => {
    galleryInterval = setInterval(nextImage, 5000); // Cambia cada 5 segundos
    };
    const stopGalleryAutoPlay = () => {
    clearInterval(galleryInterval);
    };

    // // Iniciar el auto-avance cuando la sección de la galería es visible
    const gallerySection = document.getElementById('final-showcase-section');
    if (gallerySection) {
         const observer = new IntersectionObserver((entries) => {
             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                     startGalleryAutoPlay();
                 } else {
                     stopGalleryAutoPlay();
                 }
             });
         }, { threshold: 0.5 }); // Cuando el 50% de la sección es visible
         observer.observe(gallerySection);
    }

    // Consideración: Si quieres que el audio de clic venga del script.js,
    // puedes exportar la función playSfx de script.js y usarla aquí,
    // o hacer que este script se cargue después de script.js y confíe
    // en que 'playSfx' ya esté en el ámbito global.
    // Para simplificar y mantener gallery.js autocontenido, se ha incluido
    // una definición local de playClickSfx.

});