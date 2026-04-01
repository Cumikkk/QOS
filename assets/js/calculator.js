function fmt(n, d = 6) {
  return parseFloat(n.toFixed(d)).toLocaleString("id-ID", {
    maximumFractionDigits: d,
  });
}

function showError(id, show) {
  document.getElementById(id).style.display = show ? "block" : "none";
}

function buildSteps(lines) {
  return lines
    .map((l, i) => {
      const isFinal = i === lines.length - 1;
      return `<div class="step-line ${isFinal ? "step-final" : ""}">
      <span class="step-op">${l.op}</span>
      <span class="step-val">${l.val}</span>
    </div>`;
    })
    .join("");
}

function renderTiphon(elId, kategori, indeks, satuan) {
  const ikonMap = { 4: "🟢", 3: "🔵", 2: "🟡", 1: "🟠", 0: "🔴" };
  const ikon = ikonMap[indeks] ?? "⚪";
  document.getElementById(elId).innerHTML = `
    <div class="tiphon-badge tiphon-lvl-${indeks}">
      <span class="tiphon-icon">${ikon}</span>
      <div class="tiphon-info">
        <div class="tiphon-label">Kategori TIPHON · ${satuan}</div>
        <div class="tiphon-kategori">${kategori}</div>
      </div>
      <span class="tiphon-indeks">Indeks ${indeks}</span>
    </div>`;
}

function tiphonThroughput(bps) {
  const kbps = bps / 1000;
  const mbps = bps / 1000000;
  if (mbps > 2.1) return { kategori: "Sangat Baik", indeks: 4 };
  if (kbps >= 1200) return { kategori: "Baik", indeks: 3 };
  if (kbps >= 700) return { kategori: "Cukup", indeks: 2 };
  if (kbps >= 338) return { kategori: "Kurang Baik", indeks: 1 };
  return { kategori: "Buruk", indeks: 0 };
}

function tiphonDelay(ms) {
  if (ms < 150) return { kategori: "Sangat Bagus", indeks: 4 };
  if (ms <= 300) return { kategori: "Bagus", indeks: 3 };
  if (ms <= 450) return { kategori: "Sedang", indeks: 2 };
  return { kategori: "Buruk", indeks: 1 };
}

function tiphonJitter(ms) {
  if (ms === 0) return { kategori: "Sangat Bagus", indeks: 4 };
  if (ms <= 75) return { kategori: "Bagus", indeks: 3 };
  if (ms <= 125) return { kategori: "Sedang", indeks: 2 };
  return { kategori: "Buruk", indeks: 1 };
}

function tiphonPacketLoss(pct) {
  if (pct <= 2) return { kategori: "Sangat Bagus", indeks: 4 };
  if (pct <= 14) return { kategori: "Bagus", indeks: 3 };
  if (pct <= 24) return { kategori: "Sedang", indeks: 2 };
  return { kategori: "Buruk", indeks: 1 };
}

function hitungThroughput() {
  const bytes = parseFloat(document.getElementById("tp-bytes").value);
  const time = parseFloat(document.getElementById("tp-time").value);
  if (!bytes || !time || bytes <= 0 || time <= 0) {
    showError("tp-err", true);
    document.getElementById("tp-result").classList.remove("show");
    return;
  }
  showError("tp-err", false);
  const bytesPerSec = bytes / time;
  const bitsPerSec = bytesPerSec * 8;
  const kbitsPerSec = bitsPerSec / 1000;
  document.getElementById("tp-steps").innerHTML = buildSteps([
    { op: "Throughput =", val: `${fmt(bytes, 0)} / ${fmt(time, 3)}` },
    { op: "=", val: `${fmt(bytesPerSec, 2)} Bytes/s` },
    { op: "=", val: `(${fmt(bytesPerSec, 2)} × 8) bits/s` },
    { op: "=", val: `${fmt(bitsPerSec, 1)} bits/s` },
    { op: "=", val: `(${fmt(bitsPerSec, 1)} / 1000) Kbits/s` },
    { op: "=", val: `${fmt(kbitsPerSec, 3)} Kbits/s` },
  ]);
  const t = tiphonThroughput(bitsPerSec);
  renderTiphon("tp-tiphon", t.kategori, t.indeks, "Throughput");
  document.getElementById("tp-result").classList.add("show");
}

