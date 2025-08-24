# Math Magic Battle - Juego de Matemáticas

## Descripción
Un juego educativo de matemáticas con temática de dragones y magia, diseñado para niños.

## Flujo de Navegación

### Pantalla Inicial (Landing Page)
- **Archivo**: `webJuegoMultimedia/index.html`
- **Función**: Página de presentación con animaciones y información del juego
- **Navegación**: Al hacer clic en "¡JUGAR AHORA!" o "¡EMPEZAR LA AVENTURA!" redirige al juego principal

### Juego Principal
- **Archivo**: `index.html` (en la raíz)
- **Función**: Contiene todo el juego de matemáticas
- **Características**:
  - Pantalla de título
  - Menú de selección de operación y nivel
  - Pantalla de juego
  - Pantalla de resultados

## Características del Juego

### Feedback Infantil
- **Respuestas Correctas**: Mensajes como "¡MUY BIEN! 🌟", "¡EXCELENTE! ⭐"
- **Respuestas Incorrectas**: Mensajes como "¡UY! 😢", "¡OOPS! 😅"
- **Animaciones**: Efectos de rebote, brillo y arcoíris

### Fondo Dinámico del Menú
- El fondo del menú cambia según el nivel seleccionado:
  - Nivel 1 (Aprendiz): `images/fondo2.jpg`
  - Nivel 2 (Mago): `images/fondo3.jpg`
  - Nivel 3 (Archimago): `images/fondo4.jpg`

### Operaciones Matemáticas
- Suma
- Resta
- Multiplicación
- División
- Mixto (todas las operaciones)

### Niveles de Dificultad
- **Aprendiz**: Números del 1 al 10
- **Mago**: Números del 1 al 50
- **Archimago**: Números del 1 al 100

## Cómo Jugar

1. Abrir `landing.html` o `webJuegoMultimedia/index.html` en el navegador
2. Explorar la landing page con scroll
3. Hacer clic en "¡JUGAR AHORA!" o "¡EMPEZAR LA AVENTURA!"
4. Seleccionar operación matemática y nivel de dificultad
5. Hacer clic en "COMENZAR BATALLA"
6. Resolver las operaciones matemáticas antes de que el enemigo llegue al jugador

## Archivos Principales

- `landing.html` - Redirección automática a la landing page
- `webJuegoMultimedia/index.html` - Landing page principal
- `index.html` - Juego principal
- `scripts/main.js` - Lógica del juego
- `styles/style.css` - Estilos del juego principal
- `webJuegoMultimedia/css/` - Estilos de la landing page

## Tecnologías Utilizadas
# Sistema Multimedia - Escape del Dragón Matemático

## Descripción General

El sistema multimedia es una funcionalidad integrada en la página web del juego "Escape del Dragón Matemático" que permite a los usuarios acceder a contenido de audio y video a través de tres opciones principales:

1. **📻 Radio FM** - Reproducción de estaciones de radio en vivo
2. **🎵 Música** - Búsqueda y reproducción de música (solo audio)
3. **🎬 Video** - Búsqueda y reproducción de videos con audio

## Características Principales

### 🎯 Menú Desplegable
- Acceso directo desde la barra de navegación principal
- Diseño intuitivo con iconos descriptivos
- Animaciones suaves y transiciones elegantes

### 📻 Radio FM
- **8 estaciones predefinidas** con diferentes géneros musicales
- **Filtrado por género**: Rock, Jazz, Clásica, Ambient, Pop, Electrónica, Instrumental, Chill
- **Búsqueda de estaciones** por nombre, género o descripción
- **Sistema de favoritos** con persistencia en localStorage
- **Reproductor de audio integrado** con controles nativos
- **Información en tiempo real** de la estación reproduciéndose

### 🎵 Reproductor de Música
- **Búsqueda inteligente** de canciones y artistas
- **Resultados simulados** de YouTube (preparado para API real)
- **Reproducción solo audio** (sin video)
- **Controles de reproducción** (anterior, reproducir/pausar, siguiente)
- **Información detallada** de cada canción
- **Historial de reproducción** automático

### 🎬 Reproductor de Video
- **Búsqueda de videos** educativos y de entretenimiento
- **Reproductor simulado** con controles de video
- **Barra de progreso** y tiempo de reproducción
- **Información del canal** y estadísticas de vistas
- **Historial de reproducción** automático

## Estructura de Archivos

