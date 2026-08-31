const ui = document.getElementById("ui");
const flowerContainer = document.getElementById("flowerContainer");
const editableName = document.getElementById("editableName");
const editableSubtitle = document.getElementById("editableSubtitle");
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

// --- TEXT CONTENT ---
editableName.textContent = "FAITH GRACE";
editableSubtitle.textContent = "Study Well My Love.";

// --- 1. STARRY BACKGROUND CANVAS ---
const starCanvas = document.getElementById("starCanvas");
const ctx = starCanvas.getContext("2d");

let stars = [];
const numStars = 150;

function resizeCanvas() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * starCanvas.width,
      y: Math.random() * starCanvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

  for (let star of stars) {
    star.alpha += star.twinkleSpeed;
    if (star.alpha > 1 || star.alpha < 0) {
      star.twinkleSpeed = -star.twinkleSpeed;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
    ctx.fill();
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// --- 2. BUILD THE 3D HEART STRUCTURE ---
function getHeartPosition(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );
  return { x, y };
}

const layers = 12;
const pointsPerLayer = 24;
const depthSpacing = 12;

for (let layer = 0; layer < layers; layer++) {
  const depthFactor = (layer / (layers - 1)) * 2 - 1;
  const z = depthFactor * ((layers * depthSpacing) / 2);
  const scale = Math.cos(depthFactor * (Math.PI / 2.5));

  for (let i = 0; i < pointsPerLayer; i++) {
    const t = (i / pointsPerLayer) * Math.PI * 2;
    const pos = getHeartPosition(t);

    const x = pos.x * 13 * scale;
    const y = pos.y * 13 * scale;

    const span = document.createElement("span");
    span.className = "love_word";
    span.textContent = "i love you";

    span.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${t}rad) rotateX(15deg)`;
    ui.appendChild(span);
  }
}

// --- 3. FALLING FLOWERS LOGIC ---
const flowerIcons = ["🌸", "🌺", "🌷", "🌹", "🌼"];

function createFlower() {
  const flower = document.createElement("div");
  flower.className = "falling-flower";
  flower.textContent =
    flowerIcons[Math.floor(Math.random() * flowerIcons.length)];

  const fontSize = Math.random() * 1.5 + 1;
  const startX = Math.random() * window.innerWidth;
  const duration = Math.random() * 4 + 4;
  const delay = Math.random() * 2;

  flower.style.fontSize = `${fontSize}rem`;
  flower.style.left = `${startX}px`;
  flower.style.animationDuration = `${duration}s`;
  flower.style.animationDelay = `${delay}s`;

  flowerContainer.appendChild(flower);

  setTimeout(
    () => {
      flower.remove();
    },
    (duration + delay) * 1000,
  );
}

setInterval(createFlower, 200);

// --- 4. ROBUST AUDIO PLAYER & FALLBACK SEARCH ---
const audioSources = ["Blue.mp3", "blue.mp3", "Blue.m4a", "blue.m4a"];
let currentAudioIndex = 0;

function tryPlayAudio() {
  bgMusic
    .play()
    .then(() => {
      musicBtn.textContent = "⏸️ Pause Music";
    })
    .catch((err) => {
      if (currentAudioIndex < audioSources.length - 1) {
        currentAudioIndex++;
        bgMusic.src = audioSources[currentAudioIndex];
        bgMusic
          .play()
          .then(() => {
            musicBtn.textContent = "⏸️ Pause Music";
          })
          .catch((e) => console.log("Trying next audio format..."));
      } else {
        alert("Please ensure 'Blue.mp3' is placed in your project folder!");
      }
    });
}

musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    tryPlayAudio();
  } else {
    bgMusic.pause();
    musicBtn.textContent = "🎵 Play Music";
  }
});

// --- 5. CLICK-TO-BURST HEART PARTICLES ---
window.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") return;

  for (let i = 0; i < 8; i++) {
    const heart = document.createElement("div");
    heart.textContent = "💖";
    heart.style.position = "fixed";
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    heart.style.fontSize = `${Math.random() * 1.2 + 0.8}rem`;
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "100";
    heart.style.transition = "all 1s ease-out";

    document.body.appendChild(heart);

    setTimeout(() => {
      const offsetX = (Math.random() - 0.5) * 120;
      const offsetY = -Math.random() * 120 - 40;
      heart.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0)`;
      heart.style.opacity = "0";
    }, 20);

    setTimeout(() => heart.remove(), 1000);
  }
});

// --- 6. INTERACTIVE ROTATION & ANIMATION LOOP ---
let rotationX = 15;
let rotationY = 0;
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;
let autoRotateSpeed = 0.4;
let pulseTime = 0;

function startDrag(x, y) {
  isDragging = true;
  previousMouseX = x;
  previousMouseY = y;
}

function moveDrag(x, y) {
  if (!isDragging) return;
  const deltaX = x - previousMouseX;
  const deltaY = y - previousMouseY;

  rotationY += deltaX * 0.5;
  rotationX -= deltaY * 0.5;

  previousMouseX = x;
  previousMouseY = y;
}

function stopDrag() {
  isDragging = false;
}

window.addEventListener("mousedown", (e) => startDrag(e.clientX, e.clientY));
window.addEventListener("mousemove", (e) => moveDrag(e.clientX, e.clientY));
window.addEventListener("mouseup", stopDrag);

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1)
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
});
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1)
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
});
window.addEventListener("touchend", stopDrag);

function animate() {
  drawStars(); // Redraw twinkling stars canvas

  pulseTime += 0.04;
  const pulseScale = 1 + Math.sin(pulseTime * 2) * 0.05;

  if (!isDragging) {
    rotationY += autoRotateSpeed;
  }

  ui.style.transform = `translate(-50%, -50%) scale(${pulseScale}) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  requestAnimationFrame(animate);
}

animate();
