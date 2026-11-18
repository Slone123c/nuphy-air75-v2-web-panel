const KEYBOARD_FILTER = {
  vendorId: 0x19f5,
  productId: 0x3246,
  usagePage: 0xff60,
  usage: 0x61,
};

const CMD = {
  SET: 0x07,
  GET: 0x08,
  SAVE: 0x09,
  UNHANDLED: 0xff,
};

const CH_CUSTOM = 0x00;
const CH_RGB_MATRIX = 0x03;

const CUSTOM_ID = {
  SIDE_MODE: 1,
  SIDE_LIGHT: 2,
  SIDE_SPEED: 3,
  SIDE_RGB: 4,
  SIDE_COLOUR: 5,
  SLEEP_ENABLE: 6,
  BAT_HOLD: 7,
  BAT_DEMO: 8,
  DEV_STATUS: 9,
  SIDE_CUSTOM_LEFT: 10,
  SIDE_CUSTOM_RIGHT: 11,
  SIDE_LEDS_LEFT: 12,
  SIDE_LEDS_RIGHT: 13,
};

const MATRIX_ID = {
  BRIGHTNESS: 1,
  EFFECT: 2,
  SPEED: 3,
  COLOR: 4,
};

const COLOUR_PRESETS = [
  { idx: 0, name: "红色", hex: "#ff0000" },
  { idx: 1, name: "橙色", hex: "#ff8000" },
  { idx: 2, name: "黄色", hex: "#ffff00" },
  { idx: 3, name: "绿色", hex: "#00ff00" },
  { idx: 4, name: "青色", hex: "#00ffff" },
  { idx: 5, name: "蓝色", hex: "#0000ff" },
  { idx: 6, name: "紫色", hex: "#8000ff" },
  { idx: 7, name: "冷白", hex: "#c0c0ff" },
  { idx: 8, name: "熄灭", hex: "#141820" },
];

const MATRIX_EFFECTS = [
  "0 · 关闭背光 (All Off)",
  "1 · 纯色常亮 (Solid Color)",
  "2 · 上下渐变 (Gradient Up/Down)",
  "3 · 左右渐变 (Gradient Left/Right)",
  "4 · 呼吸灯 (Breathing)",
  "5 · 饱和度光带 (Band Sat.)",
  "6 · 亮度光带 (Band Val.)",
  "7 · 饱和度风车 (Pinwheel Sat.)",
  "8 · 亮度风车 (Pinwheel Val.)",
  "9 · 饱和度螺旋 (Spiral Sat.)",
  "10 · 亮度螺旋 (Spiral Val.)",
  "11 · 全局循环 (Cycle All)",
  "12 · 左右彩虹流 (Cycle Left/Right)",
  "13 · 上下彩虹流 (Cycle Up/Down)",
  "14 · 彩虹 V 形波 (Rainbow Chevron)",
  "15 · 内外扩散 (Cycle Out/In)",
  "16 · 双路内外扩散 (Cycle Out/In Dual)",
  "17 · 彩虹风车 (Cycle Pinwheel)",
  "18 · 彩虹螺旋 (Cycle Spiral)",
  "19 · 双色灯塔 (Dual Beacon)",
  "20 · 彩虹灯塔 (Rainbow Beacon)",
  "21 · 多彩风车 (Rainbow Pinwheels)",
  "22 · 彩色雨滴 (Raindrops)",
  "23 · 糖果雨滴 (Jellybean Raindrops)",
  "24 · 色相呼吸 (Hue Breathing)",
  "25 · 色相钟摆 (Hue Pendulum)",
  "26 · 色相波浪 (Hue Wave)",
  "27 · 打字热力图 (Typing Heatmap)",
  "28 · 数字雨 (Digital Rain)",
  "29 · 单键响应 (Reactive Simple)",
  "30 · 渐隐响应 (Reactive)",
  "31 · 宽域响应 (Reactive Wide)",
  "32 · 多点宽域 (Reactive Multiwide)",
  "33 · 十字光束 (Reactive Cross)",
  "34 · 多点十字 (Reactive Multicross)",
  "35 · 核心扩散 (Reactive Nexus)",
  "36 · 多点核心 (Reactive MultiNexus)",
  "37 · 涟漪 (Splash)",
  "38 · 多点涟漪 (MultiSplash)",
  "39 · 单色涟漪 (Solid Splash)",
  "40 · 多点单色涟漪 (Solid MultiSplash)",
];

