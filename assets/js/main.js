document.addEventListener("DOMContentLoaded", () => {
  initCSV();

  const tiphonToggle = document.getElementById("tiphon-toggle");
  const resultAreas = document.querySelectorAll(".result-area");

  function applyTiphonToggle() {
    resultAreas.forEach((area) => {
      area.classList.toggle("tiphon-hidden", !tiphonToggle.checked);
    });
  }

  tiphonToggle.addEventListener("change", applyTiphonToggle);
  applyTiphonToggle();

  const isTouch = () => window.matchMedia("(hover: none)").matches;
  const allPopovers = document.querySelectorAll(".info-popover");
  const allBtns = document.querySelectorAll(".info-btn");

  function positionPopover(btn, popover) {
    const rect = btn.getBoundingClientRect();
    const popWidth = 280;
    const popHeight = popover.offsetHeight;
    const gap = 10;
    const margin = 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    let top, left;
    if (spaceBelow >= popHeight + gap || spaceBelow >= spaceAbove) {
      top = rect.bottom + gap + window.scrollY;
      popover.classList.remove("arrow-bottom");
      popover.classList.add("arrow-top");
    } else {
      top = rect.top - popHeight - gap + window.scrollY;
      popover.classList.remove("arrow-top");
      popover.classList.add("arrow-bottom");
    }
    left = rect.right - popWidth + window.scrollX;
    if (left < margin) left = margin;
    if (left + popWidth > window.innerWidth - margin)
      left = window.innerWidth - popWidth - margin;
    popover.style.top = top + "px";
    popover.style.left = left + "px";
  }

  function closeAll(exceptPopover) {
    allPopovers.forEach((p) => {
      if (p !== exceptPopover) p.classList.remove("show");
    });
    allBtns.forEach((b) => {
      if (document.getElementById(b.dataset.popover) !== exceptPopover)
        b.classList.remove("active");
    });
  }

  allBtns.forEach((btn) => {
    const popover = document.getElementById(btn.dataset.popover);
    const accent = btn.dataset.accent;
    popover.style.setProperty("--pop-accent", accent);
    if (!isTouch()) {
      btn.addEventListener("mouseenter", () => {
        closeAll(popover);
        popover.classList.add("show");
        positionPopover(btn, popover);
        btn.classList.add("active");
      });
      btn.addEventListener("mouseleave", (e) => {
        if (!popover.contains(e.relatedTarget)) {
          popover.classList.remove("show");
          btn.classList.remove("active");
        }
      });
      popover.addEventListener("mouseleave", (e) => {
        if (e.relatedTarget !== btn) {
          popover.classList.remove("show");
          btn.classList.remove("active");
        }
      });
    } else {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = popover.classList.contains("show");
        closeAll();
        if (!isOpen) {
          popover.classList.add("show");
          positionPopover(btn, popover);
          btn.classList.add("active");
        }
      });
    }
  });

  document.addEventListener("click", () => {
    if (isTouch()) closeAll();
  });

  window.addEventListener(
    "scroll",
    () => {
      const openPopover = document.querySelector(".info-popover.show");
      if (!openPopover) return;
      const activeBtn = document.querySelector(".info-btn.active");
      if (activeBtn) positionPopover(activeBtn, openPopover);
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    const openPopover = document.querySelector(".info-popover.show");
    if (!openPopover) return;
    const activeBtn = document.querySelector(".info-btn.active");
    if (activeBtn) positionPopover(activeBtn, openPopover);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const id = document.activeElement?.id || "";
    if (id.startsWith("tp-")) hitungThroughput();
    else if (id.startsWith("dl-")) hitungDelay();
    else if (id.startsWith("jt-")) hitungJitter();
    else if (id.startsWith("pl-")) hitungPacketLoss();
  });
});

// ─── Canvas-based download ───────────────────────────────────────────────────

const CARD_CONFIG = {
  "dl-result": { label: "Delay", accent: "#1a5c8a", dot: "#5aade0" },
  "jt-result": { label: "Jitter", accent: "#2a7a4a", dot: "#6fcf97" },
  "tp-result": { label: "Throughput", accent: "#b5541a", dot: "#e07a30" },
  "pl-result": { label: "Packet Loss", accent: "#7a1a4a", dot: "#c060a0" },
};

