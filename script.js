/* ==========================================================================
   MONTHSARY WEBSITE - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAnniversaryCounter();
  initEnvelope();
  initPolaroidLightbox();
  initReasonsJar();
  initAmbientCanvas();
  initClickHeartEffect();
  initMusicPlayer();
  initQrGenerator();
});

/* ==========================================================================
   1. Live Relationship Counter
   ========================================================================== */
function initAnniversaryCounter() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');
  const inputEl = document.getElementById('anniversaryInput');
  const saveBtn = document.getElementById('saveDateBtn');

  // Default date: 6 months before today if not stored
  const storedDate = localStorage.getItem('monthsary_anniversary_date');
  let anniversaryDate;

  if (storedDate) {
    anniversaryDate = new Date(storedDate);
  } else {
    // Default to exactly 6 months ago for preview demonstration
    anniversaryDate = new Date();
    anniversaryDate.setMonth(anniversaryDate.getMonth() - 6);
  }

  // Set the input field value (YYYY-MM-DDTHH:MM)
  const tzOffset = anniversaryDate.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(anniversaryDate.getTime() - tzOffset)).toISOString().slice(0, 16);
  if (inputEl) inputEl.value = localISOTime;

  function updateCounter() {
    const now = new Date();
    const diff = Math.max(0, now - anniversaryDate);

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCounter();
  setInterval(updateCounter, 1000);

  if (saveBtn && inputEl) {
    saveBtn.addEventListener('click', () => {
      const selected = new Date(inputEl.value);
      if (!isNaN(selected.getTime())) {
        anniversaryDate = selected;
        localStorage.setItem('monthsary_anniversary_date', selected.toISOString());
        updateCounter();
        burstSparklesAtElement(saveBtn);
      }
    });
  }
}

/* ==========================================================================
   2. Interactive Love Letter & Wax Seal Envelope
   ========================================================================== */
function initEnvelope() {
  const envelope = document.getElementById('loveEnvelope');
  const waxSeal = document.getElementById('waxSeal');
  const closeBtn = document.getElementById('closeLetterBtn');
  const letterDate = document.getElementById('letterCurrentDate');

  if (letterDate) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    letterDate.textContent = today.toLocaleDateString('en-US', options);
  }

  if (waxSeal && envelope) {
    waxSeal.addEventListener('click', () => {
      envelope.classList.add('open');
      burstSparklesAtElement(waxSeal);
    });
  }

  if (closeBtn && envelope) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      envelope.classList.remove('open');
    });
  }
}

/* ==========================================================================
   3. Polaroid Lightbox Modal
   ========================================================================== */
function initPolaroidLightbox() {
  const polaroids = document.querySelectorAll('.polaroid-card');
  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const dateEl = document.getElementById('lightboxDate');

  if (!modal) return;

  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.getAttribute('data-caption') || card.querySelector('.caption-text')?.textContent || '';
      const date = card.getAttribute('data-date') || card.querySelector('.caption-date')?.textContent || '';

      if (imgEl) imgEl.src = img.src;
      if (captionEl) captionEl.textContent = caption;
      if (dateEl) dateEl.textContent = date;

      modal.classList.add('active');
    });
  });

  const closeModal = () => modal.classList.remove('active');
  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
}

/* ==========================================================================
   4. "Reasons Why I Love You" Jar
   ========================================================================== */
const reasonsList = [
  "Because your smile can brighten even my most exhausting day.",
  "The gentle warmth and peace I feel whenever you hold my hand.",
  "How you listen to my stories, even when I ramble endlessly.",
  "Your beautiful laugh that instantly becomes my favorite sound.",
  "The way your eyes sparkle when you're genuinely excited.",
  "How supportive and caring you are whenever I face difficult days.",
  "The cozy feeling of being completely myself around you.",
  "Every sweet message you send that makes my heart skip a beat.",
  "Your kindness and big heart toward people and little things.",
  "The unforgettable memories we've made, and all the ones waiting for us.",
  "Because loving you is the easiest and most natural thing I've ever done.",
  "Simply because you are YOU — my favorite person in the whole universe."
];

function initReasonsJar() {
  const card = document.getElementById('reasonCard');
  const textEl = document.getElementById('reasonText');
  const counterEl = document.getElementById('reasonCounter');
  const btn = document.getElementById('nextReasonBtn');

  if (!btn || !textEl || !counterEl || !card) return;

  let currentIndex = 0;

  btn.addEventListener('click', () => {
    // Subtle bounce effect
    card.style.transform = 'scale(0.96)';
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % reasonsList.length;
      textEl.textContent = `"${reasonsList[currentIndex]}"`;
      counterEl.textContent = `Reason #${currentIndex + 1} of ${reasonsList.length}`;
      card.style.transform = 'scale(1)';
      burstSparklesAtElement(btn);
    }, 150);
  });
}