const SPEED_LABELS = ["极慢", "较慢", "中速", "较快", "极快"];
const LINK_MODE_LABELS = {
  0: "2.4G 无线",
  1: "蓝牙 1",
  2: "蓝牙 2",
  3: "蓝牙 3",
  4: "USB 有线",
};

const state = {
  device: null,
  queue: Promise.resolve(),
  pending: null,
  pollTimer: null,
  pollBusy: false,
  customSupported: true,
  sideMode: 0,
  sideLight: 3,
  sideSpeed: 2,
  sideRgb: 1,
  sideColour: 0,
  sleepEnable: 1,
  batHold: 0,
  leftCustom: { enable: false, r: 0, g: 128, b: 255 },
  rightCustom: { enable: false, r: 0, g: 255, b: 128 },
  matrix: { effect: 12, bright: 180, speed: 128, hue: 0, sat: 255 },
};

const el = {
  connBadge: document.getElementById("connBadge"),
  connectBtn: document.getElementById("connectBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  saveBtn: document.getElementById("saveBtn"),
  banner: document.getElementById("banner"),
  statusBattery: document.getElementById("statusBattery"),
  statusCharge: document.getElementById("statusCharge"),
  statusLink: document.getElementById("statusLink"),
  statusSys: document.getElementById("statusSys"),
  liveSyncToggle: document.getElementById("liveSyncToggle"),
  chassisModeText: document.getElementById("chassisModeText"),
  keycapGrid: document.getElementById("keycapGrid"),
  sideModeGroup: document.getElementById("sideModeGroup"),
  sideLightRange: document.getElementById("sideLightRange"),
  sideLightVal: document.getElementById("sideLightVal"),
  sideSpeedRange: document.getElementById("sideSpeedRange"),
  sideSpeedVal: document.getElementById("sideSpeedVal"),
  sideRgbToggle: document.getElementById("sideRgbToggle"),
  sideColorSwatches: document.getElementById("sideColorSwatches"),
  leftCustomToggle: document.getElementById("leftCustomToggle"),
  leftCustomColor: document.getElementById("leftCustomColor"),
  rightCustomToggle: document.getElementById("rightCustomToggle"),
  rightCustomColor: document.getElementById("rightCustomColor"),
  batHoldToggle: document.getElementById("batHoldToggle"),
  sleepToggle: document.getElementById("sleepToggle"),
  batDemoBtn: document.getElementById("batDemoBtn"),
  matrixEffectSelect: document.getElementById("matrixEffectSelect"),
  matrixBrightRange: document.getElementById("matrixBrightRange"),
  matrixBrightVal: document.getElementById("matrixBrightVal"),
  matrixSpeedRange: document.getElementById("matrixSpeedRange"),
  matrixSpeedVal: document.getElementById("matrixSpeedVal"),
  matrixHueRange: document.getElementById("matrixHueRange"),
  matrixHueVal: document.getElementById("matrixHueVal"),
  matrixSatRange: document.getElementById("matrixSatRange"),
  matrixSatVal: document.getElementById("matrixSatVal"),
};

function showBanner(kind, message) {
  if (!message) {
    el.banner.className = "banner hidden";
    el.banner.textContent = "";
    return;
  }
  el.banner.className = `banner banner-${kind}`;
  el.banner.textContent = message;
}

function buildKeycapGrid() {
  const rows = [
    Array(16).fill(""),
    [...Array(13).fill(""), "wide-2", ""],
    Array(15).fill(""),
    ["wide-2", ...Array(11).fill(""), "wide-2", ""],
    ["wide-2", ...Array(11).fill(""), "wide-2", ""],
    ["", "", "", "space", "", "", "", "", "", ""],
  ];
  const frag = document.createDocumentFragment();
  for (const row of rows) {
    for (const cls of row) {
      const cap = document.createElement("div");
      cap.className = cls ? `keycap ${cls}` : "keycap";
      frag.appendChild(cap);
    }
  }
  el.keycapGrid.appendChild(frag);
}

function buildSwatches() {
  const frag = document.createDocumentFragment();
  for (const preset of COLOUR_PRESETS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.style.background = preset.hex;
    btn.title = preset.name;
    btn.dataset.colour = String(preset.idx);
    btn.addEventListener("click", () => {
      state.sideColour = preset.idx;
      state.sideRgb = 0;
      renderControls();
      void writeCustom(CUSTOM_ID.SIDE_RGB, [0])
        .then(() => writeCustom(CUSTOM_ID.SIDE_COLOUR, [preset.idx]))
        .catch(handleCommandError);
    });
    frag.appendChild(btn);
  }
  el.sideColorSwatches.appendChild(frag);
}

function buildMatrixEffects() {
  const frag = document.createDocumentFragment();
  MATRIX_EFFECTS.forEach((label, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = label;
    frag.appendChild(opt);
  });
  el.matrixEffectSelect.appendChild(frag);
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function hsv255ToRgb(h, s, v) {
  const hf = (h / 255) * 6;
  const sf = s / 255;
  const vf = v / 255;
  const i = Math.floor(hf);
  const f = hf - i;
  const p = vf * (1 - sf);
  const q = vf * (1 - f * sf);
  const t = vf * (1 - (1 - f) * sf);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = vf; g = t; b = p; break;
    case 1: r = q; g = vf; b = p; break;
    case 2: r = p; g = vf; b = t; break;
    case 3: r = p; g = q; b = vf; break;
    case 4: r = t; g = p; b = vf; break;
    case 5: r = vf; g = p; b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function updateKeycapGlow() {
  const caps = el.keycapGrid.querySelectorAll(".keycap");
  if (!state.device || state.matrix.effect === 0 || state.matrix.bright === 0) {
    caps.forEach((cap) => {
      cap.style.boxShadow = "";
      cap.style.borderColor = "#313b4d";
    });
    return;
  }
  const [r, g, b] = hsv255ToRgb(state.matrix.hue, state.matrix.sat, state.matrix.bright);
  const alpha = (0.15 + (state.matrix.bright / 255) * 0.45).toFixed(2);
  const border = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  const glow = `0 0 8px rgba(${r}, ${g}, ${b}, ${(Number(alpha) * 0.6).toFixed(2)})`;
  caps.forEach((cap) => {
    cap.style.borderColor = border;
    cap.style.boxShadow = glow;
  });
}

function renderControls() {
  const connected = Boolean(state.device && state.device.opened);
  el.connBadge.textContent = connected ? "已连接 · USB" : "未连接";
  el.connBadge.className = connected ? "badge badge-online" : "badge badge-offline";
  el.connectBtn.textContent = connected ? "断开连接" : "连接键盘";
  el.refreshBtn.disabled = !connected;
  el.saveBtn.disabled = !connected;
  el.batDemoBtn.disabled = !connected || !state.customSupported;

  el.sideModeGroup.querySelectorAll("button").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.mode) === state.sideMode);
  });

  el.sideLightRange.value = String(state.sideLight);
  el.sideLightVal.textContent = `${state.sideLight} / 5`;

  const uiSpeed = 4 - state.sideSpeed;
  el.sideSpeedRange.value = String(uiSpeed);
  el.sideSpeedVal.textContent = SPEED_LABELS[uiSpeed] ?? "中速";

  el.sideRgbToggle.checked = state.sideRgb === 1;
  el.sideColorSwatches.querySelectorAll(".swatch").forEach((btn) => {
    btn.classList.toggle(
      "active",
      state.sideRgb === 0 && Number(btn.dataset.colour) === state.sideColour
    );
  });

  el.leftCustomToggle.checked = state.leftCustom.enable;
  el.leftCustomColor.value = rgbToHex(state.leftCustom.r, state.leftCustom.g, state.leftCustom.b);
  el.rightCustomToggle.checked = state.rightCustom.enable;
  el.rightCustomColor.value = rgbToHex(state.rightCustom.r, state.rightCustom.g, state.rightCustom.b);

  el.batHoldToggle.checked = state.batHold === 1;
  el.sleepToggle.checked = state.sleepEnable === 1;

  el.matrixEffectSelect.value = String(state.matrix.effect);
  el.matrixBrightRange.value = String(state.matrix.bright);
  el.matrixBrightVal.textContent = String(state.matrix.bright);
  el.matrixSpeedRange.value = String(state.matrix.speed);
  el.matrixSpeedVal.textContent = String(state.matrix.speed);
  el.matrixHueRange.value = String(state.matrix.hue);
  el.matrixHueVal.textContent = String(state.matrix.hue);
  el.matrixSatRange.value = String(state.matrix.sat);
  el.matrixSatVal.textContent = String(state.matrix.sat);

  if (connected) {
    const effectLabel = MATRIX_EFFECTS[state.matrix.effect] || `Effect ${state.matrix.effect}`;
    el.chassisModeText.textContent = `NuPhy Air75 V2 · ${effectLabel}`;
  } else {
    el.chassisModeText.textContent = "等待连接 USB（19F5:3246 · 0xFF60）";
  }

  updateKeycapGlow();
}