const SCALE = 2;
const CARD_W = 480;
const CARD_PAD = 28;
const FONT_MONO = "'DM Mono', 'Courier New', monospace";
const FONT_SERIF = "'DM Serif Display', Georgia, serif";
const FONT_SANS = "'DM Sans', sans-serif";

function readSteps(resultId) {
  const stepsEl = document.getElementById(resultId.replace("result", "steps"));
  if (!stepsEl) return [];
  const lines = stepsEl.querySelectorAll(".step-line");
  return Array.from(lines).map((l) => ({
    op: l.querySelector(".step-op")?.textContent?.trim() || "",
    val: l.querySelector(".step-val")?.textContent?.trim() || "",
    isFinal: l.classList.contains("step-final"),
  }));
}

function readTiphon(resultId) {
  const prefix = resultId.replace("-result", "");
  const el = document.getElementById(prefix + "-tiphon");
  if (!el) return null;
  const badge = el.querySelector(".tiphon-badge");
  if (!badge || getComputedStyle(badge).display === "none") return null;
  const kategori = el.querySelector(".tiphon-kategori")?.textContent?.trim();
  const label = el.querySelector(".tiphon-label")?.textContent?.trim();
  const indeks = el.querySelector(".tiphon-indeks")?.textContent?.trim();
  const lvlClass = Array.from(badge.classList).find((c) =>
    c.startsWith("tiphon-lvl-"),
  );
  const lvl = lvlClass ? parseInt(lvlClass.replace("tiphon-lvl-", "")) : 4;
  return { kategori, label, indeks, lvl };
}

const TIPHON_COLORS = {
  4: { bg: "#edfaf3", border: "#6fcf97", text: "#1a5c35", badge: "#6fcf97" },
  3: { bg: "#eaf4fb", border: "#5aade0", text: "#1a4a6e", badge: "#5aade0" },
  2: { bg: "#fef9ec", border: "#f0c040", text: "#7a5a00", badge: "#f0c040" },
  1: { bg: "#fff4ec", border: "#e07a30", text: "#7a3010", badge: "#e07a30" },
  0: { bg: "#fdecea", border: "#e05555", text: "#7a1010", badge: "#e05555" },
};

function measureCardHeight(steps, tiphon) {
  let h = CARD_PAD;
  h += 14; // label "HASIL"
  h += 10; // gap
  h += steps.length * 26; // step lines
  h += 16; // gap
  if (tiphon) {
    h += 72; // tiphon badge height
    h += 12;
  }
  h += CARD_PAD;
  return h;
}

