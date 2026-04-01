const STORAGE_KEY = "wjc_space_logs";

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

window.onload = function () {
  recordVisit();
};
