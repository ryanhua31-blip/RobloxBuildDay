const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const quizButtons = document.querySelectorAll(".quiz-options button");
const quizQuestion = document.querySelector("#quizQuestion");
const quizProgress = document.querySelector("#quizProgress");
const quizResult = document.querySelector("#quizResult");
const ideaButton = document.querySelector("#ideaButton");
const ideaOutput = document.querySelector("#ideaOutput");
const signupForm = document.querySelector("#signupForm");
const formMessage = document.querySelector("#formMessage");
const canvas = document.querySelector("#buildCanvas");
const context = canvas ? canvas.getContext("2d") : null;

const ideas = [
  "A sky-island obby where players unlock cloud bridges with Lua-powered buttons.",
  "A pizza tycoon where every delivery upgrades your kitchen and earns more coins.",
  "A mystery school map where players solve scripted door puzzles before the timer ends.",
  "A pet simulator where pets collect crystals and level up with each quest.",
  "A racing game where speed pads, checkpoints, and leaderboards are powered by scripts.",
  "A boss battle arena where each round teaches a new movement or weapon mechanic."
];

const luaQuestions = [
  {
    question: "Which word creates a variable in Lua?",
    options: ["make", "local", "spawn"],
    answer: "local",
    success: "Correct. Lua uses local to create a variable.",
    hint: "Not quite. Try local."
  },
  {
    question: "Which symbol means add in Lua?",
    options: ["+", "=", ":"],
    answer: "+",
    success: "Correct. The + symbol adds numbers together.",
    hint: "Not quite. Look for the symbol that adds numbers."
  },
  {
    question: "Which command prints a message in the Output window?",
    options: ["say()", "print()", "show()"],
    answer: "print()",
    success: "Correct. print() sends a message to Output.",
    hint: "Not quite. Lua uses print() for Output messages."
  }
];

let currentQuizIndex = 0;

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function renderQuizQuestion() {
  if (!quizQuestion || !quizProgress || quizButtons.length === 0) {
    return;
  }

  const quiz = luaQuestions[currentQuizIndex];
  quizQuestion.textContent = quiz.question;
  quizProgress.textContent = `${currentQuizIndex + 1}/${luaQuestions.length}`;

  quizButtons.forEach((button, index) => {
    button.textContent = quiz.options[index];
    button.disabled = false;
    button.classList.remove("correct", "wrong");
  });

  if (quizResult) {
    quizResult.textContent = "";
    quizResult.classList.remove("success");
  }
}

function finishQuiz() {
  if (!quizQuestion || !quizProgress || !quizResult) {
    return;
  }

  quizQuestion.textContent = "You finished the Lua check.";
  quizProgress.textContent = "3/3";
  quizResult.classList.add("success");
  quizResult.textContent = "Nice work. You are ready to start scripting in Roblox Studio.";

  quizButtons.forEach((button) => {
    button.disabled = true;
    button.classList.remove("correct", "wrong");
  });
}

if (quizButtons.length > 0) {
  renderQuizQuestion();

  quizButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const quiz = luaQuestions[currentQuizIndex];
      const selectedAnswer = button.textContent;

      quizButtons.forEach((option) => {
        option.classList.remove("correct", "wrong");
      });

      if (selectedAnswer === quiz.answer && quizResult) {
        button.classList.add("correct");
        quizResult.textContent = quiz.success;
        quizButtons.forEach((option) => {
          option.disabled = true;
        });

        setTimeout(() => {
          currentQuizIndex += 1;

          if (currentQuizIndex >= luaQuestions.length) {
            finishQuiz();
          } else {
            renderQuizQuestion();
          }
        }, 900);
      } else if (quizResult) {
        button.classList.add("wrong");
        quizResult.textContent = quiz.hint;
      }
    });
  });
}

if (ideaButton && ideaOutput) {
  ideaButton.addEventListener("click", () => {
    const currentIdea = ideaOutput.textContent;
    let nextIdea = ideas[Math.floor(Math.random() * ideas.length)];

    while (nextIdea === currentIdea) {
      nextIdea = ideas[Math.floor(Math.random() * ideas.length)];
    }

    ideaOutput.textContent = nextIdea;
  });
}

