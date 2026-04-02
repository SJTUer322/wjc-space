const STORAGE_KEY = "wjc_space_logs";
const SPLASH_SEEN_KEY = "wjc_space_splash_seen";

function getNow() {
  return new Date().toLocaleString("zh-CN", {
    hour12: false
  });
}

function getLogs() {
  const logs = localStorage.getItem(STORAGE_KEY);
  return logs ? JSON.parse(logs) : [];
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function addLog(message) {
  const logs = getLogs();
  logs.unshift(`[${getNow()}] ${message}`);
  saveLogs(logs);
  renderLogs();
}

function renderLogs() {
  const logList = document.getElementById("logList");

  if (!logList) {
    return;
  }

  const logs = getLogs();
  logList.innerHTML = "";

  if (logs.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "当前暂无日志记录。";
    logList.appendChild(emptyItem);
    return;
  }

  logs.forEach((log) => {
    const li = document.createElement("li");
    li.textContent = log;
    logList.appendChild(li);
  });
}

function recordVisit() {
  addLog("访问主页：王久畅的空间");
}

function recordClick(targetName) {
  addLog(`点击跳转：${targetName}`);
}

function clearLogs() {
  localStorage.removeItem(STORAGE_KEY);
  renderLogs();
}

function initHeroMotion() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return;
  }

  requestAnimationFrame(() => {
    document.body.classList.add("motion-ready");
  });
}

function initSplashScreen() {
  const splashScreen = document.getElementById("splashScreen");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!splashScreen) {
    document.body.classList.add("content-ready");
    return Promise.resolve();
  }

  const hasSeenSplash = localStorage.getItem(SPLASH_SEEN_KEY) === "1";

  if (hasSeenSplash) {
    splashScreen.remove();
    document.body.classList.add("content-ready");
    return Promise.resolve();
  }

  localStorage.setItem(SPLASH_SEEN_KEY, "1");
  document.body.classList.add("splash-active");

  const splashDuration = prefersReducedMotion ? 620 : 1680;
  const exitDuration = prefersReducedMotion ? 240 : 760;

  return new Promise((resolve) => {
    window.setTimeout(() => {
      document.body.classList.add("splash-exit");

      window.setTimeout(() => {
        splashScreen.remove();
        document.body.classList.remove("splash-active");
        document.body.classList.add("content-ready");
        resolve();
      }, exitDuration);
    }, splashDuration);
  });
}

function initScrollReveal() {
  const revealTargets = document.querySelectorAll("[data-reveal]");

  if (!revealTargets.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((item) => {
      item.classList.add("revealed");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealTargets.forEach((item) => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  recordVisit();
  initSplashScreen().then(() => {
    initHeroMotion();
  });
  initScrollReveal();
});
