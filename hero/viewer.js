/* Raw-WebGL equirectangular viewer. No library, no remote code.
   The fragment shader maps each output pixel to a ray, then to
   equirectangular UV: u = (atan2(dir.x, dir.z) / PI + 1) / 2,
   v = 0.5 - asin(dir.y) / PI. The video is the texture. */
(function () {
  "use strict";
  var cv = document.getElementById("glCanvas");
  var video = document.getElementById("video360");
  var gl = cv.getContext("webgl", { preserveDrawingBuffer: true }) || cv.getContext("experimental-webgl", { preserveDrawingBuffer: true });
  if (!gl) { document.getElementById("glFallback").classList.remove("hidden"); return; }
  // The shared sheet hides stage canvases until their page activates
  // them (the hero page reveals its canvas on Explore). The viewer page
  // is the activation: show the canvas once WebGL is confirmed.
  cv.style.display = "block";
  var yaw = 0, pitch = 0.1, fov = 1.35, playing = true;
  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { throw new Error(gl.getShaderInfoLog(s)); }
    return s;
  }
  var prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, "attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }"));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, [
    "precision mediump float; varying vec2 vUv; uniform sampler2D tex; uniform float yaw; uniform float pitch; uniform float fov; uniform float aspect;",
    "void main(){",
    "  vec2 ndc = vUv * 2.0 - 1.0;",
    "  float t = tan(fov * 0.5);",
    "  vec3 d = normalize(vec3(ndc.x * aspect * t, ndc.y * t, -1.0));",
    "  float cp = cos(pitch), sp = sin(pitch);",
    "  d = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);",
    "  float cy = cos(yaw), sy = sin(yaw);",
    "  d = vec3(d.x * cy + d.z * sy, d.y, -d.x * sy + d.z * cy);",
    "  float u = (atan(d.x, d.z) / 3.14159265 + 1.0) * 0.5;",
    "  float v = 0.5 - asin(clamp(d.y, -1.0, 1.0)) / 3.14159265;",
    "  gl_FragColor = texture2D(tex, vec2(u, v));",
    "}"
  ].join("\n")));
  gl.linkProgram(prog); gl.useProgram(prog);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  function frame() {
    if (video.readyState >= 2) {
      try {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      } catch (e) { /* texture upload waits for a decodable frame */ }
    }
    gl.viewport(0, 0, cv.width, cv.height);
    gl.uniform1f(gl.getUniformLocation(prog, "yaw"), yaw);
    gl.uniform1f(gl.getUniformLocation(prog, "pitch"), pitch);
    gl.uniform1f(gl.getUniformLocation(prog, "fov"), fov);
    gl.uniform1f(gl.getUniformLocation(prog, "aspect"), cv.width / cv.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  video.muted = true;
  var pv = video.play();
  if (pv && pv.catch) pv.catch(function () { /* user gesture starts it */ });
  cv.addEventListener("click", function () { if (video.paused) video.play(); });
  var drag = null;
  cv.addEventListener("pointerdown", function (e) { drag = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", function (e) {
    if (!drag) return;
    yaw += (e.clientX - drag.x) * 0.005;
    pitch = Math.max(-1.2, Math.min(1.2, pitch + (e.clientY - drag.y) * 0.005));
    drag = { x: e.clientX, y: e.clientY };
  });
  cv.addEventListener("pointerup", function () { drag = null; });
  cv.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") yaw -= 0.12;
    if (e.key === "ArrowRight") yaw += 0.12;
    if (e.key === "ArrowUp") pitch = Math.min(1.2, pitch + 0.08);
    if (e.key === "ArrowDown") pitch = Math.max(-1.2, pitch - 0.08);
    if (e.key === "+" || e.key === "=") fov = Math.max(0.5, fov * 0.9);
    if (e.key === "-") fov = Math.min(2.2, fov * 1.1);
  });
  document.getElementById("pause360").addEventListener("click", function () {
    playing = !playing;
    if (playing) video.play(); else video.pause();
    this.textContent = playing ? "Pause motion" : "Resume motion";
  });
  document.getElementById("reset360").addEventListener("click", function () { yaw = 0; pitch = 0.1; fov = 1.35; });
  requestAnimationFrame(frame);
})();
