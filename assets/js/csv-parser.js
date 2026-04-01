function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) throw new Error("CSV terlalu pendek");

  const header = lines[0]
    .split(",")
    .map((h) => h.replace(/"/g, "").trim().toLowerCase());
  const timeIdx = header.findIndex((h) => h === "time");

  if (timeIdx === -1) throw new Error('Kolom "Time" tidak ditemukan di CSV');

  const times = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    const t = parseFloat(cols[timeIdx]);
    if (!isNaN(t)) {
      times.push(t);
    }
  }

  if (times.length < 2) throw new Error("Data tidak cukup (minimal 2 paket)");

  const deltaTime = [];
  for (let i = 1; i < times.length; i++) {
    deltaTime.push(times[i] - times[i - 1]);
  }

  const totalDelay = deltaTime.reduce((a, b) => a + b, 0);
  const jumlahPaket = times.length;

  const deltaJitter = [];
  for (let i = 1; i < deltaTime.length; i++) {
    deltaJitter.push(Math.abs(deltaTime[i] - deltaTime[i - 1]));
  }
  const totalJitter = deltaJitter.reduce((a, b) => a + b, 0);

  return { totalDelay, jumlahPaket, totalJitter };
}

function splitCSVLine(line) {
  const result = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuote = !inQuote;
    } else if (ch === "," && !inQuote) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function applyCSVResult(result) {
  const { totalDelay, jumlahPaket, totalJitter } = result;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = val;
      el.classList.add("autofilled");
    }
  };

  setVal("dl-total", totalDelay.toFixed(6));
  setVal("dl-paket", jumlahPaket);
  setVal("jt-total", totalJitter.toFixed(6));
  setVal("jt-paket", jumlahPaket);

  document.getElementById("dl-autofill").classList.add("show");
  document.getElementById("jt-autofill").classList.add("show");

  hitungDelay();
  hitungJitter();
}

function initCSV() {
  const dropArea = document.getElementById("csv-drop");
  const fileInput = document.getElementById("csv-file");
  const status = document.getElementById("csv-status");

  function showStatus(type, msg) {
    status.className = `csv-status show ${type}`;
    status.innerHTML = msg;
  }

  function processFile(file) {
    if (!file || !file.name.endsWith(".csv")) {
      showStatus("error", "❌ File harus berformat .csv");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = parseCSV(e.target.result);
        applyCSVResult(result);
        showStatus(
          "success",
          `✅ Berhasil membaca <strong>${result.jumlahPaket}</strong> paket — Delay & Jitter telah dihitung otomatis`,
        );
      } catch (err) {
        showStatus("error", `❌ ${err.message}`);
      }
    };
    reader.readAsText(file);
  }

  dropArea.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    processFile(e.target.files[0]);
    fileInput.value = "";
  });

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("drag-over");
  });

  dropArea.addEventListener("dragleave", () =>
    dropArea.classList.remove("drag-over"),
  );

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("drag-over");
    processFile(e.dataTransfer.files[0]);
  });
}