function renderSideLeds(offset, bytes) {
  for (let i = 0; i < 6; i++) {
    const ledIdx = offset + i;
    const dot = document.querySelector(`.led-dot[data-led="${ledIdx}"]`);
    if (!dot) continue;
    const r = Math.min(255, bytes[i * 3 + 0] * 4);
    const g = Math.min(255, bytes[i * 3 + 1] * 4);
    const b = Math.min(255, bytes[i * 3 + 2] * 4);
    if (r + g + b < 6) {
      dot.style.backgroundColor = "#1b222c";
      dot.style.boxShadow = "inset 0 0 3px rgba(0, 0, 0, 0.7)";
    } else {
      dot.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      dot.style.boxShadow = `0 0 10px rgb(${r}, ${g}, ${b})`;
    }
  }
}

function clearSideLeds() {
  document.querySelectorAll(".led-dot").forEach((dot) => {
    dot.style.backgroundColor = "#1b222c";
    dot.style.boxShadow = "inset 0 0 3px rgba(0, 0, 0, 0.7)";
  });
}

function renderDeviceStatus(bytes) {
  const batPercent = bytes[0];
  const charge = bytes[1];
  const link = bytes[2];
  const sysSw = bytes[3];
  const demoActive = bytes[5] === 1;

  el.statusBattery.textContent = `${batPercent}%`;
  if (charge === 0x03) {
    el.statusCharge.textContent = "充电中";
  } else if (charge & 0x01) {
    el.statusCharge.textContent = "已接电源 / 满电";
  } else {
    el.statusCharge.textContent = "电池供电";
  }
  el.statusLink.textContent = LINK_MODE_LABELS[link] ?? `模式 ${link}`;
  el.statusSys.textContent = sysSw === 0xa2 ? "Mac" : sysSw === 0xa1 ? "Win" : "--";
  el.batDemoBtn.textContent = demoActive ? "电量流光演示播放中..." : "播放红 / 黄 / 绿电量流光演示";
}

