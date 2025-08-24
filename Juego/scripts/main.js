// Variables del juego
let currentScreen = 'title';
let selectedOperation = '';
let selectedLevel = 1;
let score = 0;
let highscore = localStorage.getItem('mathMagicHighscore') || 0;
let lives = 3;
let correctAnswers = 0;
let totalQuestions = 0;
let timeLeft = 100; // Representa el tiempo y la posición del enemigo (100% = inicio, 0% = llegó al jugador)
let enemySpeed = 0.5; // Velocidad base del enemigo
let moveInterval = null; // Intervalo para mover al enemigo
let questionActive = false; // Indica si hay una pregunta activa
let currentAnswer = 0;
let gameWon = false;
let enemyPosition = 100; // Posición del enemigo (100 = derecha, 0 = izquierda)
let playerPosition = 0; // Posición del jugador (izquierda fija)
let enemyMoveInterval;
let questionsAnswered = 0;
let targetQuestions = 10; // Preguntas necesarias para ganar
let gameAudio; // Audio del juego

// Elementos del DOM
const titleScreen = document.getElementById('title-screen');
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const questionDisplay = document.getElementById('question-display');
const answerOptions = document.getElementById('answer-options');
const scoreDisplay = document.getElementById('score');
const highscoreDisplay = document.getElementById('highscore');
const livesDisplay = document.getElementById('lives');
const questionsProgressDisplay = document.getElementById('questions-progress');
const finalScoreDisplay = document.getElementById('final-score');
const finalHighscoreDisplay = document.getElementById('final-highscore');
const correctAnswersDisplay = document.getElementById('correct-answers');
const totalQuestionsDisplay = document.getElementById('total-questions');
const feedbackOverlay = document.getElementById('feedback-overlay');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackMessage = document.getElementById('feedback-message');
const gameScene = document.getElementById('game-scene');
const playerCharacter = document.getElementById('player-character');
const enemyCharacter = document.getElementById('enemy-character');
const enemyProgressBar = document.getElementById('enemy-progress-bar');

// Verificar que las imágenes se cargan correctamente
function checkImageLoad() {
  const actor1Img = new Image();
  actor1Img.onload = function() {
    console.log('✅ actor1.gif cargado correctamente');
  };
  actor1Img.onerror = function() {
    console.log('❌ Error cargando actor1.gif');
  };
  actor1Img.src = 'images/actor1.gif';
  
  const maloImg = new Image();
  maloImg.onload = function() {
    console.log('✅ malo.gif cargado correctamente');
  };
  maloImg.onerror = function() {
    console.log('❌ Error cargando malo.gif');
  };
  maloImg.src = 'images/malo.gif';
}

// Inicializar el juego
function initGame() {
  highscoreDisplay.textContent = highscore;
  setupEventListeners();
  
  // Inicializar audio
  gameAudio = new Audio('assets/sounds/je.mp3');
  gameAudio.volume = 0.3;
  
  // Verificar carga de imágenes
  checkImageLoad();
}

// Configurar event listeners
function setupEventListeners() {
  // Los event listeners se configuran en el HTML con onclick
}

// Iniciar el juego
function startGame() {
  titleScreen.style.display = 'none';
  menuScreen.style.display = 'block';
  currentScreen = 'menu';
  
  // Inicializar el fondo del menú con el nivel por defecto
  updateMenuBackground();
}

// Volver al inicio
function goHome() {
  menuScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  resultScreen.style.display = 'none';
  titleScreen.style.display = 'block';
  currentScreen = 'title';
  
  // Resetear valores si estaba en juego
  resetGame();
}

// Volver al menú
function goToMenu() {
  gameScreen.style.display = 'none';
  resultScreen.style.display = 'none';
  menuScreen.style.display = 'block';
  currentScreen = 'menu';
  
  // Resetear valores del juego
  resetGame();
}

