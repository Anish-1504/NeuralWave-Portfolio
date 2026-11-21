"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";

export type WatchFaceType = "modular" | "wayfinder" | "activity" | "night";
export type CaseFinishType = "natural" | "graphite" | "white";
export type BandType = "ocean" | "trail" | "alpine";

interface ThreeWatchViewerProps {
  face: WatchFaceType;
  finish: CaseFinishType;
  band: BandType;
  currentTime: { hours: string; minutes: string; seconds: string };
}

// Materials palette
const CASE_FINISH_MAP: Record<
  CaseFinishType,
  { color: number; metalness: number; roughness: number; clearcoat?: number }
> = {
  natural: { color: 0xd0d2d6, metalness: 0.88, roughness: 0.22, clearcoat: 0.1 },
  graphite: { color: 0x1c1d22, metalness: 0.92, roughness: 0.18, clearcoat: 0.15 },
  white: { color: 0xf8f9fc, metalness: 0.15, roughness: 0.05, clearcoat: 0.9 },
};

const BAND_MAP: Record<
  BandType,
  { color: number; roughness: number; metalness: number; accentColor?: number }
> = {
  ocean: { color: 0x0a3272, roughness: 0.55, metalness: 0.05 }, // Midnight Blue Fluoroelastomer
  trail: { color: 0x24262b, roughness: 0.82, metalness: 0.04, accentColor: 0xff6200 }, // Graphite weave with orange tab
  alpine: { color: 0xe6e8ed, roughness: 0.72, metalness: 0.06 }, // Starlight White
};