function sendHidPacket(packet) {
  const task = state.queue.then(() => executeHidPacket(packet));
  state.queue = task.catch(() => {});
  return task;
}

async function executeHidPacket(packet) {
  if (!state.device || !state.device.opened) {
    throw new Error("键盘未连接");
  }
  const out = new Uint8Array(32);
  out.set(packet.slice(0, 32));

  const responsePromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (state.pending) {
        state.pending = null;
        reject(new Error("HID 响应超时"));
      }
    }, 1000);
    state.pending = { resolve, reject, timer };
  });

  await state.device.sendReport(0, out);
  const resp = await responsePromise;
  if (resp[0] === CMD.UNHANDLED) {
    const err = new Error("UNHANDLED");
    err.code = "UNHANDLED";
    throw err;
  }
  return resp;
}

function onInputReport(event) {
  if (!state.pending) return;
  const { resolve, timer } = state.pending;
  state.pending = null;
  clearTimeout(timer);
  const data = new Uint8Array(event.data.buffer, event.data.byteOffset, event.data.byteLength);
  resolve(data);
}

async function readCustom(valueId) {
  const resp = await sendHidPacket([CMD.GET, CH_CUSTOM, valueId]);
  return resp.slice(3);
}

async function writeCustom(valueId, bytes) {
  await sendHidPacket([CMD.SET, CH_CUSTOM, valueId, ...bytes]);
}

