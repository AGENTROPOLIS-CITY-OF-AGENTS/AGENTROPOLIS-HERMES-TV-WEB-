/* HERMES-TV hero page logic. No remote requests, no baked copy in textures:
   every word on this page is HTML. The canvas carries geometry only.
   Time is accumulated, never wall-clock: pausing freezes the scene, hiding
   the tab stops accumulation, and capture with ?t= reproduces exact frames.
   Query params (capture + review only):
     ?capture=1&t=<seconds>&view=persp|equirect&yaw=&pitch=&dist=&w=&h=
     ?forcePoster=1  forces the reduced-motion poster path for testing. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var params = new URLSearchParams(location.search);
  var capture = params.get("capture") === "1";
  var forcePoster = params.get("forcePoster") === "1";
  var state = {
    explore: false, playing: true, yaw: 0.55, pitch: 0.32, dist: 13.5,
    selected: null, timeAcc: 0, lastTs: 0, dpr: 1.5, quality: 1,
    emaMs: 16, lowT: 0, override: null, S: null, data: null, timing: null
  };
  function $(id) { return document.getElementById(id); }
  function fmtDevice(id) {
    var m = { tv: "Television", desktop: "Desktop", tablet: "Tablet", phone: "Phone", smarthome: "Smart home hub" };
    return m[id] || id;
  }
  function loadJSON(path) {
    return fetch(path).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }
  function boot() {
    Promise.all([loadJSON("scene.json"), loadJSON("timing.json")]).then(function (arr) {
      state.data = arr[0]; state.timing = arr[1];
      state.S = HeroEngine.buildStatic(state.data);
      buildHotspots();
      if (capture) { captureFrame(); return; }
      if (reduced || forcePoster) { posterMode("Reduced motion: poster shown. Use Explore 360 to view the still scene."); }
      else { posterMode(null); }
      bindControls();
      loop(performance.now());
    }).catch(function (err) {
      var d = $("diag");
      d.textContent = "Diagnostic: scene data failed to load (" + err.message + "). The poster below is the fallback.";
      d.style.display = "block";
    });
  }
  function posterMode(note) {
    $("poster").style.display = "block";
    $("heroCanvas").style.display = "none";
    $("exitExplore").style.display = "none";
    $("explore").style.display = "inline-block";
    if (note) { var c = $("chip"); c.textContent = note; }
  }
  function enterExplore() {
    state.explore = true;
    $("poster").style.display = "none";
    $("heroCanvas").style.display = "block";
    $("explore").style.display = "none";
    $("exitExplore").style.display = "inline-block";
    $("heroCanvas").focus();
    resize();
  }
  function exitExplore() {
    state.explore = false;
    posterMode(null);
  }
  function buildHotspots() {
    var layer = $("hotspots");
    state.data.hotspots.forEach(function (h) {
      var b = document.createElement("button");
      b.className = "hotspot";
      b.type = "button";
      b.textContent = h.title;
      b.setAttribute("aria-label", "About: " + h.title);
      b.dataset.hotspot = h.id;
      b.addEventListener("click", function () { showHotspot(h); });
      layer.appendChild(b);
    });
  }
  function showHotspot(h) {
    var p = $("hotspotPanel");
    p.querySelector("h3").textContent = h.title;
    p.querySelector("p").textContent = h.body;
    p.style.display = "block";
    p.focus();
    state.selected = (h.id === "console" || h.id === "bridge" || h.id === "grid" || h.id === "runtime") ? null : h.id;
  }
  function resize() {
    var cv = $("heroCanvas"), wrap = $("stage");
    var w = wrap.clientWidth || 960, h = Math.round(w * 9 / 16);
    cv.style.height = h + "px";
    cv.width = Math.round(w * state.dpr); cv.height = Math.round(h * state.dpr);
  }
  function camNow() {
    return { yaw: state.yaw, pitch: state.pitch, dist: state.dist, target: state.timing.camera.interactive.target };
  }
  function drawFrame(now) {
    var cv = $("heroCanvas");
    if (!state.explore) return;
    var dt = state.lastTs ? (now - state.lastTs) / 1000 : 0;
    if (dt > 0.1) dt = 0.1;
    state.lastTs = now;
    if (state.playing && !reduced && !forcePoster) state.timeAcc += dt;
    // Interactive task override lifecycle (4 s cycle, like the timeline).
    if (state.override) {
      var lt = state.timeAcc - state.override.t0;
      if (lt >= 4) state.override = null;
    }
    var t = state.timeAcc;
    var taskOverride = null;
    if (state.override) {
      var lt2 = state.timeAcc - state.override.t0;
      if (lt2 < 1.6) taskOverride = { phase: "travel", device: state.override.device, p: lt2 / 1.6 };
      else if (lt2 < 2.5) taskOverride = { phase: "ack", device: state.override.device, p: (lt2 - 1.6) / 0.9 };
      else taskOverride = { phase: "idle", device: state.override.device, p: 0 };
    }
    var ctx = cv.getContext("2d");
    var res = HeroEngine.render(ctx, cv.width, cv.height, state.data, state.S, {
      t: t, yaw: state.yaw, pitch: state.pitch, dist: state.dist,
      target: state.timing.camera.interactive.target, projector: "persp",
      selected: state.selected, quality: state.quality, taskOverride: taskOverride
    });
    updateHotspots();
    updateChip(res.task);
    // Adaptive quality: sustained slow frames drop pixel ratio + detail.
    state.emaMs = state.emaMs * 0.9 + Math.min(dt * 1000, 100) * 0.1;
    if (state.emaMs > 26) {
      state.lowT += dt;
      if (state.lowT > 2 && state.dpr > 1) { state.dpr = 1; state.quality = 0; resize(); }
    } else { state.lowT = 0; }
    window.__heroPerf = { fps: Math.round(1000 / Math.max(state.emaMs, 1)), dpr: state.dpr, quality: state.quality, t: Math.round(t * 100) / 100 };
  }
  function updateHotspots() {
    var cv = $("heroCanvas");
    var cam = camNow();
    var center = [0, 1.2, 0];
    var camPos = [center[0] + cam.dist * Math.sin(cam.yaw) * Math.cos(cam.pitch),
                  center[1] + cam.dist * Math.sin(cam.pitch),
                  center[2] + cam.dist * Math.cos(cam.yaw) * Math.cos(cam.pitch)];
    state.data.hotspots.forEach(function (h) {
      var b = document.querySelector('[data-hotspot="' + h.id + '"]');
      if (!b) return;
      var q = HeroEngine.projectPoint(state.data, h.anchor, cam, cv.clientWidth, cv.clientHeight);
      var show = false;
      if (!q.behind) {
        var ad = [h.anchor[0] - center[0], h.anchor[1] - center[1], h.anchor[2] - center[2]];
        var al = Math.sqrt(ad[0] * ad[0] + ad[1] * ad[1] + ad[2] * ad[2]) || 1;
        var cd = [camPos[0] - center[0], camPos[1] - center[1], camPos[2] - center[2]];
        var cl = Math.sqrt(cd[0] * cd[0] + cd[1] * cd[1] + cd[2] * cd[2]) || 1;
        var facing = (ad[0] * cd[0] + ad[1] * cd[1] + ad[2] * cd[2]) / (al * cl);
        show = facing > -0.15 && q.x >= 0 && q.x <= cv.clientWidth && q.y >= 0 && q.y <= cv.clientHeight;
      }
      b.style.display = show ? "block" : "none";
      if (show) { b.style.left = q.x + "px"; b.style.top = q.y + "px"; }
    });
  }
  function updateChip(task) {
    var c = $("chip");
    if (!task) return;
    if (task.phase === "travel") c.textContent = "Illustrative task in transit to " + fmtDevice(task.device) + ". No device command is sent.";
    else if (task.phase === "ack") c.textContent = "Receipt (illustrative): " + fmtDevice(task.device) + " acknowledged. No live task ran.";
    else c.textContent = "No live task running. The task sequence is illustrative only.";
  }
  function loop(now) {
    drawFrame(now);
    requestAnimationFrame(loop);
  }
  function bindControls() {
    $("explore").addEventListener("click", enterExplore);
    $("exitExplore").addEventListener("click", exitExplore);
    $("pause").addEventListener("click", function () {
      state.playing = !state.playing;
      this.textContent = state.playing ? "Pause motion" : "Resume motion";
      this.setAttribute("aria-pressed", String(!state.playing));
    });
    $("reset").addEventListener("click", function () {
      var it = state.timing.camera.interactive;
      state.yaw = it.yaw0; state.pitch = it.pitch0; state.dist = it.dist0; state.selected = null;
    });
    $("sendTask").addEventListener("click", function () {
      if (!state.explore) enterExplore();
      var order = state.data.taskCycle.order;
      var next = order[Math.floor(state.timeAcc / 4) % order.length];
      state.override = { device: next, t0: state.timeAcc };
    });
    var cv = $("heroCanvas");
    var pointers = {};
    cv.addEventListener("pointerdown", function (e) {
      cv.setPointerCapture(e.pointerId);
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    });
    cv.addEventListener("pointermove", function (e) {
      if (!pointers[e.pointerId]) return;
      var prev = pointers[e.pointerId];
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pointers);
      if (ids.length === 1) {
        state.yaw += (e.clientX - prev.x) * 0.005;
        var it = state.timing.camera.interactive;
        state.pitch = Math.max(it.pitchMin, Math.min(it.pitchMax, state.pitch + (e.clientY - prev.y) * 0.005));
      } else if (ids.length === 2) {
        var a = pointers[ids[0]], b = pointers[ids[1]];
        var d = Math.hypot(a.x - b.x, a.y - b.y);
        if (cv._pinch) {
          var it2 = state.timing.camera.interactive;
          state.dist = Math.max(it2.distMin, Math.min(it2.distMax, state.dist * (cv._pinch / Math.max(d, 1))));
        }
        cv._pinch = d;
      }
    });
    function up(e) { delete pointers[e.pointerId]; if (Object.keys(pointers).length < 2) cv._pinch = null; }
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("wheel", function (e) {
      e.preventDefault();
      var it = state.timing.camera.interactive;
      state.dist = Math.max(it.distMin, Math.min(it.distMax, state.dist * (e.deltaY > 0 ? 1.08 : 0.92)));
    }, { passive: false });
    cv.addEventListener("keydown", function (e) {
      var it = state.timing.camera.interactive;
      if (e.key === "ArrowLeft") { state.yaw -= 0.12; e.preventDefault(); }
      if (e.key === "ArrowRight") { state.yaw += 0.12; e.preventDefault(); }
      if (e.key === "ArrowUp") { state.pitch = Math.min(it.pitchMax, state.pitch + 0.08); e.preventDefault(); }
      if (e.key === "ArrowDown") { state.pitch = Math.max(it.pitchMin, state.pitch - 0.08); e.preventDefault(); }
      if (e.key === "+" || e.key === "=") { state.dist = Math.max(it.distMin, state.dist * 0.9); }
      if (e.key === "-") { state.dist = Math.min(it.distMax, state.dist * 1.1); }
      if (e.key === "r" || e.key === "R") { state.yaw = it.yaw0; state.pitch = it.pitch0; state.dist = it.dist0; }
      if (e.key === "p" || e.key === "P") { $("pause").click(); }
      if (e.key === "Escape") { exitExplore(); }
    });
    // Suspension when offscreen.
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        state.offscreen = !en.isIntersecting;
        if (state.offscreen) state.lastTs = 0;
      });
    }).observe($("stage"));
    window.addEventListener("resize", resize);
    // Hero loop video: autoplay failure falls back to the poster.
    var v = $("heroVideo");
    if (v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {
        $("videoFallback").style.display = "block";
      });
      v.addEventListener("error", function () { $("videoFallback").style.display = "block"; });
    }
  }
  function captureFrame() {
    var t = parseFloat(params.get("t") || "0");
    var view = params.get("view") || "persp";
    var W = parseInt(params.get("w") || "1280", 10), H = parseInt(params.get("h") || "720", 10);
    var cv = $("heroCanvas");
    cv.width = W; cv.height = H;
    cv.style.display = "block";
    $("poster").style.display = "none";
    var ctx = cv.getContext("2d");
    if (view === "equirect") {
      HeroEngine.render(ctx, W, H, state.data, state.S, {
        t: t, projector: "equirect", camPos: state.timing.hero360.camera, quality: 1
      });
    } else {
      var vid = state.timing.camera.video;
      var yaw = params.get("yaw") !== null ? parseFloat(params.get("yaw")) : vid.yaw0 + vid.yawAmp * Math.sin(2 * Math.PI * t / 20);
      var pitch = params.get("pitch") !== null ? parseFloat(params.get("pitch")) : vid.pitch0 + vid.pitchAmp * Math.sin(2 * Math.PI * vid.pitchCycles * t / 20);
      var dist = params.get("dist") !== null ? parseFloat(params.get("dist")) : vid.dist0 + vid.distAmp * Math.sin(2 * Math.PI * t / 20);
      HeroEngine.render(ctx, W, H, state.data, state.S, {
        t: t, yaw: yaw, pitch: pitch, dist: dist, target: vid.target, projector: "persp", quality: 1
      });
    }
    document.title = "HERO-FRAME-READY";
    window.__heroReady = true;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