/* ==========================================================================
   5. Ambient Background Canvas (Falling Leaves, Hearts, Sparkles)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 28;
  const types = ['leaf', 'heart', 'sparkle'];

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Start spread out
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 14 + 10;
      this.speedY = Math.random() * 0.9 + 0.4;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
      this.type = types[Math.floor(Math.random() * types.length)];
      this.opacity = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
      this.rotation += this.rotSpeed;

      if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'leaf') {
        // Draw delicate sage leaf
        ctx.fillStyle = '#8ea891';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.45, this.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'heart') {
        // Draw soft heart
        ctx.fillStyle = '#d89d88';
        const s = this.size * 0.4;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.8, -s * 1.5, s * 0.4, 0, s * 1.4);
        ctx.bezierCurveTo(s * 1.5, s * 0.4, s, -s * 0.8, 0, s * 0.3);
        ctx.fill();
      } else {
        // Sparkle star
        ctx.fillStyle = '#c5a059';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   6. Click/Tap Anywhere Spawn Hearts
   ========================================================================== */
function initClickHeartEffect() {
  const container = document.getElementById('clickHeartsContainer');
  if (!container) return;

  const icons = ['💚', '🌿', '✨', '🌸', '🤍'];

  window.addEventListener('click', (e) => {
    // Avoid spawning when clicking form inputs or links
    const targetTag = e.target.tagName.toLowerCase();
    if (targetTag === 'input' || targetTag === 'button') return;

    const heart = document.createElement('div');
    heart.className = 'floating-click-heart';
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;

    // Random drift and tilt
    const dx = (Math.random() - 0.5) * 60;
    const rot = (Math.random() - 0.5) * 40;
    heart.style.setProperty('--dx', `${dx}px`);
    heart.style.setProperty('--rot', `${rot}deg`);

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);
  });
}

function burstSparklesAtElement(el) {
  const container = document.getElementById('clickHeartsContainer');
  if (!container || !el) return;
  const rect = el.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const icons = ['💚', '✨', '🌿', '🌸'];
  for (let i = 0; i < 6; i++) {
    const star = document.createElement('div');
    star.className = 'floating-click-heart';
    star.textContent = icons[Math.floor(Math.random() * icons.length)];
    star.style.left = `${centerX}px`;
    star.style.top = `${centerY}px`;

    const dx = (Math.random() - 0.5) * 120;
    const rot = (Math.random() - 0.5) * 50;
    star.style.setProperty('--dx', `${dx}px`);
    star.style.setProperty('--rot', `${rot}deg`);

    container.appendChild(star);
    setTimeout(() => star.remove(), 1200);
  }
}

/* ==========================================================================
   7. Romantic Audio Synth & Music Player
   ========================================================================== */
function initMusicPlayer() {
  const mainPlayBtn = document.getElementById('mainPlayBtn');
  const navMusicBtn = document.getElementById('musicToggleBtn');
  const vinylDisc = document.getElementById('vinylDisc');
  const progressFill = document.getElementById('progressFill');
  const currentTimeLabel = document.getElementById('currentTimeLabel');
  const audioEl = document.getElementById('bgMusic');

  let isPlaying = false;
  let audioCtx = null;
  let synthInterval = null;
  let melodyTime = 0;

  // Gentle romantic music box / piano melody notes (Hz)
  // Chord sequence: C - G - Am - Em - F - C - F - G (Pachelbel/Romantic progression)
  const notesSequence = [
    261.63, 329.63, 392.00, 523.25, // C chord
    196.00, 246.94, 293.66, 392.00, // G chord
    220.00, 261.63, 329.63, 440.00, // Am chord
    164.81, 196.00, 246.94, 329.63, // Em chord
    174.61, 220.00, 261.63, 349.23, // F chord
    261.63, 329.63, 392.00, 523.25, // C chord
    174.61, 220.00, 261.63, 349.23, // F chord
    196.00, 293.66, 392.00, 493.88  // G chord
  ];

  function playTone(freq) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.3);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  function startMelody() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    let noteIdx = 0;
    synthInterval = setInterval(() => {
      playTone(notesSequence[noteIdx]);
      noteIdx = (noteIdx + 1) % notesSequence.length;
      melodyTime += 0.45;

      const totalDuration = 165; // 2:45
      const percent = ((melodyTime % totalDuration) / totalDuration) * 100;
      if (progressFill) progressFill.style.width = `${percent}%`;

      const m = Math.floor(melodyTime / 60);
      const s = Math.floor(melodyTime % 60);
      if (currentTimeLabel) {
        currentTimeLabel.textContent = `${m}:${String(s).padStart(2, '0')}`;
      }
    }, 450);
  }

  function stopMelody() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function togglePlay() {
    // If user provided a real audio source file
    if (audioEl && audioEl.querySelector('source')?.getAttribute('src')) {
      if (audioEl.paused) {
        audioEl.play().catch(() => {});
        isPlaying = true;
      } else {
        audioEl.pause();
        isPlaying = false;
      }
    } else {
      // Use built-in soothing ambient synth melody!
      isPlaying = !isPlaying;
      if (isPlaying) {
        startMelody();
      } else {
        stopMelody();
      }
    }

    updatePlayUI(isPlaying);
  }

  function updatePlayUI(playing) {
    if (mainPlayBtn) mainPlayBtn.textContent = playing ? '⏸️' : '▶️';
    if (navMusicBtn) {
      const label = navMusicBtn.querySelector('.btn-label');
      if (label) label.textContent = playing ? 'Pause Music' : 'Play Music';
    }
    if (vinylDisc) {
      if (playing) vinylDisc.classList.add('playing');
      else vinylDisc.classList.remove('playing');
    }
  }

  if (mainPlayBtn) mainPlayBtn.addEventListener('click', togglePlay);
  if (navMusicBtn) navMusicBtn.addEventListener('click', togglePlay);
}