async function readMatrix(valueId) {
  const resp = await sendHidPacket([CMD.GET, CH_RGB_MATRIX, valueId]);
  return resp.slice(3);
}

async function writeMatrix(valueId, bytes) {
  await sendHidPacket([CMD.SET, CH_RGB_MATRIX, valueId, ...bytes]);
}

function handleCommandError(err) {
  if (err && err.code === "UNHANDLED") {
    state.customSupported = false;
    showBanner(
      "warn",
      "已连接键盘 VIA 接口，但当前刷入的固件尚未启用侧灯自定义通道。请先刷入最新编译的固件（主灯调节当前仍可直接使用）。"
    );
    renderControls();
    return;
  }
  showBanner("error", `通信失败：${err?.message || err}`);
}

async function syncAllFromKeyboard() {
  if (!state.device || !state.device.opened) return;
  try {
    const [eff, bright, speed, color] = await Promise.all([
      readMatrix(MATRIX_ID.EFFECT),
      readMatrix(MATRIX_ID.BRIGHTNESS),
      readMatrix(MATRIX_ID.SPEED),
      readMatrix(MATRIX_ID.COLOR),
    ]);
    state.matrix.effect = eff[0];
    state.matrix.bright = bright[0];
    state.matrix.speed = speed[0];
    state.matrix.hue = color[0];
    state.matrix.sat = color[1];

    try {
      const [
        mode,
        light,
        sideSpeed,
        sideRgb,
        sideColour,
        sleep,
        batHold,
        leftCustom,
        rightCustom,
        devStatus,
      ] = await Promise.all([
        readCustom(CUSTOM_ID.SIDE_MODE),
        readCustom(CUSTOM_ID.SIDE_LIGHT),
        readCustom(CUSTOM_ID.SIDE_SPEED),
        readCustom(CUSTOM_ID.SIDE_RGB),
        readCustom(CUSTOM_ID.SIDE_COLOUR),
        readCustom(CUSTOM_ID.SLEEP_ENABLE),
        readCustom(CUSTOM_ID.BAT_HOLD),
        readCustom(CUSTOM_ID.SIDE_CUSTOM_LEFT),
        readCustom(CUSTOM_ID.SIDE_CUSTOM_RIGHT),
        readCustom(CUSTOM_ID.DEV_STATUS),
      ]);

      state.customSupported = true;
      state.sideMode = mode[0];
      state.sideLight = light[0];
      state.sideSpeed = sideSpeed[0];
      state.sideRgb = sideRgb[0];
      state.sideColour = sideColour[0];
      state.sleepEnable = sleep[0];
      state.batHold = batHold[0];
      state.leftCustom = {
        enable: leftCustom[0] === 1,
        r: leftCustom[1],
        g: leftCustom[2],
        b: leftCustom[3],
      };
      state.rightCustom = {
        enable: rightCustom[0] === 1,
        r: rightCustom[1],
        g: rightCustom[2],
        b: rightCustom[3],
      };
      renderDeviceStatus(devStatus);
      showBanner(null, "");
    } catch (err) {
      handleCommandError(err);
    }

    renderControls();
    await pollLiveState();
  } catch (err) {
    handleCommandError(err);
  }
}

async function pollLiveState() {
  if (!state.device || !state.device.opened || !state.customSupported || state.pollBusy) {
    return;
  }
  state.pollBusy = true;
  try {
    const devStatus = await readCustom(CUSTOM_ID.DEV_STATUS);
    renderDeviceStatus(devStatus);
    if (el.liveSyncToggle.checked) {
      const leftLeds = await readCustom(CUSTOM_ID.SIDE_LEDS_LEFT);
      const rightLeds = await readCustom(CUSTOM_ID.SIDE_LEDS_RIGHT);
      renderSideLeds(0, leftLeds);
      renderSideLeds(6, rightLeds);
    }
  } catch (err) {
    if (err && err.code === "UNHANDLED") {
      state.customSupported = false;
      renderControls();
    }
  } finally {
    state.pollBusy = false;
  }
}