if (signupForm && formMessage) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const builderName = document.querySelector("#builderName").value.trim();
    const skillLevel = document.querySelector("#skillLevel").value;
    const gameIdea = document.querySelector("#gameIdea").value.trim();

    if (!builderName || !skillLevel || !gameIdea) {
      formMessage.classList.remove("success");
      formMessage.textContent = "Fill in each box to join Build Day.";
      return;
    }

    formMessage.classList.add("success");
    formMessage.textContent = `${builderName}, your Build Day spot is saved. Start sketching that game.`;
    signupForm.reset();
  });
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = rect.width * pixelRatio;
  canvas.height = rect.height * pixelRatio;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function drawBlock(x, y, width, height, color, topColor) {
  context.fillStyle = topColor;
  context.beginPath();
  context.moveTo(x + 28, y);
  context.lineTo(x + width, y + 18);
  context.lineTo(x + width - 28, y + height);
  context.lineTo(x, y + height - 18);
  context.closePath();
  context.fill();

  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x, y + height - 18);
  context.lineTo(x + width - 28, y + height);
  context.lineTo(x + width - 28, y + height + 40);
  context.lineTo(x, y + height + 22);
  context.closePath();
  context.fill();

  context.fillStyle = "rgba(0, 0, 0, 0.18)";
  context.beginPath();
  context.moveTo(x + width - 28, y + height);
  context.lineTo(x + width, y + 18);
  context.lineTo(x + width, y + 58);
  context.lineTo(x + width - 28, y + height + 40);
  context.closePath();
  context.fill();
}

function drawCharacter(x, y, bounce) {
  context.save();
  context.translate(x, y + bounce);

  context.fillStyle = "#ffd35a";
  context.fillRect(-22, -82, 44, 44);
  context.fillStyle = "#1f2437";
  context.fillRect(-12, -66, 7, 7);
  context.fillRect(8, -66, 7, 7);
  context.fillRect(-8, -50, 18, 5);

  context.fillStyle = "#46b9ff";
  context.fillRect(-28, -36, 56, 50);
  context.fillStyle = "#ffffff";
  context.fillRect(-14, -20, 28, 9);

  context.fillStyle = "#e52828";
  context.fillRect(-52, -32, 24, 42);
  context.fillRect(28, -32, 24, 42);

  context.fillStyle = "#2f3448";
  context.fillRect(-25, 14, 20, 45);
  context.fillRect(5, 14, 20, 45);
  context.restore();
}

function drawScene(time) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const pulse = Math.sin(time / 420);

  context.clearRect(0, 0, width, height);

  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#2e3555");
  sky.addColorStop(0.55, "#202438");
  sky.addColorStop(1, "#161a29");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(255, 255, 255, 0.08)";
  for (let i = 0; i < 28; i += 1) {
    const x = (i * 91 + time / 45) % (width + 80) - 40;
    const y = 48 + ((i * 37) % Math.max(180, height * 0.62));
    context.fillRect(x, y, 3, 3);
  }

  const centerX = width * 0.52;
  const baseY = height * 0.56;

  drawBlock(centerX - 210, baseY + 52, 360, 100, "#23986e", "#35d6a5");
  drawBlock(centerX - 86, baseY - 44, 175, 92, "#b9141d", "#e52828");
  drawBlock(centerX + 42, baseY - 12, 150, 78, "#a78218", "#ffd35a");
  drawBlock(centerX - 250, baseY - 6, 130, 78, "#287ab1", "#46b9ff");

  context.save();
  context.translate(centerX + 196, baseY + 8 + pulse * 8);
  context.rotate(0.2);
  context.fillStyle = "#ffffff";
  context.fillRect(-23, -23, 46, 46);
  context.clearRect(-7, -7, 14, 14);
  context.restore();

  drawCharacter(centerX - 40, baseY + 62, pulse * 7);

  context.fillStyle = "rgba(255, 255, 255, 0.9)";
  context.font = '800 18px Optima, Candara, "Avenir Next", sans-serif';
  context.fillText("Roblox Studio", Math.max(18, width * 0.08), height - 34);
}

function animateScene(time) {
  drawScene(time);
  requestAnimationFrame(animateScene);
}

if (canvas && context) {
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  requestAnimationFrame(animateScene);
}