export function ThreeWatchViewer({ face, finish, band, currentTime }: ThreeWatchViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const caseMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const bandMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const crownMeshRef = useRef<THREE.Mesh | null>(null);
  const watchGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Scalable Zoom Level (1.0 = normal, 0.6 = wide, 2.0 = close-up)
  const [zoomScale, setZoomScale] = useState(1.0);
  const zoomTargetRef = useRef(7.2); // camera distance

  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.12, y: -0.35 });

  // Update camera distance when zoomScale changes
  useEffect(() => {
    // Distance inversely proportional to scale: 1.0 -> 7.2, 1.5 -> 4.8, 0.7 -> 10.2
    zoomTargetRef.current = 7.2 / zoomScale;
  }, [zoomScale]);

  // Zoom control handlers
  const handleZoomIn = () => setZoomScale((prev) => Math.min(2.0, +(prev + 0.2).toFixed(1)));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(0.6, +(prev - 0.2).toFixed(1)));
  const handleResetZoom = () => {
    setZoomScale(1.0);
    targetRotation.current = { x: 0.12, y: -0.35 };
  };

  // 1. Offscreen Canvas Texture Renderer for the Watch Face Dial
  const renderWatchFaceToCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Deep AMOLED Black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      if (face === "modular") {
        // --- MODULAR GRID ---
        ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, monospace";
        ctx.fillStyle = "#fbbf24";
        ctx.fillText("72° SUN", 38, 70);

        ctx.fillStyle = "#38bdf8";
        ctx.textAlign = "center";
        ctx.fillText("BATT 88%", w / 2, 70);

        ctx.fillStyle = "#ec4899";
        ctx.textAlign = "right";
        ctx.fillText("76 BPM", w - 38, 70);

        // Center Time
        ctx.textAlign = "center";
        ctx.font = "900 114px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${currentTime.hours}:${currentTime.minutes}`, w / 2, 235);

        ctx.font = "bold 22px monospace";
        ctx.fillStyle = "#22d3ee";
        ctx.fillText(`SEC ${currentTime.seconds} • ELEV 2,450 FT`, w / 2, 288);

        // Health Goal Card
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(38, 335, w - 76, 95, 22);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.font = "bold 24px -apple-system, sans-serif";
        ctx.fillStyle = "#f43f5e";
        ctx.fillText("🔥 680 / 500 CAL", 58, 388);

        ctx.textAlign = "right";
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = "#10b981";
        ctx.fillText("GOAL MET", w - 58, 388);

        // Activity Bar Fill
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.beginPath();
        ctx.roundRect(58, 404, w - 116, 8, 4);
        ctx.fill();

        ctx.fillStyle = "#f43f5e";
        ctx.beginPath();
        ctx.roundRect(58, 404, (w - 116) * 0.88, 8, 4);
        ctx.fill();
      } else if (face === "wayfinder") {
        // --- WAYFINDER COMPASS ---
        ctx.textAlign = "center";
        ctx.font = "bold 18px monospace";
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("37°46'29\" N  122°25'10\" W", w / 2, 65);

        const cx = w / 2;
        const cy = h / 2 - 12;
        const r = 135;

        // Compass Rose Outer Ring
        ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cardinal Points
        ctx.font = "bold 22px monospace";
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("N", cx, cy - r + 30);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fillText("S", cx, cy + r - 10);
        ctx.fillText("W", cx - r + 24, cy + 8);
        ctx.fillText("E", cx + r - 24, cy + 8);

        // Animated Rotating Needle based on seconds
        const sec = parseInt(currentTime.seconds, 10);
        const angle = (sec / 60) * Math.PI * 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(0, -95);
        ctx.lineTo(13, 10);
        ctx.lineTo(-13, 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(0, 75);
        ctx.lineTo(11, 10);
        ctx.lineTo(-11, 10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Digital Subdial
        ctx.font = "900 50px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${currentTime.hours}:${currentTime.minutes}`, w / 2, h - 55);
      } else if (face === "activity") {
        // --- ACTIVITY ANALOG ---
        const cx = w / 2;
        const cy = h / 2 - 20;

        const drawRing = (radius: number, width: number, color: string, progress: number) => {
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = width;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.lineCap = "round";
          ctx.stroke();
        };

        drawRing(150, 18, "#fa114f", 0.82); // Move (Pink)
        drawRing(122, 18, "#a1e700", 0.94); // Exercise (Neon Green)
        drawRing(94, 18, "#00e5ff", 0.70);  // Stand (Cyan)

        ctx.textAlign = "center";
        ctx.font = "900 46px -apple-system, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${currentTime.hours}:${currentTime.minutes}`, cx, cy + 15);

        ctx.font = "bold 16px monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fillText("MOVE • EXERCISE • STAND", cx, h - 55);
      } else if (face === "night") {
        // --- TACTICAL NIGHT VISION ---
        ctx.textAlign = "center";
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = "#ef4444";
        ctx.fillText("TACTICAL NIGHT VISION", w / 2, 75);

        ctx.font = "900 125px -apple-system, sans-serif";
        ctx.fillStyle = "#ef4444";
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 20;
        ctx.fillText(`${currentTime.hours}:${currentTime.minutes}`, w / 2, 255);
        ctx.shadowBlur = 0;

        ctx.font = "bold 22px monospace";
        ctx.fillStyle = "#dc2626";
        ctx.fillText(`SEC ${currentTime.seconds} • 0-NIT OPTIC`, w / 2, 335);

        ctx.font = "18px monospace";
        ctx.fillStyle = "rgba(239, 68, 68, 0.75)";
        ctx.fillText("LAT 34.0522° N • ELEV 2,450 FT", w / 2, h - 60);
      }
    },
    [face, currentTime]
  );

  // 2. Initialize Three.js Scene, Camera, High-Precision Smartwatch Geometry, and Lighting
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 380;
    const height = mount.clientHeight || 450;

    // High-Resolution 1024x1240 Offscreen Canvas for Ultra-Crisp OLED Screen
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 512;
    offscreenCanvas.height = 620;
    canvasRef.current = offscreenCanvas;
    renderWatchFaceToCanvas(offscreenCanvas);

    const canvasTexture = new THREE.CanvasTexture(offscreenCanvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.anisotropy = 16;
    textureRef.current = canvasTexture;

    // Three.js Scene
    const scene = new THREE.Scene();

    // Perspective Camera with Smooth Zoom
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, zoomTargetRef.current);
    cameraRef.current = camera;

    // High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    // Studio 3-Point Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x78a6ff, 1.9);
    fillLight.position.set(-6, -2, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimLight.position.set(0, 7, -6);
    scene.add(rimLight);

    // Bottom Bounce Light for Under-Bezel Highlights
    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.8);
    bounceLight.position.set(0, -6, 2);
    scene.add(bounceLight);

    // Main Watch Group
    const watchGroup = new THREE.Group();
    watchGroupRef.current = watchGroup;
    scene.add(watchGroup);

    // --- HIGH-PRECISION APPLE WATCH 3D MODEL ---
    // A. Titanium Chassis (Sculpted Rounded Squircle with 32 Segments)
    const caseWidth = 2.45;
    const caseHeight = 3.0;
    const caseDepth = 0.58;
    const cornerRadius = 0.52;

    const caseShape = new THREE.Shape();
    const x = -caseWidth / 2;
    const y = -caseHeight / 2;
    const w = caseWidth;
    const h = caseHeight;
    const r = cornerRadius;

    caseShape.moveTo(x + r, y);
    caseShape.lineTo(x + w - r, y);
    caseShape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    caseShape.lineTo(x + w, y + h - r);
    caseShape.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    caseShape.lineTo(x + r, y + h);
    caseShape.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    caseShape.lineTo(x, y + r);
    caseShape.absarc(x + r, y + r, r, Math.PI, (Math.PI * 3) / 2, false);

    // Ultra-smooth 32-segment bevel to eliminate low-poly faceting
    const extrudeSettings = {
      steps: 4,
      depth: caseDepth,
      bevelEnabled: true,
      bevelThickness: 0.16,
      bevelSize: 0.14,
      bevelOffset: 0,
      bevelSegments: 32,
    };

    const caseGeometry = new THREE.ExtrudeGeometry(caseShape, extrudeSettings);
    caseGeometry.center();

    const caseMat = new THREE.MeshStandardMaterial({
      color: CASE_FINISH_MAP[finish].color,
      metalness: CASE_FINISH_MAP[finish].metalness,
      roughness: CASE_FINISH_MAP[finish].roughness,
    });
    caseMaterialsRef.current = [caseMat];

    const caseMesh = new THREE.Mesh(caseGeometry, caseMat);
    caseMesh.castShadow = true;
    caseMesh.receiveShadow = true;
    watchGroup.add(caseMesh);

    // B. Curved Sapphire Crystal Dome & OLED Screen Plane
    const screenWidth = 2.15;
    const screenHeight = 2.68;
    const screenShape = new THREE.Shape();
    const sx = -screenWidth / 2;
    const sy = -screenHeight / 2;
    const sr = 0.42;

    screenShape.moveTo(sx + sr, sy);
    screenShape.lineTo(sx + screenWidth - sr, sy);
    screenShape.absarc(sx + screenWidth - sr, sy + sr, sr, -Math.PI / 2, 0, false);
    screenShape.lineTo(sx + screenWidth, sy + screenHeight - sr);
    screenShape.absarc(sx + screenWidth - sr, sy + screenHeight - sr, sr, 0, Math.PI / 2, false);
    screenShape.lineTo(sx + sr, sy + screenHeight);
    screenShape.absarc(sx + sr, sy + screenHeight - sr, sr, Math.PI / 2, Math.PI, false);
    screenShape.lineTo(sx, sy + sr);
    screenShape.absarc(sx + sr, sy + sr, sr, Math.PI, (Math.PI * 3) / 2, false);

    const screenGeometry = new THREE.ShapeGeometry(screenShape, 32);
    // Precise UV coordinates mapping
    const pos = screenGeometry.attributes.position;
    const uvs = [];
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const u = (px - sx) / screenWidth;
      const v = (py - sy) / screenHeight;
      uvs.push(u, v);
    }
    screenGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    const screenMaterial = new THREE.MeshBasicMaterial({
      map: canvasTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.z = caseDepth / 2 + 0.17;
    watchGroup.add(screenMesh);

    // Front Sapphire Crystal with Fresnel Glass Glint
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.04,
      transmission: 0.92,
      thickness: 0.4,
      ior: 1.54, // Sapphire index of refraction
      transparent: true,
      opacity: 0.42,
    });
    const glassMesh = new THREE.Mesh(screenGeometry, glassMat);
    glassMesh.position.z = caseDepth / 2 + 0.18;
    watchGroup.add(glassMesh);

    // C. Precision Digital Crown with Fluted Radial Teeth (Right Edge)
    const crownGroup = new THREE.Group();
    crownGroup.position.set(caseWidth / 2 + 0.22, 0.58, 0);

    // Fluted Milled Titanium Cylinder with 32 Teeth
    const crownGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.38, 32);
    crownGeo.rotateZ(Math.PI / 2);
    const crownMat = new THREE.MeshStandardMaterial({
      color: CASE_FINISH_MAP[finish].color,
      metalness: 0.92,
      roughness: 0.18,
    });
    caseMaterialsRef.current.push(crownMat);

    const crownMesh = new THREE.Mesh(crownGeo, crownMat);
    crownMeshRef.current = crownMesh;
    crownGroup.add(crownMesh);

    // Signature Orange/Red Ceramic Center Cap
    const crownCapGeo = new THREE.CylinderGeometry(0.20, 0.20, 0.06, 32);
    crownCapGeo.rotateZ(Math.PI / 2);
    const crownCapMat = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      roughness: 0.25,
      metalness: 0.4,
      emissive: 0xcc2200,
      emissiveIntensity: 0.35,
    });
    const crownCapMesh = new THREE.Mesh(crownCapGeo, crownCapMat);
    crownCapMesh.position.x = 0.20;
    crownGroup.add(crownCapMesh);

    // Titanium Crown Guard Collar
    const crownGuardGeo = new THREE.BoxGeometry(0.18, 0.85, 0.36);
    const crownGuardMesh = new THREE.Mesh(crownGuardGeo, crownMat);
    crownGuardMesh.position.set(-0.16, 0, 0);
    crownGroup.add(crownGuardMesh);
    watchGroup.add(crownGroup);

    // Side Flat Button (Right Edge)
    const sideBtnGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.72, 16);
    const sideBtnMesh = new THREE.Mesh(sideBtnGeo, crownMat);
    sideBtnMesh.position.set(caseWidth / 2 + 0.12, -0.48, 0);
    watchGroup.add(sideBtnMesh);

    // D. Action Button (Left Edge - Tactical Orange Pill with Chamfered Guard)
    const actionGroup = new THREE.Group();
    actionGroup.position.set(-caseWidth / 2 - 0.08, 0.2, 0);

    // Tactile Rounded Pill Button
    const actionPillGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.85, 24);
    const actionPillMat = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      roughness: 0.35,
      metalness: 0.5,
      emissive: 0xff2200,
      emissiveIntensity: 0.3,
    });
    const actionPillMesh = new THREE.Mesh(actionPillGeo, actionPillMat);
    actionGroup.add(actionPillMesh);

    // Chamfered Titanium Bezel Guard
    const actionGuardGeo = new THREE.BoxGeometry(0.12, 1.05, 0.32);
    const actionGuardMesh = new THREE.Mesh(actionGuardGeo, crownMat);
    actionGuardMesh.position.set(0.06, 0, 0);
    actionGroup.add(actionGuardMesh);
    watchGroup.add(actionGroup);

    // Dual Speaker Cutout Slots on Left Edge
    const speakerMat = new THREE.MeshBasicMaterial({ color: 0x111113 });
    const speakerGeo = new THREE.BoxGeometry(0.08, 0.38, 0.08);
    const speakerMesh1 = new THREE.Mesh(speakerGeo, speakerMat);
    speakerMesh1.position.set(-caseWidth / 2 - 0.12, -0.65, 0);
    const speakerMesh2 = new THREE.Mesh(speakerGeo, speakerMat);
    speakerMesh2.position.set(-caseWidth / 2 - 0.12, -0.92, 0);
    watchGroup.add(speakerMesh1);
    watchGroup.add(speakerMesh2);

    // E. Rear Ceramic Biosensor Crystal Pod & Optical Green LEDs
    const rearSensorGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.12, 32);
    const rearSensorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c10,
      metalness: 0.94,
      roughness: 0.08,
    });
    const rearSensorMesh = new THREE.Mesh(rearSensorGeo, rearSensorMat);
    rearSensorMesh.rotation.x = Math.PI / 2;
    rearSensorMesh.position.z = -caseDepth / 2 - 0.10;
    watchGroup.add(rearSensorMesh);

    // 4 Glowing Green Photodiode Sensor Apertures
    const ledGeo = new THREE.CircleGeometry(0.13, 24);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    [
      [-0.38, 0],
      [0.38, 0],
      [0, -0.38],
      [0, 0.38],
    ].forEach(([lx, ly]) => {
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(lx, ly, -caseDepth / 2 - 0.17);
      ledMesh.rotation.y = Math.PI;
      watchGroup.add(ledMesh);
    });

    // F. HIGH-FIDELITY SCULPTED 3D WATCH STRAPS (Top & Bottom Lugs)
    const bandMat = new THREE.MeshStandardMaterial({
      color: BAND_MAP[band].color,
      roughness: BAND_MAP[band].roughness,
      metalness: BAND_MAP[band].metalness,
    });
    bandMaterialsRef.current = [bandMat];

    const createSculptedBand = (isTop: boolean) => {
      const bandGroup = new THREE.Group();
      const dir = isTop ? 1 : -1;
      const bandWidth = 1.95;

      // Realistic wrist curvature: flows seamlessly out from the lugs and curves around the wrist
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, dir * 1.55, 0.0),
        new THREE.Vector3(0, dir * 2.30, -0.35),
        new THREE.Vector3(0, dir * 3.40, -1.25),
        new THREE.Vector3(0, dir * 4.30, -2.35),
      ]);

      // Solid flat-ribbon extrusion along curve
      const ribbonShape = new THREE.Shape();
      const rw = bandWidth / 2;
      const rh = 0.14;
      const rr = 0.06;

      ribbonShape.moveTo(-rw + rr, -rh);
      ribbonShape.lineTo(rw - rr, -rh);
      ribbonShape.absarc(rw - rr, 0, rr, -Math.PI / 2, Math.PI / 2, false);
      ribbonShape.lineTo(-rw + rr, rh);
      ribbonShape.absarc(-rw + rr, 0, rr, Math.PI / 2, (Math.PI * 3) / 2, false);

      const bandGeo = new THREE.ExtrudeGeometry(ribbonShape, {
        extrudePath: curve,
        steps: 32,
      });

      const bandMesh = new THREE.Mesh(bandGeo, bandMat);
      bandMesh.castShadow = true;
      bandMesh.receiveShadow = true;
      bandGroup.add(bandMesh);

      // Authentic Band Details based on selected type:
      if (band === "ocean") {
        // Ocean Band: Iconic molded tubular hollow wave ribs
        for (let i = 1; i <= 5; i++) {
          const t = i / 6;
          const point = curve.getPoint(t);
          const ribGeo = new THREE.CylinderGeometry(0.12, 0.12, bandWidth * 0.94, 16);
          ribGeo.rotateZ(Math.PI / 2);
          const ribMesh = new THREE.Mesh(ribGeo, bandMat);
          ribMesh.position.copy(point);
          ribMesh.position.z += 0.08;
          bandGroup.add(ribMesh);
        }
      } else if (band === "trail") {
        // Trail Loop: Signature bright International Orange pull tab on bottom strap
        if (!isTop) {
          const tabGeo = new THREE.BoxGeometry(1.65, 0.32, 0.12);
          const tabMat = new THREE.MeshStandardMaterial({
            color: 0xff6200,
            roughness: 0.5,
            metalness: 0.1,
          });
          const tabMesh = new THREE.Mesh(tabGeo, tabMat);
          tabMesh.position.set(0, -3.35, -1.2);
          tabMesh.rotation.x = -Math.PI / 4;
          bandGroup.add(tabMesh);
        }
      }

      // Titanium Lug End Connectors (seamless junction to case)
      const lugGeo = new THREE.BoxGeometry(bandWidth * 0.98, 0.14, 0.32);
      const lugMesh = new THREE.Mesh(lugGeo, crownMat);
      lugMesh.position.set(0, dir * 1.58, 0.02);
      bandGroup.add(lugMesh);

      return bandGroup;
    };

    const topBand = createSculptedBand(true);
    const bottomBand = createSculptedBand(false);
    watchGroup.add(topBand);
    watchGroup.add(bottomBand);

    // Initial position & tilt
    watchGroup.rotation.x = targetRotation.current.x;
    watchGroup.rotation.y = targetRotation.current.y;

    // --- INTERACTIVE MOUSE DRAG & TOUCH CONTROLS ---
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      targetRotation.current.y += deltaX * 0.0075;
      targetRotation.current.x += deltaY * 0.0075;
      targetRotation.current.x = Math.max(-0.95, Math.min(0.95, targetRotation.current.x));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Scalable Mouse Wheel Zoom Handler
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoomScale((prev) => {
        const delta = -e.deltaY * 0.0012;
        return Math.max(0.6, Math.min(2.0, +(prev + delta).toFixed(2)));
      });
    };

    // Touch Support for Mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

      targetRotation.current.y += deltaX * 0.0075;
      targetRotation.current.x += deltaY * 0.0075;
      targetRotation.current.x = Math.max(-0.95, Math.min(0.95, targetRotation.current.x));

      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    dom.addEventListener("wheel", handleWheel, { passive: false });
    dom.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // --- ANIMATION RENDER LOOP WITH FLOATING GYROSCOPE MOTION ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (watchGroupRef.current) {
        // Continuous smooth idle rotation when not dragging
        if (!isDraggingRef.current) {
          targetRotation.current.y += 0.003;
        }

        // Smooth physics-based damping / easing
        watchGroupRef.current.rotation.y +=
          (targetRotation.current.y - watchGroupRef.current.rotation.y) * 0.08;
        watchGroupRef.current.rotation.x +=
          (targetRotation.current.x - watchGroupRef.current.rotation.x) * 0.08;

        // Subtle floating / breathing oscillation
        watchGroupRef.current.position.y = Math.sin(elapsedTime * 1.4) * 0.07;

        // Active spinning Digital Crown animation
        if (crownMeshRef.current) {
          crownMeshRef.current.rotation.x += 0.015;
        }
      }

      // Smooth camera zoom lerping
      if (cameraRef.current) {
        cameraRef.current.position.z += (zoomTargetRef.current - cameraRef.current.position.z) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const nw = entry.contentRect.width;
        const nh = entry.contentRect.height;
        if (nw > 0 && nh > 0) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      }
    });
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      dom.removeEventListener("wheel", handleWheel);
      dom.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      renderer.dispose();
      scene.clear();
      if (mount.contains(dom)) {
        mount.removeChild(dom);
      }
    };
  }, [face, finish, band, renderWatchFaceToCanvas]);

  // 3. Dynamic Watch Face Canvas Texture Update on state change or second tick
  useEffect(() => {
    if (canvasRef.current && textureRef.current) {
      renderWatchFaceToCanvas(canvasRef.current);
      textureRef.current.needsUpdate = true;
    }
  }, [face, currentTime, renderWatchFaceToCanvas]);

  // 4. Dynamic Titanium Case Finish Materials Update
  useEffect(() => {
    const config = CASE_FINISH_MAP[finish];
    caseMaterialsRef.current.forEach((mat) => {
      mat.color.setHex(config.color);
      mat.metalness = config.metalness;
      mat.roughness = config.roughness;
      mat.needsUpdate = true;
    });
  }, [finish]);

  // 5. Dynamic Band Materials Update
  useEffect(() => {
    const config = BAND_MAP[band];
    bandMaterialsRef.current.forEach((mat) => {
      mat.color.setHex(config.color);
      mat.metalness = config.metalness;
      mat.roughness = config.roughness;
      mat.needsUpdate = true;
    });
  }, [band]);

  return (
    <div className="relative w-full h-[470px] sm:h-[530px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      <div ref={mountRef} className="w-full h-full" />

      {/* Scalable Zoom Control Bar */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg z-20">
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] font-mono font-bold text-cyan-400 px-1 min-w-[36px] text-center">
          {Math.round(zoomScale * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetZoom}
          title="Reset Zoom & Orbit"
          className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-0.5 border-l border-white/10"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Interactive 3D Orbit Badge */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 text-[11px] font-mono tracking-wider pointer-events-none shadow-xl">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>360° DRAG TO ROTATE • SCROLL TO SCALE</span>
      </div>
    </div>
  );
}
