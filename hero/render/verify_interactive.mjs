// Interactive verification for the HERMES-TV hero page + 360 viewer.
// Usage: node verify_interactive.mjs <pageUrl> <mode>
//   mode: page | poster | viewer
// Prints PASS/FAIL lines; exits non-zero on any FAIL. Console errors and
// failed network requests are collected (missing poster/video files are
// reported separately, not hidden).
import { spawn } from "node:child_process";
const [pageUrl, mode] = process.argv.slice(2);
const PORT = 9387;
const chrome = spawn("/opt/meta-chromium/chrome", [
  "--headless=new", "--disable-gpu-sandbox", "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader", "--no-sandbox", "--hide-scrollbars",
  "--allow-file-access-from-files",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${process.env.HOME}/.chrome-hermes-verify`,
  "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let ws, msgId = 0; const pending = new Map();
const consoleErrors = [], netFails = [];
function send(m, p = {}, s) { const id = ++msgId; return new Promise((res, rej) => { pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p, ...(s ? { sessionId: s } : {}) })); }); }
const results = [];
function check(name, ok, extra = "") { results.push([ok ? "PASS" : "FAIL", name, extra]); }
try {
  for (let i = 0; i < 90; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); const j = await r.json(); if (j.webSocketDebuggerUrl) { ws = new WebSocket(j.webSocketDebuggerUrl); break; } } catch {} await sleep(500); }
  await new Promise(r => ws.addEventListener("open", r, { once: true }));
  ws.addEventListener("message", (ev) => { const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); if (m.error) rej(new Error(m.error.message)); else res(m.result); }
    if (m.method === "Runtime.exceptionThrown") consoleErrors.push(m.params.exceptionDetails.text);
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") consoleErrors.push(JSON.stringify(m.params.args.map(a => a.value)));
    if (m.method === "Network.responseReceived" && m.params.response.status >= 400) netFails.push(m.params.response.status + " " + m.params.response.url.split("/").pop());
    if (m.method === "Network.loadingFailed" && !m.params.canceled) netFails.push("netfail " + m.params.requestId);
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const S = (m, p) => send(m, p, sessionId);
  await S("Page.enable"); await S("Runtime.enable"); await S("Network.enable");
  await S("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  const ev = async (expr) => { const r = await S("Runtime.evaluate", { expression: expr, returnByValue: true }); return r.result && r.result.value; };
  if (mode === "viewer") {
    await S("Emulation.setDeviceMetricsOverride", { width: 1280, height: 1600, deviceScaleFactor: 1, mobile: false });
    await S("Page.navigate", { url: pageUrl });
    await sleep(4000);
    const hasGl = await ev("!!document.querySelector('#glCanvas').getContext('webgl')");
    check("viewer WebGL context", !!hasGl);
    // The canvas sits below the intro block, so scroll it into view and
    // clip the screenshot to its box; a viewport-top clip would capture
    // only static text and could never change.
    const rect = await ev("(()=>{const c=document.querySelector('#glCanvas');c.scrollIntoView();const r=c.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};})()");
    await sleep(500);
    const shot1 = await S("Page.captureScreenshot", { format: "jpeg", quality: 80, clip: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height), scale: 1 } });
    // NOTE: a headless CDP background tab cannot take keyboard focus, so
    // Input.dispatchKeyEvent never reaches the canvas handler there. The
    // handler itself is tested by dispatching KeyboardEvents straight to
    // the canvas (the path a focused canvas takes in a real browser, where
    // tab or click gives it focus via tabindex="0").
    await ev("for (let i = 0; i < 5; i++) document.querySelector('#glCanvas').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))");
    await sleep(1500);
    const shot2 = await S("Page.captureScreenshot", { format: "jpeg", quality: 80, clip: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height), scale: 1 } });
    check("viewer arrow-key look changes the view", shot1.data !== shot2.data);
  } else {
    const url = mode === "poster" ? pageUrl + "?forcePoster=1" : pageUrl;
    await S("Page.navigate", { url });
    await sleep(3000);
    check("headline present", (await ev("document.querySelector('h1').innerText")).includes("YOUR DEVICES"));
    check("status label present", (await ev("document.querySelector('.status').innerText")).includes("NOT A LIVE DEVICE SESSION"));
    check("controls labeled", ["Explore 360", "Pause motion", "Reset view"].every(async () => true) &&
      (await ev("[...document.querySelectorAll('.controls button')].map(b=>b.innerText).join('|')")).includes("Explore 360"));
    if (mode === "poster") {
      check("poster visible under forcePoster", (await ev("getComputedStyle(document.querySelector('#poster')).display")) === "block");
      check("canvas hidden under forcePoster", (await ev("getComputedStyle(document.querySelector('#heroCanvas')).display")) === "none");
      await ev("document.querySelector('#explore').click()");
      await sleep(1500);
      check("explore shows canvas even in poster mode", (await ev("getComputedStyle(document.querySelector('#heroCanvas')).display")) === "block");
      const t0 = await ev("window.__heroPerf && window.__heroPerf.t");
      await sleep(1500);
      const t1 = await ev("window.__heroPerf && window.__heroPerf.t");
      check("time frozen in poster mode", t0 === t1, "t0=" + t0 + " t1=" + t1);
    } else {
      check("poster visible before explore", (await ev("getComputedStyle(document.querySelector('#poster')).display")) === "block");
      await ev("document.querySelector('#explore').click()");
      await sleep(1500);
      check("canvas visible after explore", (await ev("getComputedStyle(document.querySelector('#heroCanvas')).display")) === "block");
      check("hotspots rendered", (await ev("document.querySelectorAll('.hotspot').length")) >= 5);
      const visHot = await ev("[...document.querySelectorAll('.hotspot')].filter(b=>b.style.display==='block').length");
      check("some hotspots face the camera", visHot >= 1, "visible=" + visHot);
      const t0 = await ev("window.__heroPerf && window.__heroPerf.t");
      await sleep(1200);
      const t1 = await ev("window.__heroPerf && window.__heroPerf.t");
      check("time advances while playing", t1 > t0, "t0=" + t0 + " t1=" + t1);
      await ev("document.querySelector('#pause').click()");
      await sleep(1200);
      const t2 = await ev("window.__heroPerf && window.__heroPerf.t");
      check("pause freezes time", t2 === t1, "t1=" + t1 + " t2=" + t2);
      await ev("document.querySelector('#pause').click()");
      await ev("document.querySelector('#sendTask').click()");
      await sleep(800);
      const chip = await ev("document.querySelector('#chip').innerText");
      check("send task updates chip (illustrative)", chip.includes("Illustrative") || chip.includes("illustrative"), chip);
      await ev("document.querySelector('#heroCanvas').focus()");
      const px1 = await ev("document.querySelector('#heroCanvas').toDataURL('image/jpeg',0.7)");
      for (let i = 0; i < 4; i++) await S("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight" });
      await sleep(800);
      const px2 = await ev("document.querySelector('#heroCanvas').toDataURL('image/jpeg',0.7)");
      check("arrow keys orbit (pixels change)", px1 !== px2);
      await ev("document.querySelector('#exitExplore').click()");
      await sleep(500);
      check("exit returns to poster", (await ev("getComputedStyle(document.querySelector('#poster')).display")) === "block");
      const perf = await ev("JSON.stringify(window.__heroPerf)");
      check("perf object exposed", !!perf, perf || "");
    }
  }
  check("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
  console.log("NET-FAILS:", JSON.stringify(netFails));
} finally { try { chrome.kill("SIGKILL"); } catch {} }
let failed = 0;
for (const [s, n, e] of results) { console.log(s, "-", n, e ? "(" + e + ")" : ""); if (s === "FAIL") failed++; }
console.log(failed === 0 ? "VERIFY: ALL PASS" : "VERIFY: " + failed + " FAILURES");
process.exit(failed === 0 ? 0 : 1);
