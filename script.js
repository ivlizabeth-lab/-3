document.addEventListener("DOMContentLoaded", () => {
  const users = {
    "адмін": { welcome: "адмін" },
    "сергій": { welcome: "сергій" },
    "марія": { welcome: "марія" },
    "саша": { welcome: "саша" }
  };

  // ===== LOGIN PAGE =====
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toastMsg");
    const toastClose = document.getElementById("toastClose");

    function showToast(message) {
      if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
          toast.classList.remove("show");
        }, 3000);
      } else {
        alert(message);
      }
    }

    if (toastClose) {
      toastClose.addEventListener("click", () => {
        toast.classList.remove("show");
      });
    }

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const loginInput = document.getElementById("login");
      const passwordInput = document.getElementById("password");

      if (!loginInput || !passwordInput) return;

      const login = loginInput.value.trim().toLowerCase();
      const password = passwordInput.value.trim();

      if (login === "" || password === "") {
        showToast("Заповніть усі поля!");
        return;
      }

      if (!users[login]) {
        showToast("Такого користувача немає!");
        return;
      }

      localStorage.setItem("currentUser", login);
      window.location.href = "success.html";
    });
  }

  // ===== SUCCESS PAGE =====
  const welcomeText = document.getElementById("welcomeText");

  if (welcomeText) {
    const key = localStorage.getItem("currentUser");

    if (!key) {
      welcomeText.textContent = "Вхід успішний!";
    } else {
      welcomeText.textContent = `Вхід успішний, ${key}!`;
    }

    startConfetti();

    setTimeout(() => {
      const wrap = document.querySelector(".welcome-wrap");
      const content = document.getElementById("content");

      if (wrap) {
        wrap.style.minHeight = "auto";
        wrap.style.paddingTop = "40px";
        wrap.style.paddingBottom = "20px";
      }

      if (content) {
        content.classList.remove("hidden");
      }
    }, 4000);
  }
});

// ===== CONFETTI =====
function startConfetti() {
  const canvas = document.getElementById("fireworks");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const pieces = [];
  const colors = [
    "#ff4d4d",
    "#ff9900",
    "#ffd700",
    "#66ff66",
    "#00ccff",
    "#3399ff",
    "#cc66ff",
    "#ff66b2"
  ];

  function createTriangleBurst() {
    const startX = canvas.width / 2;
    const startY = canvas.height + 20;

    for (let i = 0; i < 160; i++) {
      pieces.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 8,
        vy: -(Math.random() * 7 + 6),
        w: Math.random() * 4 + 3,
        h: Math.random() * 7 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 120,
        gravity: 0.12
      });
    }
  }

  createTriangleBurst();
  setTimeout(createTriangleBurst, 400);
  setTimeout(createTriangleBurst, 800);

  function drawPiece(piece) {
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.life--;

      drawPiece(p);

      if (p.life <= 0 || p.y > canvas.height + 30) {
        pieces.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

