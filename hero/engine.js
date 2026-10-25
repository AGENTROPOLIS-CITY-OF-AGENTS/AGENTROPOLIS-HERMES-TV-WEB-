/* HERMES-TV hero engine. Zero-dependency procedural 3D.
   Deterministic: render() is a pure function of (scene data, time t, camera).
   No wall-clock reads, no Math.random at render time (all variation comes
   from a seeded hash of integer ids), so interactive preview and offline
   capture reproduce the same sequence frame for frame.
   Two projectors share one scene: perspective (interactive + hero loop) and
   equirectangular (360 video). Nothing here stretches an image around a
   sphere: geometry is real, projected twice.
   Text policy: the scene carries no baked copy. All headlines, labels, and
   descriptions live in HTML. Screens glow; they do not carry words. */
(function (global) {
  "use strict";
  var TAU = Math.PI * 2;
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeIO(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function v3(x, y, z) { return [x, y, z]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function len(a) { return Math.sqrt(dot(a, a)); }
  function norm(a) { var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function rotY(p, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
  }
  function hexRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
  function shade(hex, f) {
    var c = hexRgb(hex);
    return "rgb(" + Math.round(c[0] * f) + "," + Math.round(c[1] * f) + "," + Math.round(c[2] * f) + ")";
  }
  function rgba(hex, a) {
    var c = hexRgb(hex);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
  }
  // Quadratic bezier sample.
  function bez(p0, p1, p2, t) {
    var u = 1 - t;
    return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
            u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
            u * u * p0[2] + 2 * u * t * p1[2] + t * t * p2[2]];
  }
  function deviceYaw(pos) { return Math.atan2(-pos[0], -pos[2]); }
  function deviceTop(d, data) {
    var p = d.position;
    if (d.id === "tv") return [p[0], 2.9, p[2]];
    if (d.id === "desktop") return [p[0], 2.4, p[2]];
    if (d.id === "tablet") return [p[0], 1.2, p[2]];
    if (d.id === "phone") return [p[0], 2.1, p[2]];
    if (d.id === "smarthome") return [p[0], 1.5, p[2]];
    return [p[0], 2, p[2]];
  }
  function buildStatic(data) {
    var S = { boxes: [], cyls: [], discs: [], rings: [], paths: [], points: [], screens: [], glows: [] };
    var P = data.palette;
    // Floor + platform.
    S.discs.push({ c: [0, -0.55, 0], r: 46, color: P.floor });
    S.discs.push({ c: [0, 0, 0], r: data.platform.radius, color: P.platform });
    S.cyls.push({ c: [0, -0.28, 0], r: data.platform.radius, h: 0.55, color: "#0D1520", seg: 48, skipTop: true });
    data.platform.rings.forEach(function (r, i) {
      S.rings.push({ c: [0, 0.06, 0], r: r.radius, color: r.color, dashes: 64, on: r.dash, dir: i % 2 === 0 ? 1 : -1 });
    });
    // Console.
    var con = data.console, cp = con.position;
    S.cyls.push({ c: [cp[0], con.pedestal.height / 2, cp[2]], r: con.pedestal.radius, h: con.pedestal.height, color: P.body, seg: 32 });
    S.rings.push({ c: [cp[0], con.pedestal.height + 0.03, cp[2]], r: 1.7, color: P.cyan, dashes: 48, on: 0.6, dir: 1 });
    function addBox(center, size, yaw, color, emissive) {
      S.boxes.push({ c: center, s: size, yaw: yaw || 0, color: color, emissive: !!emissive });
    }
    addBox([cp[0], con.body.centerY, cp[2]], con.body.size, 0, P.body);
    addBox([cp[0], con.body.centerY, cp[2] + con.body.size[2] / 2 + 0.01], [con.body.size[0] - 0.4, 0.08, 0.02], 0, P.cyan, true);
    con.speakers.forEach(function (sp) {
      addBox([cp[0] + sp.offset[0], sp.offset[1], cp[2] + sp.offset[2]], sp.size, 0, "#0F1822");
    });
    S.screens.push({ c: [cp[0], con.screen.centerY, cp[2] + con.body.size[2] / 2 + 0.02], w: con.screen.size[0], h: con.screen.size[1], yaw: 0, color: P.cyan });
    S.glows.push({ c: [cp[0], 0.02, cp[2]], r: 2.6, color: P.cyan });
    // Bridge arch.
    var b = data.bridge, bp = b.position;
    b.posts.forEach(function (po) {
      addBox([bp[0] + po.offset[0], po.offset[1], bp[2] + po.offset[2]], po.size, 0, P.body);
    });
    addBox([bp[0] + b.beam.offset[0], b.beam.offset[1], bp[2] + b.beam.offset[2]], b.beam.size, 0, P.cyan, true);
    // Devices.
    data.devices.forEach(function (d, di) {
      var yaw = deviceYaw(d.position), p = d.position;
      function local(off, tiltX) {
        var q = rotY(off, yaw);
        return [p[0] + q[0], off[1], p[2] + q[2]];
      }
      if (d.body) {
        var bc = local([0, d.body.centerY, 0]);
        S.boxes.push({ c: bc, s: d.body.size, yaw: yaw, tiltX: d.body.tiltX || 0, color: P.device });
        // Thin emissive edge so a device reads as a device from behind,
        // where its inward-facing screen is not visible. No text, just trim.
        // Flat slabs get a front-edge bar (a full top face would render as a
        // bright slab from above); upright bodies get a top bar.
        var tx = d.body.tiltX || 0;
        var flat = d.body.size[1] < 0.3;
        var off = flat
          ? [0, d.body.size[1] / 2 + 0.04, d.body.size[2] / 2 - 0.04]
          : [0, d.body.size[1] / 2 + 0.04, 0];
        var cc = Math.cos(tx), ss = Math.sin(tx);
        var offT = [off[0], off[1] * cc - off[2] * ss, off[1] * ss + off[2] * cc];
        var tc = local(offT);
        S.boxes.push({ c: [tc[0], d.body.centerY + offT[1], tc[2]],
          s: [d.body.size[0], 0.06, flat ? 0.08 : d.body.size[2]],
          yaw: yaw, tiltX: tx, color: P.cyan, emissive: true });
      }
      if (d.screen) {
        var sc = local([0, d.screen.centerY, 0.14]);
        S.screens.push({ c: sc, w: d.screen.size[0], h: d.screen.size[1], yaw: yaw, tiltX: d.screen.tiltX || 0, color: P.cyan });
      }
      if (d.stand) {
        var st = local([0, 0.45, 0]);
        S.boxes.push({ c: st, s: [0.5, 0.9, 0.5], yaw: yaw, color: "#0F1822" });
      }
      if (d.tower) {
        var tw = local(d.tower.offset);
        S.boxes.push({ c: [tw[0], d.tower.offset[1], tw[2]], s: d.tower.size, yaw: yaw, color: "#0F1822" });
      }
      if (d.keyboard) {
        var kb = local(d.keyboard.offset);
        S.boxes.push({ c: [kb[0], d.keyboard.offset[1], kb[2]], s: d.keyboard.size, yaw: yaw, color: "#0F1822" });
      }
      if (d.hub) {
        S.cyls.push({ c: [p[0], d.hub.height / 2, p[2]], r: d.hub.radius, h: d.hub.height, color: P.device, seg: 24 });
        S.cyls.push({ c: [p[0], d.hub.height + 0.2, p[2]], r: d.hub.radius * 0.55, h: 0.4, color: P.body, seg: 24 });
        S.glows.push({ c: [p[0], 0.02, p[2]], r: 1.4, color: P.red });
      }
      if (d.bulb) {
        var bb = local(d.bulb.offset);
        S.points.push({ p: [bb[0], d.bulb.offset[1] + 1.4, bb[2]], color: P.red, r: 7, tw: 0 });
      }
      S.glows.push({ c: [p[0], 0.02, p[2]], r: 1.8, color: P.cyan });
      // Light path: console top -> device top, arched.
      var a = [0, 2.7, 0], cTop = deviceTop(d, data);
      var mid = [(a[0] + cTop[0]) / 2, Math.max(a[1], cTop[1]) + 2.2, (a[2] + cTop[2]) / 2];
      var pts = [];
      for (var i = 0; i <= 28; i++) pts.push(bez(a, mid, cTop, i / 28));
      S.paths.push({ id: d.id, pts: pts, top: cTop, color: P.cyan });
    });
    // Skyline: deterministic towers + windows.
    var sk = data.skyline;
    for (var i = 0; i < sk.count; i++) {
      var ang = (i / sk.count) * TAU + hash(i) * 0.22;
      var rad = sk.radiusMin + hash(i + 100) * (sk.radiusMax - sk.radiusMin);
      var tx = Math.cos(ang) * rad, tz = Math.sin(ang) * rad;
      var tw2 = 1.5 + hash(i + 200) * 1.5, th = sk.heightMin + hash(i + 300) * (sk.heightMax - sk.heightMin);
      S.boxes.push({ c: [tx, th / 2 - 0.5, tz], s: [tw2, th, tw2], yaw: -ang, color: P.skyline });
      if (hash(i + 400) > 0.75) S.points.push({ p: [tx, th - 0.3, tz], color: P.red, r: 6, tw: i + 1 });
      var rows = Math.floor(th / 1.6), cols = 3;
      for (var rI = 0; rI < rows; rI++) {
        for (var cI = 0; cI < cols; cI++) {
          if (hash(i * 131 + rI * 17 + cI * 7) < 0.45) {
            var wx = tx + (cI - 1) * tw2 * 0.28, wy = 0.6 + rI * 1.6, wz = tz;
            var toward = norm([-tx, 0, -tz]);
            wx += toward[0] * (tw2 / 2 + 0.02); wz += toward[2] * (tw2 / 2 + 0.02);
            S.points.push({ p: [wx, wy, wz], color: hash(i + rI + cI) > 0.85 ? "#FFE9A8" : P.cyan, r: 3, tw: (i + rI * 3 + cI) % 7 + 1 });
          }
        }
      }
    }
    // Stars.
    for (var sI = 0; sI < data.stars; sI++) {
      var sa = hash(sI) * TAU, se = 0.25 + hash(sI + 500) * 1.1;
      var sr = 70;
      S.points.push({ p: [Math.cos(sa) * Math.cos(se) * sr, Math.sin(se) * sr, Math.sin(sa) * Math.cos(se) * sr], color: "#CFEFFF", r: 2, tw: 0 });
    }
    return S;
  }
  function boxFaces(b) {
    var hw = b.s[0] / 2, hh = b.s[1] / 2, hd = b.s[2] / 2;
    var corners = [];
    [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].forEach(function (k) {
      var p = [k[0] * hw, k[1] * hh, k[2] * hd];
      if (b.tiltX) {
        var c = Math.cos(b.tiltX), s = Math.sin(b.tiltX);
        p = [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
      }
      p = rotY(p, b.yaw);
      corners.push(add(p, b.c));
    });
    // Outward-wound quads: [front(+z), back, right, left, top, bottom].
    return [
      { v: [corners[4], corners[5], corners[6], corners[7]], n: [0, 0, 1] },
      { v: [corners[1], corners[0], corners[3], corners[2]], n: [0, 0, -1] },
      { v: [corners[5], corners[1], corners[2], corners[6]], n: [1, 0, 0] },
      { v: [corners[0], corners[4], corners[7], corners[3]], n: [-1, 0, 0] },
      { v: [corners[3], corners[7], corners[6], corners[2]], n: [0, 1, 0] },
      { v: [corners[0], corners[1], corners[5], corners[4]], n: [0, -1, 0] }
    ].map(function (f) {
      var n = rotY(f.n, b.yaw);
      return { v: f.v, n: n };
    });
  }
  function cylFaces(cyl, skipTop) {
    var faces = [], seg = cyl.seg || 24;
    for (var i = 0; i < seg; i++) {
      var a0 = (i / seg) * TAU, a1 = ((i + 1) / seg) * TAU;
      var x0 = cyl.c[0] + Math.cos(a0) * cyl.r, z0 = cyl.c[2] + Math.sin(a0) * cyl.r;
      var x1 = cyl.c[0] + Math.cos(a1) * cyl.r, z1 = cyl.c[2] + Math.sin(a1) * cyl.r;
      faces.push({ v: [[x0, cyl.c[1] - cyl.h / 2, z0], [x1, cyl.c[1] - cyl.h / 2, z1], [x1, cyl.c[1] + cyl.h / 2, z1], [x0, cyl.c[1] + cyl.h / 2, z0]], n: [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)] });
    }
    if (skipTop) return faces;
    var top = [];
    for (var j = seg; j >= 0; j--) {
      var a = (j / seg) * TAU;
      top.push([cyl.c[0] + Math.cos(a) * cyl.r, cyl.c[1] + cyl.h / 2, cyl.c[2] + Math.sin(a) * cyl.r]);
    }
    faces.push({ v: top, n: [0, 1, 0] });
    return faces;
  }
  function taskState(data, t) {
    var tc = data.taskCycle, cyc = t % tc.period, idx = Math.floor(t / tc.period) % tc.order.length;
    var id = tc.order[idx];
    if (cyc < tc.travel) return { phase: "travel", device: id, p: easeIO(cyc / tc.travel) };
    if (cyc < tc.travel + tc.ack) return { phase: "ack", device: id, p: (cyc - tc.travel) / tc.ack };
    return { phase: "idle", device: id, p: 0 };
  }
  function render(ctx, W, H, data, S, opts) {
    var t = opts.t || 0, quality = opts.quality === 0 ? 0 : 1;
    var proj = opts.projector || "persp";
    var cam;
    if (proj === "equirect") {
      cam = { pos: opts.camPos || [0, 3.6, 0] };
    } else {
      var yaw = opts.yaw, pitch = opts.pitch, dist = opts.dist, tgt = opts.target || [0, 1.2, 0];
      var cp = Math.cos(pitch), sp = Math.sin(pitch);
      var pos = [tgt[0] + dist * Math.sin(yaw) * cp, tgt[1] + dist * sp, tgt[2] + dist * Math.cos(yaw) * cp];
      var f = norm(sub(tgt, pos));
      var r = norm(cross(f, [0, 1, 0]));
      var u = cross(r, f);
      cam = { pos: pos, f: f, r: r, u: u, focal: H * 1.05 };
    }
    // Background.
    if (proj === "equirect") {
      var bgE = ctx.createLinearGradient(0, 0, 0, H);
      bgE.addColorStop(0, "#02040A"); bgE.addColorStop(0.5, "#0E2233"); bgE.addColorStop(0.55, "#0A1420"); bgE.addColorStop(1, "#05080F");
      ctx.fillStyle = bgE; ctx.fillRect(0, 0, W, H);
      // Ground centered under the camera maps to full-width bands, not to a
      // fan polygon (a fan would collapse at the pole). Fill them exactly
      // from the camera height: floor disc (r=46) and platform disc (r=9).
      var camH = cam.pos[1];
      var vFloor = (0.5 + Math.atan(camH / 46) / Math.PI) * H;
      var vPlat = (0.5 + Math.atan(camH / 9) / Math.PI) * H;
      ctx.fillStyle = data.palette.floor; ctx.fillRect(0, vFloor, W, H - vFloor);
      ctx.fillStyle = data.palette.platform; ctx.fillRect(0, vPlat, W, H - vPlat);
    } else {
      var bg = ctx.createRadialGradient(W / 2, H * 0.42, 10, W / 2, H * 0.5, Math.max(W, H) * 0.75);
      bg.addColorStop(0, "#0E2233"); bg.addColorStop(0.5, "#080B10"); bg.addColorStop(1, "#02040A");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    }
    function projectP(p) {
      if (proj === "equirect") {
        var d = sub(p, cam.pos), rl = len(d);
        if (rl < 0.01) return null;
        var lon = Math.atan2(d[0], d[2]), lat = Math.asin(clamp(d[1] / rl, -1, 1));
        return { x: (lon / Math.PI + 1) / 2 * W, y: (0.5 - lat / Math.PI) * H, d: rl, lon: lon };
      }
      var vx = dot(sub(p, cam.pos), cam.r), vy = dot(sub(p, cam.pos), cam.u), vz = dot(sub(p, cam.pos), cam.f);
      if (vz < 0.3) return null;
      var s = cam.focal / vz;
      return { x: W / 2 + vx * s, y: H / 2 - vy * s, d: vz, vx: vx, vy: vy, vz: vz };
    }
    function faceVisible(face, center) {
      if (proj === "equirect") return dot(face.n, sub(center, cam.pos)) < 0;
      var nv = [dot(face.n, cam.r), dot(face.n, cam.u), dot(face.n, cam.f)];
      return nv[2] < 0;
    }
    var items = [];
    function pushFace(verts3, normal, color, emissive, shadeF) {
      var center = [0, 0, 0];
      verts3.forEach(function (v) { center = add(center, mul(v, 1 / verts3.length)); });
      if (!faceVisible({ n: normal }, center)) return;
      var pts = [], lons = [], ok = true;
      verts3.forEach(function (v) {
        var q = projectP(v);
        if (!q) { ok = false; return; }
        pts.push(q); if (q.lon !== undefined) lons.push(q.lon);
      });
      if (!ok) return;
      var depth = 0;
      pts.forEach(function (q) { depth += q.d; });
      depth /= pts.length;
      var fill = emissive ? color : shade(color, shadeF === undefined ? (0.62 + 0.38 * Math.max(0, normal[1])) : shadeF);
      items.push({ d: depth, kind: "face", pts: pts, lons: lons, v3: verts3, n: normal, fill: fill });
    }
    function pushSeg(a, b, color, width, alpha) {
      var qa = projectP(a), qb = projectP(b);
      if (!qa || !qb) return;
      items.push({ d: (qa.d + qb.d) / 2, kind: "seg", a: qa, b: qb, color: color, width: width, alpha: alpha });
    }
    function pushPoint(p, color, radius, alpha) {
      var q = projectP(p);
      if (!q) return;
      items.push({ d: q.d, kind: "point", q: q, color: color, r: radius, alpha: alpha });
    }
    // Floor sheen + device shadows (2D, under geometry).
    var floorC = projectP([0, 0.02, 0]);
    if (floorC && proj === "persp") {
      var g = ctx.createRadialGradient(floorC.x, floorC.y, 10, floorC.x, floorC.y, Math.max(W, H) * 0.42);
      g.addColorStop(0, "rgba(0,229,255,0.10)"); g.addColorStop(1, "rgba(0,229,255,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    S.discs.forEach(function (dsc) {
      if (proj === "equirect") return; // covered by the band fills above
      var fan = [];
      for (var i = 0; i <= 48; i++) {
        var a = (i / 48) * TAU;
        fan.push([dsc.c[0] + Math.cos(a) * dsc.r, dsc.c[1], dsc.c[2] + Math.sin(a) * dsc.r]);
      }
      pushFace(fan, [0, 1, 0], dsc.color, false, 1);
    });
    S.cyls.forEach(function (cyl) {
      cylFaces(cyl, proj === "equirect" && cyl.skipTop).forEach(function (f) { pushFace(f.v, f.n, cyl.color, false); });
    });
    S.boxes.forEach(function (b) {
      boxFaces(b).forEach(function (f) { pushFace(f.v, f.n, b.color, b.emissive); });
    });
    S.glows.forEach(function (gl) {
      var q = projectP([gl.c[0], gl.c[1], gl.c[2]]);
      if (q && proj === "persp") {
        ctx.save();
        ctx.globalAlpha = 0.10; ctx.fillStyle = gl.color;
        ctx.beginPath(); ctx.ellipse(q.x, q.y, 90, 22, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
    });
    // Rings (rotating dashes, periodic in 20s).
    S.rings.forEach(function (ring, ri) {
      var rot = TAU * (t / 20) * ring.dir;
      var N = 128;
      for (var i = 0; i < N; i++) {
        var a0 = (i / N) * TAU, a1 = ((i + 1) / N) * TAU;
        var phase = ((a0 + rot) / TAU * ring.dashes) % 1;
        if (phase > ring.on) continue;
        pushSeg([ring.c[0] + Math.cos(a0) * ring.r, ring.c[1], ring.c[2] + Math.sin(a0) * ring.r],
                [ring.c[0] + Math.cos(a1) * ring.r, ring.c[1], ring.c[2] + Math.sin(a1) * ring.r], ring.color, 1.5, 0.8);
      }
    });
    // Screens: emissive quads + scanlines.
    S.screens.forEach(function (sc) {
      var hw = sc.w / 2, hh = sc.h / 2;
      var corners = [[-hw, -hh, 0], [hw, -hh, 0], [hw, hh, 0], [-hw, hh, 0]].map(function (k) {
        var p = [k[0], k[1], k[2]];
        if (sc.tiltX) {
          var c = Math.cos(sc.tiltX), s = Math.sin(sc.tiltX);
          p = [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
        }
        return add(rotY(p, sc.yaw), sc.c);
      });
      var n = rotY([0, 0, 1], sc.yaw);
      pushFace(corners, n, sc.color, true);
      if (quality === 1) {
        for (var li = 1; li <= 3; li++) {
          var fy = -hh + (li / 4) * sc.h;
          function scanPt(sx) {
            var p = [sx, fy, 0.02];
            if (sc.tiltX) {
              var cc = Math.cos(sc.tiltX), ss = Math.sin(sc.tiltX);
              p = [p[0], p[1] * cc - p[2] * ss, p[1] * ss + p[2] * cc];
            }
            return add(rotY(p, sc.yaw), sc.c);
          }
          pushSeg(scanPt(-hw), scanPt(hw), sc.color, 1, 0.35);
        }
      }
    });
    // Light paths + travelling pulses (integer cycles per 20s: seamless).
    var selected = opts.selected || null;
    S.paths.forEach(function (path) {
      var isSel = selected === path.id;
      for (var i = 0; i < path.pts.length - 1; i++) {
        pushSeg(path.pts[i], path.pts[i + 1], path.color, isSel ? 2.5 : 1.5, isSel ? 0.9 : 0.55);
      }
      for (var k = 0; k < 2; k++) {
        var ph = (t * 0.25 + k * 0.5 + path.pts.length * 0.01) % 1;
        var idx = ph * (path.pts.length - 1), i0 = Math.floor(idx), fr = idx - i0;
        var pA = path.pts[Math.min(i0, path.pts.length - 1)], pB = path.pts[Math.min(i0 + 1, path.pts.length - 1)];
        pushPoint([lerp(pA[0], pB[0], fr), lerp(pA[1], pB[1], fr), lerp(pA[2], pB[2], fr)], path.color, isSel ? 6 : 4, 0.95);
      }
    });
    // Task animation: hub -> device -> ack receipt card.
    // Interactive override (Send illustrative task button) replaces the
    // timeline task with a caller-supplied phase; otherwise the 20 s loop
    // timeline drives it, so capture reproduces the same sequence.
    var task = opts.taskOverride || taskState(data, t);
    var pathFor = null;
    S.paths.forEach(function (p) { if (p.id === task.device) pathFor = p; });
    if (pathFor && task.phase === "travel") {
      var fi = task.p * (pathFor.pts.length - 1), j0 = Math.floor(fi), jf = fi - j0;
      var qA = pathFor.pts[Math.min(j0, pathFor.pts.length - 1)], qB = pathFor.pts[Math.min(j0 + 1, pathFor.pts.length - 1)];
      pushPoint([lerp(qA[0], qB[0], jf), lerp(qA[1], qB[1], jf) + 0.15, lerp(qA[2], qB[2], jf)], "#FFFFFF", 8, 1);
    }
    if (pathFor && task.phase === "ack") {
      var top = pathFor.top, sc2 = Math.min(1, task.p / 0.3);
      var cardC = [top[0], top[1] + 1.1 * sc2, top[2]];
      var right, up;
      if (proj === "equirect") {
        var dir = norm(sub(cardC, cam.pos));
        right = norm(cross(dir, [0, 1, 0])); up = cross(right, dir);
      } else {
        right = cam.r; up = cam.u;
      }
      var hw2 = 0.55 * sc2, hh2 = 0.35 * sc2;
      var card = [add(add(cardC, mul(right, -hw2)), mul(up, -hh2)), add(add(cardC, mul(right, hw2)), mul(up, -hh2)), add(add(cardC, mul(right, hw2)), mul(up, hh2)), add(add(cardC, mul(right, -hw2)), mul(up, hh2))];
      pushFace(card, norm(sub(cam.pos, cardC)), "#E8FBFF", true);
      var ck0 = add(add(cardC, mul(right, -0.28 * sc2)), mul(up, -0.02 * sc2));
      var ck1 = add(add(cardC, mul(right, -0.05 * sc2)), mul(up, -0.18 * sc2));
      var ck2 = add(add(cardC, mul(right, 0.3 * sc2)), mul(up, 0.16 * sc2));
      pushSeg(ck0, ck1, "#00E5FF", 2.5, 1);
      pushSeg(ck1, ck2, "#00E5FF", 2.5, 1);
    }
    // Skyline windows + stars (twinkle periodic in 20s).
    S.points.forEach(function (pt) {
      var a = 0.85;
      if (pt.tw) a = 0.55 + 0.45 * Math.sin(TAU * (t * pt.tw / 20) + pt.tw);
      pushPoint(pt.p, pt.color, pt.r, clamp(a, 0.15, 1));
    });
    // Painter's algorithm: far -> near.
    items.sort(function (a, b) { return b.d - a.d; });
    function drawFace(item) {
      var pts = item.pts;
      if (proj === "equirect" && item.v3 && item.v3.length >= 3) {
        // Equirectangular faces need seam and pole handling.
        // Seam: an edge whose longitude jumps by more than PI crosses the
        // +/-PI branch cut. Split the face into SEPARATE polygons at each
        // crossing (exact 3D crossing point by bisection on longitude, since
        // longitude along an edge is not linear in t). Drawing one path
        // through both frame edges would streak across the whole frame.
        // Pole: a horizontal face containing the camera's vertical axis in
        // its footprint winds once around the pole, so its image is the
        // region from its rim curve down to the image edge (nadir) or up
        // to the top edge (zenith). It is drawn as two cap polygons, one
        // per side of the seam, with subdivided rim edges so the rim curve
        // (which dips sharply near the seam) is followed, not chorded.
        function lonOf(p) { return Math.atan2(p[0] - cam.pos[0], p[2] - cam.pos[2]); }
        function unwrap(raw, ref) {
          while (raw - ref > Math.PI) raw -= TAU;
          while (raw - ref < -Math.PI) raw += TAU;
          return raw;
        }
        function crossPoint(a3, b3) {
          var la = lonOf(a3), lb = lonOf(b3);
          var target = (la > 0 && lb < 0) ? Math.PI : -Math.PI;
          var lo = 0, hi = 1;
          for (var it = 0; it < 24; it++) {
            var mid = (lo + hi) / 2;
            var pm = [lerp(a3[0], b3[0], mid), lerp(a3[1], b3[1], mid), lerp(a3[2], b3[2], mid)];
            var fm = unwrap(lonOf(pm), la);
            if ((target > 0 && fm < target) || (target < 0 && fm > target)) lo = mid; else hi = mid;
          }
          var tc = (lo + hi) / 2;
          var pc = [lerp(a3[0], b3[0], tc), lerp(a3[1], b3[1], tc), lerp(a3[2], b3[2], tc)];
          var dc = sub(pc, cam.pos), rc = len(dc);
          var vc = (0.5 - Math.asin(clamp(dc[1] / rc, -1, 1)) / Math.PI) * H;
          return { vc: vc, exitX: target > 0 ? W : 0, entryX: target > 0 ? 0 : W };
        }
        function insideXZ(v3, x, z) {
          var inside = false;
          for (var i = 0, j = v3.length - 1; i < v3.length; j = i++) {
            var xi = v3[i][0], zi = v3[i][2], xj = v3[j][0], zj = v3[j][2];
            if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) inside = !inside;
          }
          return inside;
        }
        var isPole = false, capV = H;
        if (item.n && Math.abs(item.n[1]) > 0.9 && insideXZ(item.v3, cam.pos[0], cam.pos[2])) {
          var cy = 0;
          item.v3.forEach(function (v) { cy += v[1]; });
          cy /= item.v3.length;
          isPole = true;
          capV = cy < cam.pos[1] ? H : 0;
        }
        if (isPole) {
          // Subdivided rim, split into chains at the seam.
          var chains = [], cur = null, prevU = null, prev3 = null;
          var nv = item.v3.length;
          for (var e = 0; e < nv; e++) {
            var a3 = item.v3[e], b3 = item.v3[(e + 1) % nv];
            for (var s = 0; s < 16; s++) {
              var p3 = [lerp(a3[0], b3[0], s / 16), lerp(a3[1], b3[1], s / 16), lerp(a3[2], b3[2], s / 16)];
              var d3 = sub(p3, cam.pos), r3 = len(d3);
              var lon = lonOf(p3);
              var u = ((lon + Math.PI) % TAU + TAU) % TAU / TAU * W;
              var vv = (0.5 - Math.asin(clamp(d3[1] / r3, -1, 1)) / Math.PI) * H;
              var pt = { x: u, y: vv };
              if (cur === null) { cur = [pt]; }
              else if (Math.abs(u - prevU) > W / 2) {
                var cp = crossPoint(prev3, p3);
                cur.push({ x: cp.exitX, y: cp.vc });
                chains.push(cur);
                cur = [{ x: cp.entryX, y: cp.vc }, pt];
              } else cur.push(pt);
              prevU = u; prev3 = p3;
            }
          }
          if (cur && cur.length) chains.push(cur);
          if (chains.length === 2) {
            chains.forEach(function (ch) {
              var poly = ch.slice();
              poly.push({ x: ch[ch.length - 1].x >= W / 2 && ch[0].x < W / 2 ? W : ch[ch.length - 1].x, y: capV });
              poly.push({ x: ch[0].x, y: capV });
              drawPoly(poly, item.fill);
            });
            return;
          }
          // Fall through to the split-polygon path if the rim did not
          // split into exactly two chains.
        }
        var polys = [], curP = [pts[0]];
        var n = pts.length;
        for (var i = 0; i < n; i++) {
          var j = (i + 1) % n;
          var a3b = item.v3[i], b3b = item.v3[j];
          var la = lonOf(a3b), lb = lonOf(b3b);
          if (Math.abs(lb - la) > Math.PI) {
            var cp2 = crossPoint(a3b, b3b);
            curP.push({ x: cp2.exitX, y: cp2.vc });
            polys.push(curP);
            curP = [{ x: cp2.entryX, y: cp2.vc }];
          }
          if (j !== 0) curP.push(pts[j]);
        }
        polys.push(curP);
        polys.forEach(function (poly) { drawPoly(poly, item.fill); });
        return;
      }
      drawPoly(pts, item.fill);
    }
    function drawPoly(pts, fill) {
      ctx.fillStyle = fill;
      ctx.beginPath();
      pts.forEach(function (q, i) { if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y); });
      ctx.closePath(); ctx.fill();
    }
    items.forEach(function (item) {
      if (item.kind === "face") drawFace(item);
      else if (item.kind === "seg") {
        if (proj === "equirect") {
          var la = item.a.lon, lb = item.b.lon;
          if (la !== undefined && lb !== undefined && Math.abs(la - lb) > Math.PI) {
            // Exact seam crossing: unwrap lb to the continuous branch, find
            // where the segment crosses lon = +PI or -PI, and draw the two
            // halves to the frame edges at the interpolated height.
            var lbU = lb, cross;
            if (la > 0 && lb < 0) { lbU = lb + TAU; cross = Math.PI; }
            else { lbU = lb - TAU; cross = -Math.PI; }
            var tt = (cross - la) / (lbU - la);
            tt = Math.max(0, Math.min(1, tt));
            var yc = item.a.y + (item.b.y - item.a.y) * tt;
            ctx.strokeStyle = item.color; ctx.globalAlpha = item.alpha; ctx.lineWidth = item.width;
            ctx.beginPath();
            if (cross > 0) { ctx.moveTo(item.a.x, item.a.y); ctx.lineTo(W, yc); }
            else { ctx.moveTo(item.a.x, item.a.y); ctx.lineTo(0, yc); }
            ctx.stroke();
            ctx.beginPath();
            if (cross > 0) { ctx.moveTo(0, yc); ctx.lineTo(item.b.x, item.b.y); }
            else { ctx.moveTo(W, yc); ctx.lineTo(item.b.x, item.b.y); }
            ctx.stroke();
            ctx.globalAlpha = 1;
            return;
          }
        }
        ctx.strokeStyle = item.color; ctx.globalAlpha = item.alpha; ctx.lineWidth = item.width;
        ctx.beginPath(); ctx.moveTo(item.a.x, item.a.y); ctx.lineTo(item.b.x, item.b.y); ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (item.kind === "point") {
        var px = item.q.x;
        if (proj === "equirect") px = ((px % W) + W) % W;
        ctx.globalAlpha = item.alpha; ctx.fillStyle = item.color;
        ctx.fillRect(px - item.r / 2, item.q.y - item.r / 2, item.r, item.r);
        ctx.globalAlpha = 1;
      }
    });
    return { task: task };
  }
  function projectPoint(data, p, cam, W, H) {
    var yaw = cam.yaw, pitch = cam.pitch, dist = cam.dist, tgt = cam.target || [0, 1.2, 0];
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    var pos = [tgt[0] + dist * Math.sin(yaw) * cp, tgt[1] + dist * sp, tgt[2] + dist * Math.cos(yaw) * cp];
    var f = norm(sub(tgt, pos));
    var r = norm(cross(f, [0, 1, 0]));
    var u = cross(r, f);
    var vx = dot(sub(p, pos), r), vy = dot(sub(p, pos), u), vz = dot(sub(p, pos), f);
    if (vz < 0.3) return { behind: true };
    var s = (H * 1.05) / vz;
    return { x: W / 2 + vx * s, y: H / 2 - vy * s, behind: false, depth: vz };
  }
  global.HeroEngine = {
    version: "1.0.0",
    buildStatic: buildStatic,
    render: render,
    taskState: taskState,
    projectPoint: projectPoint,
    deviceTop: deviceTop
  };
})(typeof window !== "undefined" ? window : globalThis);