function drawCard(ctx, resultId, x, y, cardW) {
  const cfg = CARD_CONFIG[resultId];
  const steps = readSteps(resultId);
  const tiphon = readTiphon(resultId);
  const cardH = measureCardHeight(steps, tiphon);

  // background
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, x, y, cardW, cardH, 12);
  ctx.fill();

  // border
  ctx.strokeStyle = "#e0dbd0";
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, cardW, cardH, 12);
  ctx.stroke();

  // accent top bar
  ctx.fillStyle = cfg.accent;
  roundRectTop(ctx, x, y, cardW, 4, 12);
  ctx.fill();

  let cy = y + CARD_PAD;

  // label "HASIL"
  ctx.font = `600 11px ${FONT_SANS}`;
  ctx.fillStyle = cfg.accent;
  ctx.letterSpacing = "2px";
  ctx.fillText("HASIL", x + CARD_PAD, cy);
  ctx.letterSpacing = "0px";

  // divider line after label
  cy += 6;
  ctx.strokeStyle = "#e0dbd0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + CARD_PAD, cy);
  ctx.lineTo(x + cardW - CARD_PAD, cy);
  ctx.stroke();
  cy += 14;

  // steps
  steps.forEach((s) => {
    const opW = 160;
    ctx.font = `400 13px ${FONT_MONO}`;
    ctx.fillStyle = "#8a7f72";
    ctx.fillText(s.op, x + CARD_PAD, cy);

    ctx.font = s.isFinal ? `500 13px ${FONT_MONO}` : `400 13px ${FONT_MONO}`;
    ctx.fillStyle = s.isFinal ? cfg.accent : "#2c2520";
    ctx.fillText(s.val, x + CARD_PAD + opW, cy);
    cy += 26;
  });

  cy += 6;

  // tiphon badge
  if (tiphon) {
    const tc = TIPHON_COLORS[tiphon.lvl] || TIPHON_COLORS[4];
    const bx = x + CARD_PAD;
    const bw = cardW - CARD_PAD * 2;
    const bh = 60;

    // badge bg
    ctx.fillStyle = tc.bg;
    roundRect(ctx, bx, cy, bw, bh, 7);
    ctx.fill();
    ctx.strokeStyle = tc.border;
    ctx.lineWidth = 1;
    roundRect(ctx, bx, cy, bw, bh, 7);
    ctx.stroke();

    // dot
    ctx.fillStyle = tc.badge;
    ctx.beginPath();
    ctx.arc(bx + 20, cy + bh / 2, 7, 0, Math.PI * 2);
    ctx.fill();

    // label text
    ctx.font = `600 10px ${FONT_SANS}`;
    ctx.fillStyle = tc.text;
    ctx.globalAlpha = 0.65;
    ctx.fillText(tiphon.label?.toUpperCase() || "", bx + 38, cy + 20);
    ctx.globalAlpha = 1;

    // kategori text
    ctx.font = `400 15px ${FONT_SERIF}`;
    ctx.fillStyle = tc.text;
    ctx.fillText(tiphon.kategori || "", bx + 38, cy + 39);

    // indeks badge (pill kanan)
    const indeksText = tiphon.indeks || "";
    ctx.font = `500 11px ${FONT_MONO}`;
    const iw = ctx.measureText(indeksText).width + 20;
    const ix = bx + bw - iw - 10;
    const iy = cy + bh / 2 - 11;
    ctx.fillStyle = tc.badge;
    roundRect(ctx, ix, iy, iw, 22, 11);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(indeksText, ix + 10, iy + 15);

    cy += bh + 12;
  }

  return cardH;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function roundRectTop(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function buildCanvas(ids) {
  const GAP = 20;
  const PAD = 28;
  const COLS = ids.length === 1 ? 1 : 2;
  const ROWS = Math.ceil(ids.length / COLS);

  const dummy = document.createElement("canvas");
  const dctx = dummy.getContext("2d");
  const heights = ids.map((id) => {
    const steps = readSteps(id);
    const tiphon = readTiphon(id);
    return measureCardHeight(steps, tiphon);
  });

  // tinggi per baris = card tertinggi di baris itu
  const rowHeights = [];
  for (let r = 0; r < ROWS; r++) {
    const rowIds = ids.slice(r * COLS, r * COLS + COLS);
    const rowH = Math.max(
      ...rowIds.map((id) => {
        const steps = readSteps(id);
        const tiphon = readTiphon(id);
        return measureCardHeight(steps, tiphon);
      }),
    );
    rowHeights.push(rowH);
  }

  const totalW = PAD + COLS * CARD_W + (COLS - 1) * GAP + PAD;
  const totalH =
    PAD + rowHeights.reduce((a, b) => a + b, 0) + (ROWS - 1) * GAP + PAD + 20;

  const canvas = document.createElement("canvas");
  canvas.width = totalW * SCALE;
  canvas.height = totalH * SCALE;
  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);

  // background
  ctx.fillStyle = "#f4f1ec";
  ctx.fillRect(0, 0, totalW, totalH);

  // watermark
  ctx.font = `400 10px ${FONT_MONO}`;
  ctx.fillStyle = "#c8a96e";
  ctx.globalAlpha = 0.5;
  ctx.fillText("Network QoS Calculator · Wireshark Analysis", PAD, totalH - 10);
  ctx.globalAlpha = 1;

  ids.forEach((id, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * (CARD_W + GAP);
    const y = PAD + rowHeights.slice(0, row).reduce((a, b) => a + b + GAP, 0);
    drawCard(ctx, id, x, y, CARD_W);
  });

  return canvas;
}

function downloadResult(resultId) {
  const el = document.getElementById(resultId);
  if (!el || !el.classList.contains("show")) return;

  const nameMap = {
    "dl-result": "delay",
    "jt-result": "jitter",
    "tp-result": "throughput",
    "pl-result": "packet-loss",
  };

  const canvas = buildCanvas([resultId]);
  const link = document.createElement("a");
  link.download = (nameMap[resultId] || resultId) + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function downloadAllResults() {
  const ids = ["dl-result", "jt-result", "tp-result", "pl-result"].filter(
    (id) => document.getElementById(id)?.classList.contains("show"),
  );
  if (ids.length === 0) return;

  const canvas = buildCanvas(ids);
  const link = document.createElement("a");
  link.download = "semua-hasil-qos.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