function startPolling() {
  stopPolling();
  state.pollTimer = setInterval(() => {
    void pollLiveState();
  }, 90);
}

function stopPolling() {
  if (state.pollTimer) {
    clearInterval(state.pollTimer);
    state.pollTimer = null;
  }
}

async function openDevice(device) {
  if (!device.opened) {
    await device.open();
  }
  state.device = device;
  device.addEventListener("inputreport", onInputReport);
  await syncAllFromKeyboard();
  startPolling();
}

async function disconnectDevice() {
  stopPolling();
  if (state.device) {
    state.device.removeEventListener("inputreport", onInputReport);
    if (state.device.opened) {
      await state.device.close();
    }
    state.device = null;
  }
  clearSideLeds();
  el.statusBattery.textContent = "--%";
  el.statusCharge.textContent = "--";
  el.statusLink.textContent = "--";
  el.statusSys.textContent = "--";
  renderControls();
}

function bindEvents() {
  el.connectBtn.addEventListener("click", async () => {
    if (!("hid" in navigator)) {
      showBanner("error", "当前浏览器不支持 WebHID，请使用 Google Chrome、Edge 或 Arc 打开。");
      return;
    }
    if (state.device && state.device.opened) {
      await disconnectDevice();
      return;
    }
    try {
      const devices = await navigator.hid.requestDevice({ filters: [KEYBOARD_FILTER] });
      if (devices.length === 0) return;
      await openDevice(devices[0]);
    } catch (err) {
      showBanner("error", `连接失败：${err?.message || err}`);
    }
  });

  el.refreshBtn.addEventListener("click", () => {
    void syncAllFromKeyboard();
  });

  el.saveBtn.addEventListener("click", async () => {
    try {
      await sendHidPacket([CMD.SAVE, CH_RGB_MATRIX]);
      if (state.customSupported) {
        await sendHidPacket([CMD.SAVE, CH_CUSTOM]);
      }
      showBanner("ok", "当前灯光与电源设置已写入键盘 EEPROM，断电或切换无线后依然保留。");
    } catch (err) {
      handleCommandError(err);
    }
  });

  el.sideModeGroup.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-mode]");
    if (!btn) return;
    const mode = Number(btn.dataset.mode);
    state.sideMode = mode;
    renderControls();
    void writeCustom(CUSTOM_ID.SIDE_MODE, [mode]).catch(handleCommandError);
  });

  el.sideLightRange.addEventListener("input", () => {
    const light = Number(el.sideLightRange.value);
    state.sideLight = light;
    renderControls();
    void writeCustom(CUSTOM_ID.SIDE_LIGHT, [light]).catch(handleCommandError);
  });

  el.sideSpeedRange.addEventListener("input", () => {
    const uiSpeed = Number(el.sideSpeedRange.value);
    const fwSpeed = 4 - uiSpeed;
    state.sideSpeed = fwSpeed;
    renderControls();
    void writeCustom(CUSTOM_ID.SIDE_SPEED, [fwSpeed]).catch(handleCommandError);
  });

  el.sideRgbToggle.addEventListener("change", () => {
    const val = el.sideRgbToggle.checked ? 1 : 0;
    state.sideRgb = val;
    renderControls();
    void writeCustom(CUSTOM_ID.SIDE_RGB, [val]).catch(handleCommandError);
  });

  const pushLeftCustom = () => {
    const { enable, r, g, b } = state.leftCustom;
    renderControls();
    void writeCustom(CUSTOM_ID.SIDE_CUSTOM_LEFT, [enable ? 1 : 0, r, g, b]).catch(handleCommandError);
  };

  el.leftCustomToggle.addEventListener("change", () => {
    state.leftCustom.enable = el.leftCustomToggle.checked;
    pushLeftCustom();
  });

  el.leftCustomColor.addEventListener("input", () => {
    const [r, g, b] = hexToRgb(el.leftCustomColor.value);
    state.leftCustom = { enable: true, r, g, b };
    pushLeftCustom();
  });

  const pushRightCustom = () => {
    const { enable, r, g, b } = state.rightCustom;
    renderControls();
    void writeCustom(CUSTOM_ID.SIDE_CUSTOM_RIGHT, [enable ? 1 : 0, r, g, b]).catch(handleCommandError);
  };

  el.rightCustomToggle.addEventListener("change", () => {
    state.rightCustom.enable = el.rightCustomToggle.checked;
    pushRightCustom();
  });

  el.rightCustomColor.addEventListener("input", () => {
    const [r, g, b] = hexToRgb(el.rightCustomColor.value);
    state.rightCustom = { enable: true, r, g, b };
    pushRightCustom();
  });

  document.querySelectorAll(".mini-swatches button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const side = btn.parentElement.dataset.side;
      const [r, g, b] = hexToRgb(btn.dataset.hex);
      if (side === "left") {
        state.leftCustom = { enable: true, r, g, b };
        pushLeftCustom();
      } else {
        state.rightCustom = { enable: true, r, g, b };
        pushRightCustom();
      }
    });
  });

  el.batHoldToggle.addEventListener("change", () => {
    state.batHold = el.batHoldToggle.checked ? 1 : 0;
    void writeCustom(CUSTOM_ID.BAT_HOLD, [state.batHold]).catch(handleCommandError);
  });

  el.sleepToggle.addEventListener("change", () => {
    state.sleepEnable = el.sleepToggle.checked ? 1 : 0;
    void writeCustom(CUSTOM_ID.SLEEP_ENABLE, [state.sleepEnable]).catch(handleCommandError);
  });

  el.batDemoBtn.addEventListener("click", () => {
    void writeCustom(CUSTOM_ID.BAT_DEMO, [1]).catch(handleCommandError);
  });

  el.matrixEffectSelect.addEventListener("change", () => {
    state.matrix.effect = Number(el.matrixEffectSelect.value);
    renderControls();
    void writeMatrix(MATRIX_ID.EFFECT, [state.matrix.effect]).catch(handleCommandError);
  });

  el.matrixBrightRange.addEventListener("input", () => {
    state.matrix.bright = Number(el.matrixBrightRange.value);
    renderControls();
    void writeMatrix(MATRIX_ID.BRIGHTNESS, [state.matrix.bright]).catch(handleCommandError);
  });

  el.matrixSpeedRange.addEventListener("input", () => {
    state.matrix.speed = Number(el.matrixSpeedRange.value);
    renderControls();
    void writeMatrix(MATRIX_ID.SPEED, [state.matrix.speed]).catch(handleCommandError);
  });

  const pushMatrixColor = () => {
    renderControls();
    void writeMatrix(MATRIX_ID.COLOR, [state.matrix.hue, state.matrix.sat]).catch(handleCommandError);
  };

  el.matrixHueRange.addEventListener("input", () => {
    state.matrix.hue = Number(el.matrixHueRange.value);
    pushMatrixColor();
  });

  el.matrixSatRange.addEventListener("input", () => {
    state.matrix.sat = Number(el.matrixSatRange.value);
    pushMatrixColor();
  });

  if ("hid" in navigator) {
    navigator.hid.addEventListener("disconnect", (event) => {
      if (state.device && event.device === state.device) {
        void disconnectDevice();
        showBanner("warn", "键盘 USB 连接已断开。");
      }
    });
  }
}

async function tryAutoReconnect() {
  if (!("hid" in navigator)) {
    showBanner("error", "当前浏览器不支持 WebHID，请使用 Google Chrome、Edge 或 Arc 打开。");
    return;
  }
  const granted = await navigator.hid.getDevices();
  const matched = granted.find(
    (d) => d.vendorId === KEYBOARD_FILTER.vendorId && d.productId === KEYBOARD_FILTER.productId
  );
  if (matched) {
    try {
      await openDevice(matched);
    } catch {
      renderControls();
    }
  }
}

buildKeycapGrid();
buildSwatches();
buildMatrixEffects();
bindEvents();
renderControls();
void tryAutoReconnect();
