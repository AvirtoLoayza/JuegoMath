// Modal Multimedia Universal - Integrado con la UI del sitio
(function() {
	// Crear overlay y modal al vuelo
	function createModal() {
		const overlay = document.createElement('div');
		overlay.className = 'multimedia-overlay';

		const modal = document.createElement('div');
		modal.className = 'multimedia-modal';
		modal.innerHTML = `
			<div class="modal-header">
				<h3 class="modal-title">Reproductor Multimedia</h3>
				<button class="modal-close" aria-label="Cerrar">✕</button>
			</div>
			<div class="modal-body">
				<div class="multimedia-tabs">
					<button class="multimedia-tab active" data-tab="video">Video</button>
					<button class="multimedia-tab" data-tab="audio">Audio</button>
					<button class="multimedia-tab" data-tab="radio">Radio</button>
				</div>

				<!-- Sección Video -->
				<section class="multimedia-section active" id="mm-video">
					<div class="video-wrapper">
						<video id="mm-video-player" controls>
							<source src="#" type="video/mp4">
							Tu navegador no soporta video.
						</video>
					</div>
					<div class="media-grid" id="mm-video-grid">
						<button class="media-card active" data-video="videos/parte final.mp4" data-title="Parte Final">Parte Final</button>
					</div>
				</section>

				<!-- Sección Audio -->
				<section class="multimedia-section" id="mm-audio">
					<div class="audio-panel">
						<h4 class="audio-title">Canción seleccionada</h4>
						<p class="audio-artist">Artista</p>
						<div class="progress-bar"><div class="progress-fill" id="mm-audio-progress"></div></div>
						<div class="time-row"><span id="mm-audio-current">0:00</span><span id="mm-audio-total">0:00</span></div>
						<div class="controls-row">
							<button class="round-btn" id="mm-audio-prev">⏮</button>
							<button class="round-btn" id="mm-audio-play">▶</button>
							<button class="round-btn" id="mm-audio-next">⏭</button>
						</div>
						<div class="volume-row"><span>🔊</span><input type="range" id="mm-audio-vol" min="0" max="1" step="0.1" value="0.7"></div>
					</div>
					<div class="media-grid" id="mm-audio-grid">
						<button class="media-card active" data-audio="audio/A Dónde Fue.mp3" data-title="A Dónde Fue" data-artist="Artista Local">A Dónde Fue</button>
					</div>
				</section>

				<!-- Sección Radio -->
				<section class="multimedia-section" id="mm-radio">
					<div class="audio-panel">
						<h4 class="station-name">Selecciona una emisora</h4>
						<p class="station-genre">Género</p>
						<div class="controls-row">
							<button class="round-btn" id="mm-radio-play">▶</button>
							<button class="round-btn" id="mm-radio-stop">⏹</button>
						</div>
						<div class="volume-row"><span>🔊</span><input type="range" id="mm-radio-vol" min="0" max="1" step="0.1" value="0.7"></div>
						<div class="audio-panel" style="margin-top:10px;">
							<div style="color:#FFD700; font-weight:bold;">Reproduciendo:</div>
							<div id="mm-radio-track" style="color:#E0E0E0;">-</div>
						</div>
					</div>
					<div class="radio-grid" id="mm-radio-grid">
						<button class="radio-card active" data-station="https://stream.zeno.fm/0r0xa792kwzuv" data-name="Radio Clásica" data-genre="Clásica" data-track="Sinfonía No. 5 - Beethoven">
							<div class="station-logo">🎵</div>
							<div class="station-name">Radio Clásica</div>
							<div class="station-freq">102.5 FM</div>
						</button>
						<button class="radio-card" data-station="https://stream.zeno.fm/f3wvbbqmdg8uv" data-name="Jazz FM" data-genre="Jazz" data-track="Take Five - Dave Brubeck">
							<div class="station-logo">🎷</div>
							<div class="station-name">Jazz FM</div>
							<div class="station-freq">98.7 FM</div>
						</button>
						<button class="radio-card" data-station="https://stream.zeno.fm/0r0xa792kwzuv" data-name="Rock Nacional" data-genre="Rock" data-track="Nothing Else Matters - Metallica">
							<div class="station-logo">🎸</div>
							<div class="station-name">Rock Nacional</div>
							<div class="station-freq">106.3 FM</div>
						</button>
						<button class="radio-card" data-station="https://stream.zeno.fm/f3wvbbqmdg8uv" data-name="Pop Internacional" data-genre="Pop" data-track="Blinding Lights - The Weeknd">
							<div class="station-logo">🎤</div>
							<div class="station-name">Pop Internacional</div>
							<div class="station-freq">94.5 FM</div>
						</button>
					</div>
				</section>
			</div>
		`;

		overlay.appendChild(modal);
		document.body.appendChild(overlay);
		return overlay;
	}

	function formatTime(seconds) {
		if (!isFinite(seconds)) return '0:00';
		const min = Math.floor(seconds / 60);
		const sec = Math.floor(seconds % 60);
		return `${min}:${sec < 10 ? '0' : ''}${sec}`;
	}

	function attachLogic(overlay) {
		const modal = overlay.querySelector('.multimedia-modal');
		const closeBtn = modal.querySelector('.modal-close');
		const tabs = modal.querySelectorAll('.multimedia-tab');
		const sections = modal.querySelectorAll('.multimedia-section');

		// Cerrar
		closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) overlay.classList.remove('active');
		});

		// Tabs
		tabs.forEach(tab => {
			tab.addEventListener('click', () => {
				const id = tab.getAttribute('data-tab');
				tabs.forEach(t => t.classList.remove('active'));
				sections.forEach(s => s.classList.remove('active'));
				tab.classList.add('active');
				modal.querySelector(`#mm-${id}`).classList.add('active');
				// Pausar otros
				video.pause();
				audio.pause();
				radio.pause();
			});
		});

		// Video
		const video = modal.querySelector('#mm-video-player');
		const videoCards = modal.querySelectorAll('#mm-video-grid .media-card');
		const activeVideoCard = modal.querySelector('#mm-video-grid .media-card.active');
		video.src = activeVideoCard.getAttribute('data-video');
		video.load();
		
		videoCards.forEach(card => {
			card.addEventListener('click', () => {
				videoCards.forEach(c => c.classList.remove('active'));
				card.classList.add('active');
				const videoSrc = card.getAttribute('data-video');
				const videoTitle = card.getAttribute('data-title') || card.textContent.trim();
				video.src = videoSrc;
				video.load();
				video.play().catch(e => console.log('Error reproduciendo video:', e));
			});
		});

		// Audio
		const audio = new Audio();
		const audioCards = modal.querySelectorAll('#mm-audio-grid .media-card');
		const audioTitle = modal.querySelector('.audio-title');
		const audioArtist = modal.querySelector('.audio-artist');
		const audioPlay = modal.querySelector('#mm-audio-play');
		const audioPrev = modal.querySelector('#mm-audio-prev');
		const audioNext = modal.querySelector('#mm-audio-next');
		const audioProgress = modal.querySelector('#mm-audio-progress');
		const audioCurr = modal.querySelector('#mm-audio-current');
		const audioTotal = modal.querySelector('#mm-audio-total');
		const audioVol = modal.querySelector('#mm-audio-vol');
		let audioIndex = 0;
		let audioPlaying = false;

		function loadAudio(i) {
			const card = audioCards[i];
			audioCards.forEach(c => c.classList.remove('active'));
			card.classList.add('active');
			audio.src = card.getAttribute('data-audio');
			audioTitle.textContent = card.getAttribute('data-title');
			audioArtist.textContent = card.getAttribute('data-artist');
			audio.load();
			if (audioPlaying) {
				audio.play().catch(e => console.log('Error reproduciendo audio:', e));
			}
		}
		loadAudio(audioIndex);

		audioPlay.addEventListener('click', () => {
			if (audioPlaying) { audio.pause(); audioPlay.textContent = '▶'; }
			else { audio.play(); audioPlay.textContent = '⏸'; }
			audioPlaying = !audioPlaying;
		});
		audioPrev.addEventListener('click', () => { 
			audioIndex = (audioIndex - 1 + audioCards.length) % audioCards.length; 
			loadAudio(audioIndex); 
			if (audioPlaying) {
				audio.play().catch(e => console.log('Error reproduciendo audio:', e));
			}
		});
		audioNext.addEventListener('click', () => { 
			audioIndex = (audioIndex + 1) % audioCards.length; 
			loadAudio(audioIndex); 
			if (audioPlaying) {
				audio.play().catch(e => console.log('Error reproduciendo audio:', e));
			}
		});
		audio.addEventListener('timeupdate', () => {
			const p = (audio.currentTime / audio.duration) * 100;
			audioProgress.style.width = `${p}%`;
			audioCurr.textContent = formatTime(audio.currentTime);
			audioTotal.textContent = formatTime(audio.duration);
		});
		audio.addEventListener('ended', () => { 
			audioIndex = (audioIndex + 1) % audioCards.length; 
			loadAudio(audioIndex); 
			audio.play().catch(e => console.log('Error reproduciendo audio:', e));
		});
		audioVol.addEventListener('input', () => { audio.volume = audioVol.value; });

		// Radio
		const radio = new Audio();
		const radioCards = modal.querySelectorAll('#mm-radio-grid .radio-card');
		const stationName = modal.querySelector('#mm-radio .station-name');
		const stationGenre = modal.querySelector('#mm-radio .station-genre');
		const radioPlay = modal.querySelector('#mm-radio-play');
		const radioStop = modal.querySelector('#mm-radio-stop');
		const radioVol = modal.querySelector('#mm-radio-vol');
		const radioTrack = modal.querySelector('#mm-radio-track');
		let radioPlaying = false;

		function loadStation(card) {
			radioCards.forEach(c => c.classList.remove('active'));
			card.classList.add('active');
			radio.src = card.getAttribute('data-station');
			stationName.textContent = card.getAttribute('data-name');
			stationGenre.textContent = card.getAttribute('data-genre');
			radioTrack.textContent = card.getAttribute('data-track');
			radio.load();
			if (radioPlaying) {
				radio.play().catch(e => console.log('Error reproduciendo radio:', e));
			}
		}
		loadStation(modal.querySelector('#mm-radio-grid .radio-card.active'));

		radioCards.forEach(card => card.addEventListener('click', () => { 
			loadStation(card); 
			if (radioPlaying) {
				radio.play().catch(e => console.log('Error reproduciendo radio:', e));
			}
		}));
		radioPlay.addEventListener('click', () => { 
			if (radioPlaying) { 
				radio.pause(); 
				radioPlay.textContent = '▶'; 
			} else { 
				radio.play().catch(e => console.log('Error reproduciendo radio:', e)); 
				radioPlay.textContent = '⏸'; 
			} 
			radioPlaying = !radioPlaying; 
		});
		radioStop.addEventListener('click', () => { radio.pause(); radio.currentTime = 0; radioPlay.textContent = '▶'; radioPlaying = false; });
		radioVol.addEventListener('input', () => { radio.volume = radioVol.value; });

		// Simular cambio de canción en radio
		setInterval(() => {
			if (radioPlaying) {
				const active = modal.querySelector('#mm-radio-grid .radio-card.active');
				const tracks = [ active.getAttribute('data-track'), 'Canción Aleatoria 1', 'Canción Aleatoria 2', 'Éxito de la Semana' ];
				radioTrack.textContent = tracks[Math.floor(Math.random() * tracks.length)];
			}
		}, 15000);
	}

	// Hook en navbar "Multimedia"
	document.addEventListener('DOMContentLoaded', () => {
		const navMultimedia = document.querySelector('.main-nav .multimedia-dropdown') || document.querySelector('.main-nav a[href="#"][data-nav-target="multimedia"]');
		if (!navMultimedia) return;
		const overlay = createModal();
		attachLogic(overlay);
		navMultimedia.addEventListener('click', (e) => {
			e.preventDefault();
			overlay.classList.add('active');
		});
	});
})();
