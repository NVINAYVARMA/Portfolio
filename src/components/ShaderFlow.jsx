import { useEffect, useRef } from "react";

const VS = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FS = `
precision highp float;
uniform vec2 uR;
uniform float uT;
uniform vec2 uV;
uniform float uS;
uniform float uTw;
uniform float uDe;
uniform float uMs;
uniform float uB;
uniform int uIt;
uniform vec3 uColorLow;
uniform vec3 uColorHigh;
uniform vec3 uBgColor;
uniform vec4 uFadeShape;

float h(vec2 p){
  return sin(p.x + sin(p.y + uT * uV.x)) * sin(p.y * p.x * 0.1 + uT * uV.y);
}

float fadeAlpha(float d){
  float t = clamp(1.0 - d, 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

void main(){
  vec2 frag = gl_FragCoord.xy / uR;
  vec2 p = frag - 0.5;
  p.x *= uR.x / uR.y;
  p *= uS;

  float ms = uT * uMs * 0.1;
  vec2 d = vec2(sin(ms), cos(ms)) * 0.1;
  float kt = uTw * 0.01;
  float kd = 1.0 / uDe;

  vec2 e = vec2(0.05, 0.0);
  vec2 r = vec2(0.0);
  for (int i = 0; i < 20; i++){
    if (i >= uIt) break;
    float a = h(p);
    float b = h(p + e.xy);
    float c = h(p + e.yx);
    vec2 q = vec2(b - a, c - a) * 20.0;
    p += vec2(-q.y, q.x) * kt + q * kd + d;
    r = q;
  }

  float t = clamp(length(r) * 0.5, 0.0, 1.0);
  vec3 col = mix(uColorLow, uColorHigh, t) * uB;

  vec2 ndc = vec2(frag.x, 1.0 - frag.y);
  float aspect = uR.x / uR.y;
  float dx = ((ndc.x - uFadeShape.x) * aspect) / uFadeShape.z;
  float dy = (ndc.y - uFadeShape.y) / uFadeShape.w;
  float fa = fadeAlpha(sqrt(dx * dx + dy * dy));

  vec3 outColor = mix(uBgColor, col, fa);
  gl_FragColor = vec4(outColor, 1.0);
}
`;

export default function ShaderFlow({
  className = "",
  flowSpeed = [0.08, 0.14],
  iterations = 12,
  scale = 5.5,
  brightness = 0.95,
  colorLow = [0.12, 0.15, 0.22],
  colorHigh = [0.42, 0.38, 0.35],
  bgColor = [0.04, 0.04, 0.047],
  fadeShape = [0.5, 0.0, 1.4, 0.7],
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vert = createShader(gl, gl.VERTEX_SHADER, VS);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Program error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Quad geometry: two triangles
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uR = gl.getUniformLocation(program, "uR");
    const uT = gl.getUniformLocation(program, "uT");
    const uV = gl.getUniformLocation(program, "uV");
    const uS = gl.getUniformLocation(program, "uS");
    const uTw = gl.getUniformLocation(program, "uTw");
    const uDe = gl.getUniformLocation(program, "uDe");
    const uMs = gl.getUniformLocation(program, "uMs");
    const uB = gl.getUniformLocation(program, "uB");
    const uIt = gl.getUniformLocation(program, "uIt");
    const uColorLow = gl.getUniformLocation(program, "uColorLow");
    const uColorHigh = gl.getUniformLocation(program, "uColorHigh");
    const uBgColor = gl.getUniformLocation(program, "uBgColor");
    const uFadeShape = gl.getUniformLocation(program, "uFadeShape");

    gl.uniform2f(uV, flowSpeed[0], flowSpeed[1]);
    gl.uniform1f(uS, scale);
    gl.uniform1f(uTw, 0.4);
    gl.uniform1f(uDe, 30.0);
    gl.uniform1f(uMs, 0.06);
    gl.uniform1f(uB, brightness);
    gl.uniform1i(uIt, iterations);
    gl.uniform3f(uColorLow, colorLow[0], colorLow[1], colorLow[2]);
    gl.uniform3f(uColorHigh, colorHigh[0], colorHigh[1], colorHigh[2]);
    gl.uniform3f(uBgColor, bgColor[0], bgColor[1], bgColor[2]);
    gl.uniform4f(
      uFadeShape,
      fadeShape[0],
      fadeShape[1],
      fadeShape[2],
      fadeShape[3]
    );

    let animationId = null;
    let startTime = performance.now();
    let isVisible = true;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    resize();

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    function render(now) {
      if (isVisible) {
        const elapsed = (now - startTime) * 0.001;
        gl.uniform2f(uR, canvas.width, canvas.height);
        gl.uniform1f(uT, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationId = requestAnimationFrame(render);
    }
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      gl.deleteBuffer(posBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [flowSpeed, iterations, scale, brightness, colorLow, colorHigh, bgColor, fadeShape]);

  return (
    <canvas
      ref={canvasRef}
      className={`shader-flow-canvas ${className}`}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