```
webJuegoMultimedia/
├── js/
│   ├── multimedia.js          # Sistema principal multimedia
│   ├── radio-config.js        # Configuración de estaciones de radio
│   └── youtube-integration.js # Integración simulada con YouTube
├── css/
│   └── multimedia.css         # Estilos del sistema multimedia
└── index.html                 # Archivo principal (actualizado)
```

## Funcionalidades Técnicas

### 🔧 Sistema de Radio
- **Configuración modular** de estaciones
- **Filtrado dinámico** por género
- **Búsqueda en tiempo real**
- **Gestión de favoritos** persistente
- **Reproducción de streams** de audio

### 🎵 Integración de Música
- **API simulada** de YouTube (preparada para integración real)
- **Búsqueda semántica** de contenido musical
- **Reproducción solo audio** optimizada
- **Sistema de historial** local

### 🎬 Sistema de Video
- **Reproductor simulado** con controles completos
- **Búsqueda de contenido** educativo y de entretenimiento
- **Interfaz de usuario** intuitiva
- **Gestión de estado** de reproducción

### 🎨 Interfaz de Usuario
- **Diseño responsivo** para dispositivos móviles
- **Tema oscuro** consistente con el juego
- **Animaciones CSS** suaves y profesionales
- **Notificaciones** en tiempo real
- **Iconografía** descriptiva y clara

## Uso del Sistema

### 1. Acceso al Menú
- Hacer clic en "Multimedia ▼" en la barra de navegación
- Se despliega un menú con las tres opciones disponibles

### 2. Radio FM
- Seleccionar "FM" del menú desplegable
- Usar filtros de género o búsqueda para encontrar estaciones
- Hacer clic en el botón de reproducción para escuchar
- Marcar estaciones como favoritas con el botón de corazón

### 3. Música
- Seleccionar "Música" del menú desplegable
- Buscar canciones, artistas o géneros musicales
- Hacer clic en "Reproducir" para iniciar la música (solo audio)
- Usar controles de reproducción para navegar entre canciones

### 4. Video
- Seleccionar "Video" del menú desplegable
- Buscar contenido educativo o de entretenimiento
- Hacer clic en "Reproducir" para iniciar el video
- Usar controles de video para pausar, adelantar, etc.

## Configuración y Personalización

### Estaciones de Radio
Editar `js/radio-config.js` para:
- Agregar nuevas estaciones
- Modificar géneros musicales
- Cambiar URLs de streaming
- Ajustar configuraciones de audio

### Integración con YouTube
Para implementar la API real de YouTube:
1. Obtener una API key de Google Cloud Console
2. Modificar `js/youtube-integration.js`
3. Reemplazar métodos simulados con llamadas reales a la API
4. Configurar límites de cuota y manejo de errores

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica y elementos multimedia
- **CSS3**: Estilos avanzados, animaciones y diseño responsivo
- **JavaScript ES6+**: Programación orientada a objetos y async/await
- **Web Audio API**: Reproducción de audio en navegador
- **LocalStorage**: Persistencia de datos del usuario
- **CSS Grid/Flexbox**: Layouts modernos y responsivos

## Compatibilidad

- **Navegadores modernos**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Dispositivos móviles**: iOS 12+, Android 8+
- **Funcionalidades**: Audio, video, localStorage, CSS Grid/Flexbox

## Notas de Desarrollo

### Estado Actual
- ✅ Sistema completamente funcional
- ✅ Interfaz de usuario pulida
- ✅ Integración modular de componentes
- ✅ Sistema de radio funcional con streams reales
- ✅ Simulación completa de YouTube

### Próximos Pasos
- 🔄 Integración real con API de YouTube
- 🔄 Sistema de playlists personalizadas
- 🔄 Descarga de contenido (donde sea legal)
- 🔄 Sincronización con servicios de música
- 🔄 Análisis de preferencias del usuario

### Consideraciones de Rendimiento
- Lazy loading de contenido multimedia
- Optimización de búsquedas con debouncing
- Gestión eficiente de memoria para streams de audio
- Compresión de datos para historial local

## Soporte y Mantenimiento

El sistema multimedia está diseñado para ser:
- **Modular**: Fácil de mantener y actualizar
- **Escalable**: Preparado para nuevas funcionalidades
- **Robusto**: Manejo de errores y estados edge
- **Accesible**: Compatible con tecnologías asistivas

---

**Desarrollado para "Escape del Dragón Matemático"** 🐉✨
*Una aventura educativa donde los números cobran vida* 
- HTML5
- CSS3 (con animaciones y efectos visuales)
- JavaScript (vanilla)
- Fuentes web (Google Fonts)
- Imágenes y sonidos para efectos multimedia 