// Seleccionar operación
function selectOperation(op) {
  selectedOperation = op;
  
  // Actualizar UI para mostrar la operación seleccionada
  document.querySelectorAll('.operation-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // Encontrar el botón correspondiente
  const buttons = document.querySelectorAll('.operation-btn');
  const operationMap = {
    'add': 0,
    'subtract': 1,
    'multiply': 2,
    'divide': 3,
    'mixed': 4
  };
  
  if (operationMap[op] !== undefined) {
    buttons[operationMap[op]].classList.add('selected');
  }
  
  // Actualizar fondo del menú según el nivel seleccionado
  updateMenuBackground();
}

// Seleccionar nivel
function selectLevel(level) {
  selectedLevel = level;
  
  // Actualizar UI para mostrar el nivel seleccionado
  document.querySelectorAll('.level-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Encontrar la opción correspondiente
  const options = document.querySelectorAll('.level-option');
  if (options[level - 1]) {
    options[level - 1].classList.add('selected');
  }
  
  // Actualizar fondo del menú según el nivel seleccionado
  updateMenuBackground();
}

// Actualizar fondo del menú según el nivel seleccionado
function updateMenuBackground() {
  const menuBackground = document.querySelector('.menu-background');
  if (!menuBackground) return;
  
  const backgrounds = {
    1: 'images/fondo2.jpg',
    2: 'images/fondo3.jpg',
    3: 'images/fondo4.jpg'
  };
  
  if (backgrounds[selectedLevel]) {
    menuBackground.style.backgroundImage = `url('${backgrounds[selectedLevel]}')`;
    menuBackground.style.backgroundSize = 'cover';
    menuBackground.style.backgroundPosition = 'center';
    menuBackground.style.backgroundRepeat = 'no-repeat';
    
    // Crear o actualizar overlay
    let overlay = menuBackground.querySelector('.menu-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'menu-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 2;
      `;
      menuBackground.appendChild(overlay);
    }
  }
}

// Comenzar la batalla
function startBattle() {
  if (!selectedOperation) {
    showAlert('Por favor selecciona una operación');
    return;
  }
  
  menuScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  currentScreen = 'game';
  
  // Configurar escena según nivel
  setupScene();
  
  // Iniciar valores del juego
  score = 0;
  lives = 3;
  correctAnswers = 0;
  totalQuestions = 0;
  questionsAnswered = 0;
  gameWon = false;
  timeLeft = 100; // Enemigo empieza desde la derecha
  
  // Ajustar velocidad del enemigo según nivel
  enemySpeed = selectedLevel * 0.3;
  
  // Actualizar UI
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  questionsProgressDisplay.textContent = `${questionsAnswered}/${targetQuestions}`;
  
  // Mostrar instrucciones
  showInstructions();
  
  // Iniciar movimiento del enemigo después de un breve retraso
  setTimeout(() => {
    startEnemyMovement();
    generateQuestion();
  }, 2000);
}

// Mostrar instrucciones del juego
function showInstructions() {
  const overlay = document.createElement('div');
  overlay.id = 'instrucciones-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '1000';

  const content = document.createElement('div');
  content.style.maxWidth = '600px';
  content.style.padding = '30px';
  content.style.backgroundColor = '#222';
  content.style.border = '4px solid #ffcc00';
  content.style.borderRadius = '20px';
  content.style.textAlign = 'center';
  content.style.fontFamily = "'Segoe UI', sans-serif";
  content.style.color = 'white';
  content.style.cursor = 'pointer';

  content.innerHTML = `
    <h2 style="color: #ffcc00;">🏰 ¡BIENVENIDO A LA BATALLA DE MATEMÁTICAS! 🏰</h2>
    <p style="margin-bottom: 12px;">🗡️ <strong>INSTRUCCIONES DE COMBATE</strong> 🛡️</p>
    <p style="margin-bottom: 12px;">✅ Responde correctamente para lanzar un cuchillo y derrotar al enemigo.</p>
    <p style="margin-bottom: 12px;">❌ Si el enemigo te alcanza, perderás una vida.</p>
    <p style="margin-bottom: 12px;">🎯 Acumula <strong>10 respuestas correctas</strong> para ganar la batalla.</p>
    <p style="margin-bottom: 12px;">⚠️ Cada error acelera el avance del enemigo, ¡sé preciso!</p>
    <p style="margin-top: 20px; color: #eb4318ff; font-weight: bold;">🔥 ¡TOCA ESTE MARCO PARA COMENZAR! 🔥</p>
  `;
  
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  content.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

// Configurar escena del juego
function setupScene() {
  // Limpiar clases anteriores
  gameScene.className = 'game-background';
  playerCharacter.className = 'wizard-character animated';
  enemyCharacter.className = 'enemy-character animated';
  
  // Añadir clases según nivel
  gameScene.classList.add(`level-${selectedLevel}`);
  
  // Configurar fondo según nivel
  const backgrounds = {
    1: 'images/fondo2.jpg',
    2: 'images/fondo3.jpg',
    3: 'images/fondo4.jpg'
  };
  
  if (backgrounds[selectedLevel]) {
    gameScene.style.backgroundImage = `url('${backgrounds[selectedLevel]}')`;
  }
  
  // Configurar personajes
  setupPlayerCharacter();
  setupEnemyByLevel();
  
  // Animaciones diferentes según nivel
  if (selectedLevel === 3) {
    playerCharacter.classList.add('power-up');
  }
  
  // Posicionar personajes correctamente
  positionCharacters();
}

// Configurar el personaje del jugador (actor1)
function setupPlayerCharacter() {
  playerCharacter.style.backgroundImage = "url('images/actor1.gif')";
  playerCharacter.style.backgroundSize = 'contain';
  playerCharacter.style.backgroundRepeat = 'no-repeat';
  playerCharacter.style.backgroundPosition = 'center';
  
  // Agregar texto de fallback
  playerCharacter.innerHTML = '<div style="color: white; text-align: center; padding-top: 50px; font-size: 12px;">ACTOR1</div>';
}

// Configurar enemigo según el nivel
function setupEnemyByLevel() {
  const enemies = {
    1: 'images/malo.gif',
    2: 'images/malo2.gif',
    3: 'images/malo3.gif'
  };
  
  if (enemies[selectedLevel]) {
    enemyCharacter.style.backgroundImage = `url('${enemies[selectedLevel]}')`;
    enemyCharacter.style.backgroundSize = 'contain';
    enemyCharacter.style.backgroundRepeat = 'no-repeat';
    enemyCharacter.style.backgroundPosition = 'center';
    
    // Agregar texto de fallback
    enemyCharacter.innerHTML = '<div style="color: white; text-align: center; padding-top: 50px; font-size: 12px;">ENEMIGO</div>';
  }
}

// Posicionar personajes correctamente
function positionCharacters() {
  // Jugador fijo en la izquierda
  playerCharacter.style.position = 'absolute';
  playerCharacter.style.left = '6vw';
  playerCharacter.style.bottom = '8vh';
  playerCharacter.style.width = '120px';
  playerCharacter.style.height = '150px';
  
  // Enemigo empieza fuera de la pantalla a la derecha
  enemyCharacter.style.position = 'absolute';
  enemyCharacter.style.right = '-200px';
  enemyCharacter.style.bottom = '8vh';
  enemyCharacter.style.width = '120px';
  enemyCharacter.style.height = '150px';
}

// Iniciar movimiento del enemigo
function startEnemyMovement() {
  if (moveInterval) clearInterval(moveInterval);
  
  questionActive = true;
  
  // Asegurar que el enemigo esté en la posición inicial
  enemyCharacter.style.right = '-200px';
  enemyCharacter.classList.remove('enemy-active');
  
  // Forzar reflow
  enemyCharacter.offsetHeight;
  
  // Configurar CSS variables para la animación
  document.documentElement.style.setProperty('--enemy-duration', `${Math.max(5, 10 - enemySpeed)}s`);
  
  // Agregar clase para animación
  enemyCharacter.classList.add('enemy-active');
  
  moveInterval = setInterval(() => {
    if (!questionActive) {
      clearInterval(moveInterval);
      return;
    }
    
    // Reducir tiempo y actualizar barra de progreso
    timeLeft -= enemySpeed;
    enemyProgressBar.style.width = `${Math.max(0, timeLeft)}%`;
    
    // Verificar si el enemigo llegó al jugador (tiempo agotado)
    if (timeLeft <= 0) {
      enemyReachedPlayer();
      clearInterval(moveInterval);
    }
  }, 50);
}

// Enemigo llegó al jugador (colisión)
function enemyReachedPlayer() {
  questionActive = false;
  clearInterval(moveInterval);
  lives--;
  livesDisplay.textContent = lives;
  
  // Animación de colisión
  playerCharacter.style.animation = 'damage 0.5s';
  enemyCharacter.style.animation = 'attack 0.5s';
  
  // Reproducir sonido de daño
  if (gameAudio) {
    gameAudio.currentTime = 0;
    gameAudio.play().catch(e => console.log('Error reproduciendo audio:', e));
  }
  
  // Mostrar feedback
  showFeedback('¡Te han alcanzado!', `Te quedan ${lives} vidas`);
  
  // Después de la animación de daño
  setTimeout(() => {
    playerCharacter.style.animation = '';
    enemyCharacter.style.animation = '';
    if (lives <= 0) {
      endGame(false);
    } else {
      // Resetear para la siguiente pregunta
      resetForNextQuestion();
    }
  }, 1500);
}

// Generar pregunta
function generateQuestion() {
  const operators = {
    add: '+',
    subtract: '-',
    multiply: '×',
    divide: '÷',
    mixed: ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)]
  };

  // Determinar rango de números según nivel
  let maxNumber;
  switch(selectedLevel) {
    case 1: maxNumber = 10; break;
    case 2: maxNumber = 50; break;
    case 3: maxNumber = 100; break;
    default: maxNumber = 10;
  }

  let num1 = Math.floor(Math.random() * maxNumber) + 1;
  let num2 = Math.floor(Math.random() * maxNumber) + 1;
  
  // Asegurar división válida
  if (selectedOperation === 'divide' || (selectedOperation === 'mixed' && operators.mixed === '÷')) {
    num1 = num1 * num2;
  }

  const operator = selectedOperation === 'mixed' ? operators.mixed : operators[selectedOperation];
  const question = `${num1} ${operator} ${num2}`;
  
  // Calcular respuesta
  let answer;
  switch(operator) {
    case '+': answer = num1 + num2; break;
    case '-': answer = num1 - num2; break;
    case '×': answer = num1 * num2; break;
    case '÷': answer = num1 / num2; break;
  }
  
  currentAnswer = answer;
  totalQuestions++;
  
  // Mostrar pregunta
  questionDisplay.innerHTML = `<span class="number">${num1}</span> <span class="operator">${operator}</span> <span class="number">${num2}</span> <span class="equals">=</span>`;
  
  // Generar opciones de respuesta
  generateAnswerOptions(answer, maxNumber);
}

// Generar opciones de respuesta
function generateAnswerOptions(correctAnswer, maxNumber) {
  answerOptions.innerHTML = '';
  const options = [correctAnswer];
  
  // Generar respuestas incorrectas basadas en el nivel
  while (options.length < 4) {
    let randomAnswer;
    const variation = Math.floor(maxNumber / 10) + 1;
    
    if (Math.random() > 0.5) {
      randomAnswer = correctAnswer + Math.floor(Math.random() * variation) + 1;
    } else {
      randomAnswer = correctAnswer - Math.floor(Math.random() * variation) - 1;
    }
    
    // Asegurar que no sea negativo en niveles bajos
    if (selectedLevel === 1 && randomAnswer < 0) {
      randomAnswer = Math.abs(randomAnswer);
    }
    
    // Evitar duplicados
    if (!options.includes(randomAnswer) && randomAnswer !== 0) {
      options.push(randomAnswer);
    }
  }
  
  // Mezclar opciones
  shuffleArray(options);
  
  // Crear botones de opciones
  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(option));
    answerOptions.appendChild(button);
  });
}

// Verificar respuesta
function checkAnswer(selectedAnswer) {
  const isCorrect = selectedAnswer === currentAnswer;
  questionActive = false;
  clearInterval(moveInterval);
  
  if (isCorrect) {
    // Respuesta correcta - jugador ataca al enemigo
    score += selectedLevel * 10;
    correctAnswers++;
    questionsAnswered++;
    updateScore();
    
    // Animación de ataque del jugador
    playerCharacter.style.animation = 'attack 0.5s';
    enemyCharacter.style.animation = 'damage 0.5s';
    
    // Crear espada/proyectil
    createSwordProjectile();
    
    // Temática infantil para aciertos
    const successMessages = [
      '¡MUY BIEN! 🌟',
      '¡EXCELENTE! ⭐',
      '¡FANTÁSTICO! 🎉',
      '¡INCREÍBLE! 🏆',
      '¡PERFECTO! 💫',
      '¡GENIAL! 🎊',
      '¡BRAVO! 👏',
      '¡SUPER! 🚀'
    ];
    
    const randomSuccess = successMessages[Math.floor(Math.random() * successMessages.length)];
    showFeedback(randomSuccess, `+${selectedLevel * 10} puntos. ¡Sigue así! 🎯`);
    
    // Verificar si ganó
    if (questionsAnswered >= targetQuestions) {
      setTimeout(() => {
        endGame(true);
      }, 2000);
      return;
    }
    
    // Actualizar progreso de preguntas
    questionsProgressDisplay.textContent = `${questionsAnswered}/${targetQuestions}`;
    
    // Resetear para la siguiente pregunta después de la animación
    setTimeout(() => {
      playerCharacter.style.animation = '';
      enemyCharacter.style.animation = '';
      resetForNextQuestion();
    }, 1500);
    
  } else {
    // Respuesta incorrecta - el enemigo se acerca más
    enemySpeed += 0.2; // Aumentar velocidad del enemigo
    timeLeft -= 20; // Penalización de tiempo
    
    // Temática infantil para errores
    const errorMessages = [
      '¡UY! 😢',
      '¡OOPS! 😅',
      '¡CÁSPITA! 😔',
      '¡AY NO! 😭',
      '¡UPS! 😰',
      '¡OH NO! 😥',
      '¡MALO! 😞',
      '¡ERROR! 😓'
    ];
    
    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    showFeedback(randomError, `La respuesta era: ${currentAnswer}. ¡No te rindas! 💪`);
    
    // Animación de daño al jugador
    playerCharacter.classList.add('damage');
    
    setTimeout(() => {
      playerCharacter.classList.remove('damage');
      
      if (timeLeft <= 0) {
        enemyReachedPlayer();
      } else {
        // Continuar con el movimiento actual
        questionActive = true;
        startEnemyMovement();
      }
    }, 1000);
  }
}

// Crear proyectil de espada
function createSwordProjectile() {
  const sword = document.createElement('div');
  sword.className = 'sword-projectile';
  sword.innerHTML = '⚔️';
  
  // Obtener la posición actual del jugador y enemigo
  const playerRect = playerCharacter.getBoundingClientRect();
  const enemyRect = enemyCharacter.getBoundingClientRect();
  
  sword.style.cssText = `
    position: absolute;
    font-size: 2.5rem;
    z-index: 15;
    left: ${playerRect.right}px;
    top: ${playerRect.top + playerRect.height/2}px;
    transform-origin: center center;
    animation: swordThrow 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `;
  
  document.body.appendChild(sword);
  
  // Efecto de impacto
  setTimeout(() => {
    const impact = document.createElement('div');
    impact.style.cssText = `
      position: absolute;
      font-size: 3rem;
      z-index: 16;
      left: ${enemyRect.left}px;
      top: ${enemyRect.top + enemyRect.height/2}px;
      animation: impactEffect 0.5s forwards;
    `;
    impact.innerHTML = '💥';
    document.body.appendChild(impact);
    
    setTimeout(() => impact.remove(), 500);
  }, 800);
  
  // Remover espada después de la animación
  setTimeout(() => {
    sword.remove();
  }, 1000);
}

// Resetear para la siguiente pregunta
function resetForNextQuestion() {
  // Resetear posición del enemigo
  enemyCharacter.style.right = '-200px';
  enemyCharacter.classList.remove('enemy-active');
  enemyProgressBar.style.width = '100%';
  timeLeft = 100;
  
  // Generar nueva pregunta y reiniciar movimiento
  setTimeout(() => {
    generateQuestion();
    startEnemyMovement();
  }, 500);
}

// Mostrar feedback con temática infantil
function showFeedback(title, message) {
  feedbackTitle.textContent = title;
  feedbackMessage.textContent = message;
  
  feedbackOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    font-family: 'Comic Sans MS', cursive, sans-serif;
  `;
  
  const feedbackContent = document.querySelector('.feedback-content');
  if (feedbackContent) {
    feedbackContent.style.cssText = `
      background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
      padding: 30px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      border: 3px solid #fff;
      animation: bounce 0.5s ease-in-out;
    `;
  }
  
  feedbackOverlay.classList.remove('hidden');
  
  setTimeout(() => {
    feedbackOverlay.classList.add('hidden');
  }, 1500);
}

// Siguiente pregunta
function nextQuestion() {
  if (lives <= 0 || gameWon) return;
  
  resetForNextQuestion();
}

// Actualizar puntuación
function updateScore() {
  scoreDisplay.textContent = score;
  if (score > highscore) {
    highscore = score;
    highscoreDisplay.textContent = highscore;
    localStorage.setItem('mathMagicHighscore', highscore);
  }
}

// Terminar el juego
function endGame(won) {
  clearInterval(moveInterval);
  gameWon = won;
  
  gameScreen.style.display = 'none';
  resultScreen.style.display = 'block';
  currentScreen = 'result';
  
  // Actualizar estadísticas finales
  finalScoreDisplay.textContent = score;
  finalHighscoreDisplay.textContent = highscore;
  correctAnswersDisplay.textContent = correctAnswers;
  totalQuestionsDisplay.textContent = totalQuestions;
  
  // Mostrar mensaje de victoria o derrota
  const resultTitle = document.querySelector('.result-screen h2');
  if (won) {
    resultTitle.textContent = '¡VICTORIA!';
    resultTitle.style.color = '#00ff00';
  } else {
    resultTitle.textContent = 'DERROTA';
    resultTitle.style.color = '#ff0000';
  }
}

// Reintentar juego
function retryGame() {
  resultScreen.style.display = 'none';
  startBattle();
}

// Resetear juego
function resetGame() {
  clearInterval(moveInterval);
  score = 0;
  lives = 3;
  correctAnswers = 0;
  totalQuestions = 0;
  questionsAnswered = 0;
  gameWon = false;
  timeLeft = 100;
  enemySpeed = 0.5;
  questionActive = false;
}

// Mezclar array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Mostrar alerta
function showAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  alertBox.textContent = message;
  alertBox.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.9);
    color: white;
    padding: 20px;
    border-radius: 10px;
    z-index: 1000;
    font-family: 'Press Start 2P', cursive;
    font-size: 1rem;
  `;
  document.body.appendChild(alertBox);
  
  setTimeout(() => {
    alertBox.remove();
  }, 2000);
}

// Mostrar pista
function showHint() {
  let hint = '';
  
  const questionText = questionDisplay.textContent;
  const parts = questionText.split(' ');
  const num1 = parseInt(parts[0]);
  const operator = parts[1];
  const num2 = parseInt(parts[2]);
  
  switch(operator) {
    case '+':
      hint = `Suma: ${num1} + ${num2} = ${num1 + num2}`;
      break;
    case '-':
      hint = `Resta: ${num1} - ${num2} = ${num1 - num2}`;
      break;
    case '×':
      hint = `Multiplicación: ${num1} × ${num2} = ${num1 * num2}`;
      break;
    case '÷':
      hint = `División: ${num1} ÷ ${num2} = ${num1 / num2}`;
      break;
  }
  
  showFeedback('PISTA', hint);
  
  // Penalizar por usar pista
  enemySpeed += 0.3;
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initGame);