'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Scene3DProps {
  onSceneReady?: (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => void;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
}

export function Scene3D({ onSceneReady, cameraPosition, cameraTarget }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(
      cameraPosition?.[0] ?? 0,
      cameraPosition?.[1] ?? 5,
      cameraPosition?.[2] ?? 10
    );
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(
      cameraTarget?.[0] ?? 0,
      cameraTarget?.[1] ?? 0,
      cameraTarget?.[2] ?? 0
    );
    controls.update();
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Notify parent that scene is ready
    if (onSceneReady) {
      onSceneReady(scene, camera, renderer);
    }

    // Animation loop
    const animate = () => {
      // ...existing render/update code...
      const updaters: Function[] = (scene.userData.updaters = scene.userData.updaters || []);
      for (const u of updaters) {
        try { u(); } catch (e) { /* ignore per-updater errors */ }
      }
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update camera when props change
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    if (cameraPosition) {
      cameraRef.current.position.set(...cameraPosition);
    }
    if (cameraTarget) {
      controlsRef.current.target.set(...cameraTarget);
      controlsRef.current.update();
    }
  }, [cameraPosition, cameraTarget]);

  return <div ref={containerRef} className="w-full h-full" />;
}