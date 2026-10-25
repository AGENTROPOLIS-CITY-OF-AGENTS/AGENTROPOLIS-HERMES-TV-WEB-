// HERMES-TV hero frame capture. Reuses the sandbox CDP pattern from
// ~/workspace/tools/shot2x.mjs (raw WebSocket CDP, swiftshader, file://).
// Unlike a viewport screenshot, this extracts the canvas backing pixels
// exactly (canvas.toDataURL), so captured frames equal the rendered scene
// at the requested size with no viewport resampling.
// Usage:
//   node capture_frames.mjs <pageUrl> <outDir> <view> <W> <H> <start> <count> [yaw pitch dist]
//   view: persp | equirect ; frames are t = (start+i)/24 seconds.
//   Optional yaw/pitch/dist pin the perspective camera (poster + 4-view checks).
//   Without them, the 20 s video camera path from timing.json is used.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { mkdirSync } from "node:fs";
const [pageUrl, outDir, view, Ws, Hs, startS, countS, yaw, pitch, dist] = process.argv.slice(2);
const W = parseInt(Ws, 10), H = parseInt(Hs, 10);
const start = parseInt(startS, 10), count = parseInt(countS, 10);
const PORT = 9381;
mkdirSync(outDir, { recursive: true });
const chrome = spawn("/opt/meta-chromium/chrome", [
  "--headless=new", "--disable-gpu-sandbox", "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader", "--no-sandbox", "--hide-scrollbars",
  "--allow-file-access-from-files",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${process.env.HOME}/.chrome-hermes-capture`,
  "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitWs() {
  for (let i = 0; i < 90; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); const j = await r.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl; } catch {}
    await sleep(500);
  } throw new Error("CDP not up");
}
let msgId = 0; const pending = new Map(); let ws;
function send(method, params = {}, sessionId) {
  const id = ++msgId;
  return new Promise((res, rej) => { pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })); });
}
const errors = [];
try {
  ws = new WebSocket(await waitWs());
  await new Promise(r => ws.addEventListener("open", r, { once: true }));
  ws.addEventListener("message", (ev) => { const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id);
      if (m.error) rej(new Error(m.error.message)); else res(m.result); }
    if (m.method === "Runtime.exceptionThrown") errors.push("exception: " + m.params.exceptionDetails.text);
    if (m.method === "Network.responseReceived" && m.params.response.status >= 400)
      errors.push("http " + m.params.response.status + " " + m.params.response.url);
    if (m.method === "Network.loadingFailed") errors.push("netfail " + m.params.requestId);
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const S = (m, p) => send(m, p, sessionId);
  await S("Page.enable"); await S("Runtime.enable"); await S("Network.enable");
  await S("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  for (let i = 0; i < count; i++) {
    const idx = start + i, t = idx / 24;
    let url = `${pageUrl}?capture=1&t=${t}&view=${view}&w=${W}&h=${H}`;
    if (yaw !== undefined) url += `&yaw=${yaw}&pitch=${pitch}&dist=${dist}`;
    await S("Page.navigate", { url });
    let ready = false;
    for (let k = 0; k < 60 && !ready; k++) {
      await sleep(250);
      const r = await S("Runtime.evaluate", { expression: "!!window.__heroReady", returnByValue: true });
      ready = !!(r.result && r.result.value);
    }
    if (!ready) { console.log("NOT-READY frame", idx, "t", t); continue; }
    const shot = await S("Runtime.evaluate", {
      expression: "document.querySelector('#heroCanvas').toDataURL('image/jpeg', 0.92)",
      returnByValue: true });
    const dataUrl = shot.result.value;
    const b64 = dataUrl.split(",")[1];
    const name = `frame-${String(idx).padStart(4, "0")}.jpg`;
    writeFileSync(`${outDir}/${name}`, Buffer.from(b64, "base64"));
    if (i % 60 === 0) console.log("frame", idx, "t", t.toFixed(3));
  }
  console.log("DONE", count, "frames ->", outDir);
  console.log("ERRORS", JSON.stringify(errors.slice(0, 20)));
} finally { try { chrome.kill("SIGKILL"); } catch {} }
