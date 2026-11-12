"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { generateShapes, SHAPE_COUNT, SHAPE_WIDTH } from "@/lib/shapes";
import styles from "./ParticleField.module.css";

/**
 * One fixed WebGL canvas behind the page. Sections mark which shape they want
 * with `data-shape="n"`; the sculpture morphs between neighbouring shapes as
 * the next section scrolls in.
 */

type Layout = { x: number; y: number; s: number; o: number };

// x / y are fractions of the half-viewport; s is a scale; o is opacity.
const DESKTOP: Layout[] = [
  { x: 0, y: 0.04, s: 1.0, o: 1 }, // orb
  { x: 0.46, y: 0, s: 0.95, o: 1 }, // ielts
  { x: -0.47, y: 0, s: 0.86, o: 1 }, // ai
  { x: 0.46, y: 0, s: 0.86, o: 1 }, // orbit
  { x: -0.46, y: 0.02, s: 0.74, o: 1 }, // street
  { x: 0.46, y: 0, s: 0.8, o: 1 }, // watch
  { x: 0.3, y: 0, s: 1.15, o: 0.3 }, // galaxy
  { x: 0, y: 0.48, s: 1, o: 1 }, // text
];

const MOBILE: Layout[] = [
  { x: -0.32, y: 0.45, s: 0.62, o: 0.95 },
  { x: 0, y: 0.5, s: 0.55, o: 0.85 },
  { x: 0, y: 0.5, s: 0.55, o: 0.85 },
  { x: 0, y: 0.5, s: 0.5, o: 0.85 },
  { x: 0, y: 0.5, s: 0.5, o: 0.85 },
  { x: 0, y: 0.5, s: 0.52, o: 0.85 },
  { x: 0, y: 0.1, s: 0.75, o: 0.16 },
  { x: 0, y: 0.5, s: 1, o: 1 },
];

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uIntro;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uMotion;
  uniform vec2 uMouse;
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute vec3 aP4;
  attribute vec3 aP5;
  attribute vec3 aP6;
  attribute vec3 aP7;
  attribute float aRandom;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 P[8];
    P[0] = position; P[1] = aP1; P[2] = aP2; P[3] = aP3;
    P[4] = aP4; P[5] = aP5; P[6] = aP6; P[7] = aP7;

    float base = floor(uMorph);
    int ib = int(base);
    int in2 = min(ib + 1, 7);
    float f = uMorph - base;
    float fl = smoothstep(aRandom * 0.45, aRandom * 0.45 + 0.55, f);
    vec3 pos = mix(P[ib], P[in2], fl);

    // Turbulence: strongest mid-morph, a gentle breath otherwise.
    float chaos = sin(3.14159 * fl) * 0.6 * uMotion;
    vec3 n = vec3(
      sin(pos.y * 2.7 + uTime * 0.9 + aRandom * 12.0),
      sin(pos.z * 2.3 + uTime * 0.7 + aRandom * 7.0),
      sin(pos.x * 2.5 + uTime * 1.1 + aRandom * 9.0)
    );
    pos += n * (chaos + 0.022 * uMotion);

    // Intro: particles stream in from a wide shell.
    vec3 dir = normalize(vec3(sin(aRandom * 91.7), cos(aRandom * 53.3), sin(aRandom * 27.1 + 1.0)) + 0.0001);
    float ie = smoothstep(aRandom * 0.5, aRandom * 0.5 + 0.5, uIntro);
    pos = mix(dir * (7.0 + aRandom * 5.0), pos, ie);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Cursor ripple in view space.
    vec2 d = mv.xy - uMouse;
    float dist = length(d);
    mv.xy += normalize(d + 0.0001) * (1.0 - smoothstep(0.0, 0.9, dist)) * 0.32 * uMotion;

    gl_Position = projectionMatrix * mv;

    float twinkle = 0.7 + 0.3 * sin(uTime * 2.2 + aRandom * 40.0);
    float scale = 0.55 + aRandom * 1.1;
    gl_PointSize = uSize * scale * twinkle * uPixelRatio / -mv.z;

    vec3 blue = vec3(0.427, 0.553, 1.0);
    vec3 cyan = vec3(0.404, 0.867, 0.922);
    vec3 lav = vec3(0.79, 0.75, 1.0);
    float t = clamp(0.5 + pos.y * 0.22 + pos.x * 0.12, 0.0, 1.0);
    vec3 c = mix(blue, cyan, t);
    c = mix(c, lav, step(0.88, fract(aRandom * 13.7)) * 0.85);
    c = mix(c, vec3(1.0), step(0.965, fract(aRandom * 31.3)) * 0.8);
    vColor = c;
    vAlpha = uOpacity * ie;
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }
`;

declare global {
  interface Window {
    __introStarted?: boolean;
  }
}

export default function ParticleField() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 760;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    const COUNT = small || lowPower ? 7000 : 14000;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      document.documentElement.classList.add("no-webgl");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const fontFamily = getComputedStyle(document.body).fontFamily || "sans-serif";
    const shapes = generateShapes(COUNT, fontFamily);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
    for (let k = 1; k < SHAPE_COUNT; k++) {
      geometry.setAttribute(`aP${k}`, new THREE.BufferAttribute(shapes[k], 3));
    }
    const randoms = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) randoms[i] = Math.random();
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

    const uniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uSize: { value: small ? 34 : 30 },
      uIntro: { value: reduce ? 1 : 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uOpacity: { value: 1 },
      uMotion: { value: reduce ? 0 : 1 },
      uMouse: { value: new THREE.Vector2(99, 99) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    // ----- Viewport -----
    let vw = 0;
    let vh = 0;
    let halfW = 1;
    let halfH = 1;
    let mobile = small;
    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      mobile = vw < 760;
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.updateProjectionMatrix();
      halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      halfW = halfH * camera.aspect;
      measure();
    };

    // ----- Scroll markers -----
    // Each marker names a shape and may nudge its layout with
    // data-lx / data-ly / data-ls / data-lo (desktop) and data-mx … data-mo (mobile).
    type Marker = { top: number; shape: number; el: HTMLElement };
    let markers: Marker[] = [];
    const measure = () => {
      markers = Array.from(document.querySelectorAll<HTMLElement>("[data-shape]"))
        .map((el) => ({ top: el.getBoundingClientRect().top + window.scrollY, shape: Number(el.dataset.shape), el }))
        .sort((a, b) => a.top - b.top);
    };
    const markerLayout = (m: Marker): Layout => {
      const base = (mobile ? MOBILE : DESKTOP)[m.shape];
      const d = m.el.dataset;
      const pick = (desk?: string, mob?: string) => (mobile ? mob : desk);
      const val = (v: string | undefined, fallback: number) => (v ? Number(v) : fallback);
      return {
        x: val(pick(d.lx, d.mx), base.x),
        y: val(pick(d.ly, d.my), base.y),
        s: val(pick(d.ls, d.ms), base.s),
        o: val(pick(d.lo, d.mo), base.o),
      };
    };
    /** Position along the marker list: integer = sitting on a marker. */
    const targetQ = () => {
      if (!markers.length) return 0;
      const y = window.scrollY;
      let i = 0;
      for (let k = 0; k < markers.length; k++) if (markers[k].top <= y + vh * 0.5) i = k;
      const next = markers[i + 1];
      if (!next) return i;
      return i + Math.min(1, Math.max(0, (y + vh - next.top) / (vh * 0.5)));
    };

    // ----- Pointer -----
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.tx = (e.clientX / vw) * 2 - 1;
      mouse.ty = -(e.clientY / vh) * 2 + 1;
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);

    const stateAt = (q: number) => {
      if (!markers.length) return { morph: 0, layout: (mobile ? MOBILE : DESKTOP)[0] };
      const a = Math.min(Math.floor(q), markers.length - 1);
      const b = Math.min(a + 1, markers.length - 1);
      const f = q - a;
      const e = f * f * (3 - 2 * f);
      const la = markerLayout(markers[a]);
      const lb = markerLayout(markers[b]);
      const morph = markers[a].shape + (markers[b].shape - markers[a].shape) * f;
      return { morph, layout: {
        x: la.x + (lb.x - la.x) * e,
        y: la.y + (lb.y - la.y) * e,
        s: la.s + (lb.s - la.s) * e,
        o: la.o + (lb.o - la.o) * e,
      } };
    };
    // Fit wide shapes (especially the name) into narrow screens.
    const fitScale = (m: number) => {
      const a = Math.floor(m);
      const b = Math.min(a + 1, SHAPE_COUNT - 1);
      const f = m - a;
      const w = SHAPE_WIDTH[a] + (SHAPE_WIDTH[b] - SHAPE_WIDTH[a]) * f;
      const maxW = mobile ? halfW * 2 * 0.92 : halfW * 2 * (m > 6.5 ? 0.8 : 0.62);
      return Math.min(1, maxW / w, (halfH * 2) / 4.6);
    };

    // ----- Intro -----
    let introStart = reduce ? -1 : 0;
    const beginIntro = () => {
      if (introStart === 0) introStart = performance.now();
    };
    if (window.__introStarted) beginIntro();
    window.addEventListener("intro", beginIntro);
    // Safety net in case the loader never fires.
    const introFallback = window.setTimeout(beginIntro, 4000);

    // ----- Loop -----
    const clock = new THREE.Clock();
    let q = targetQ();
    let spin = 0;
    let raf = 0;
    let running = true;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      const target = targetQ();
      q = reduce ? target : q + (target - q) * (1 - Math.exp(-dt * 3.2));
      const state = stateAt(q);
      const morph = state.morph;
      uniforms.uMorph.value = Math.min(SHAPE_COUNT - 1, Math.max(0, morph));
      uniforms.uTime.value = reduce ? 0 : t;

      if (introStart > 0) {
        const p = Math.min(1, (performance.now() - introStart) / 2600);
        uniforms.uIntro.value = 1 - Math.pow(1 - p, 3);
      }

      // Rotation: slow spin for round shapes, gentle sway for the rest.
      const spinSpeed = [0.16, 0, 0.12, 0.1, 0, 0, 0.05, 0];
      const sIdx = Math.round(morph);
      if (!reduce) {
        const speed = spinSpeed[sIdx] ?? 0;
        if (speed > 0) spin += speed * dt;
        else spin += (Math.round(spin / (Math.PI * 2)) * Math.PI * 2 - spin) * (1 - Math.exp(-dt * 3));
      }
      mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 4));
      mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 4));
      const sway = reduce ? 0 : Math.sin(t * 0.35) * (sIdx === 7 ? 0.08 : 0.22);
      group.rotation.y = spin + sway + mouse.x * (sIdx === 7 ? 0.15 : 0.35);
      group.rotation.x = -mouse.y * 0.2 + (reduce ? 0 : Math.sin(t * 0.25) * 0.05);

      const L = state.layout;
      const scale = L.s * fitScale(uniforms.uMorph.value);
      group.position.set(L.x * halfW, L.y * halfH, 0);
      group.scale.setScalar(scale);
      uniforms.uOpacity.value = L.o;

      if (mouse.active && !reduce) {
        uniforms.uMouse.value.set(mouse.tx * halfW, mouse.ty * halfH);
      } else {
        uniforms.uMouse.value.set(99, 99);
      }

      renderer.render(scene, camera);
    };

    const onVisibility = () => {
      if (document.hidden && running) {
        cancelAnimationFrame(raf);
        running = false;
      } else if (!document.hidden && !running) {
        running = true;
        clock.getDelta();
        frame();
      }
    };

    resize();
    frame();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    // Re-measure when layout shifts (fonts, images, split text).
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    window.addEventListener("load", measure);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(introFallback);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("intro", beginIntro);
      window.removeEventListener("load", measure);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={wrapRef} className={styles.field} aria-hidden="true" />;
}