function hitungDelay() {
  const total = parseFloat(document.getElementById("dl-total").value);
  const paket = parseFloat(document.getElementById("dl-paket").value);
  if (!total || !paket || total <= 0 || paket <= 0) {
    showError("dl-err", true);
    document.getElementById("dl-result").classList.remove("show");
    return;
  }
  showError("dl-err", false);
  const avgDetik = total / paket;
  const avgMs = avgDetik * 1000;
  document.getElementById("dl-steps").innerHTML = buildSteps([
    { op: "Delay =", val: `${fmt(total, 6)} / ${fmt(paket, 0)}` },
    { op: "=", val: `${fmt(avgDetik, 6)} detik` },
    { op: "=", val: `(${fmt(avgDetik, 6)} × 1000) ms` },
    { op: "=", val: `${fmt(avgMs, 3)} ms` },
  ]);
  const t = tiphonDelay(avgMs);
  renderTiphon("dl-tiphon", t.kategori, t.indeks, "Delay");
  document.getElementById("dl-result").classList.add("show");
}

function hitungJitter() {
  const total = parseFloat(document.getElementById("jt-total").value);
  const paket = parseFloat(document.getElementById("jt-paket").value);
  if (isNaN(total) || !paket || total < 0 || paket <= 1) {
    showError("jt-err", true);
    document.getElementById("jt-result").classList.remove("show");
    return;
  }
  showError("jt-err", false);
  const avgDetik = total / (paket - 1);
  const avgMs = avgDetik * 1000;
  document.getElementById("jt-steps").innerHTML = buildSteps([
    { op: "Jitter =", val: `${fmt(total, 6)} / (${fmt(paket, 0)} − 1)` },
    { op: "=", val: `${fmt(total, 6)} / ${fmt(paket - 1, 0)}` },
    { op: "=", val: `${fmt(avgDetik, 6)} detik` },
    { op: "=", val: `(${fmt(avgDetik, 6)} × 1000) ms` },
    { op: "=", val: `${fmt(avgMs, 3)} ms` },
  ]);
  const t = tiphonJitter(avgMs);
  renderTiphon("jt-tiphon", t.kategori, t.indeks, "Jitter");
  document.getElementById("jt-result").classList.add("show");
}

function hitungPacketLoss() {
  const terkirim = parseFloat(document.getElementById("pl-terkirim").value);
  const hilang = parseFloat(document.getElementById("pl-hilang").value);
  if (
    isNaN(terkirim) ||
    isNaN(hilang) ||
    terkirim <= 0 ||
    hilang < 0 ||
    hilang > terkirim
  ) {
    showError("pl-err", true);
    document.getElementById("pl-result").classList.remove("show");
    return;
  }
  showError("pl-err", false);

  const diterima = terkirim - hilang;
  const ratio = hilang / terkirim;
  const persen = ratio * 100;

  document.getElementById("pl-steps").innerHTML = buildSteps([
    {
      op: "Paket Diterima =",
      val: `${fmt(terkirim, 0)} − ${fmt(hilang, 0)} = ${fmt(diterima, 0)}`,
    },
    {
      op: "Packet Loss =",
      val: `(${fmt(hilang, 0)} / ${fmt(terkirim, 0)}) × 100`,
    },
    { op: "=", val: `${ratio.toFixed(9)} × 100` },
    { op: "=", val: `${fmt(persen, 3)} %` },
  ]);

  const t = tiphonPacketLoss(persen);
  renderTiphon("pl-tiphon", t.kategori, t.indeks, "Packet Loss");

  document.getElementById("pl-result").classList.add("show");
}