/* ==========================================================================
   8. Heart QR Code Generator & Printable Card Modal
   ========================================================================== */
function initQrGenerator() {
  const modal = document.getElementById('qrModal');
  const backdrop = document.getElementById('qrModalBackdrop');
  const closeBtn = document.getElementById('qrCloseBtn');
  const openBtn = document.getElementById('openQrModalBtn');
  const footerBtn = document.getElementById('footerQrBtn');
  const canvas = document.getElementById('qrCanvas');
  const urlInput = document.getElementById('qrUrlInput');
  const updateBtn = document.getElementById('updateQrBtn');
  const downloadBtn = document.getElementById('downloadQrBtn');
  const printBtn = document.getElementById('printCardBtn');
  const targetDisplay = document.getElementById('qrTargetDisplay');

  if (!modal || !canvas) return;

  function renderHeartQr(text) {
    if (targetDisplay) targetDisplay.textContent = text;

    // Use QRCode library if loaded
    if (window.QRCode && QRCode.toCanvas) {
      QRCode.toCanvas(canvas, text, {
        width: 240,
        margin: 2,
        color: {
          dark: '#3e5643', // Elegant sage green modules
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H' // High ECC allows center heart badge overlay!
      }, (error) => {
        if (error) console.error(error);
        drawCenterHeart(canvas);
      });
    } else {
      // Fallback elegant canvas rendering if offline
      drawFallbackQr(canvas, text);
    }
  }

  function drawCenterHeart(c) {
    const ctx = c.getContext('2d');
    const cx = c.width / 2;
    const cy = c.height / 2;
    const size = 38;

    // White circle backdrop to clear modules cleanly
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, size / 1.7, 0, Math.PI * 2);
    ctx.fill();

    // Sage green border ring
    ctx.strokeStyle = '#527359';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Heart glyph
    ctx.fillStyle = '#527359';
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💚', cx, cy + 1);
    ctx.restore();
  }

  function drawFallbackQr(c, text) {
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);

    // Draw stylized matrix pattern
    ctx.fillStyle = '#3e5643';
    const grid = 21;
    const step = c.width / grid;

    for (let r = 0; r < grid; r++) {
      for (let col = 0; col < grid; col++) {
        // Leave center empty for heart
        if (Math.abs(r - 10) <= 2 && Math.abs(col - 10) <= 2) continue;
        
        // Corner eye markers
        const isCorner = (r < 7 && col < 7) || (r < 7 && col > 13) || (r > 13 && col < 7);
        if (isCorner) {
          ctx.fillRect(col * step + 2, r * step + 2, step - 4, step - 4);
        } else if ((r + col) % 2 === 0 || (r * col) % 3 === 0) {
          ctx.beginPath();
          ctx.arc(col * step + step / 2, r * step + step / 2, (step - 4) / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    drawCenterHeart(c);
  }

  // Initial generation
  const defaultUrl = window.location.href.startsWith('http') 
    ? window.location.href 
    : 'https://our-monthsary-love.vercel.app';
  if (urlInput) urlInput.value = defaultUrl;
  renderHeartQr(urlInput ? urlInput.value : defaultUrl);

  // Event Listeners
  if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('active'));
  if (footerBtn) footerBtn.addEventListener('click', () => modal.classList.add('active'));
  
  const closeModal = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (updateBtn && urlInput) {
    updateBtn.addEventListener('click', () => {
      renderHeartQr(urlInput.value.trim() || 'https://love.com');
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'monthsary-heart-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}
