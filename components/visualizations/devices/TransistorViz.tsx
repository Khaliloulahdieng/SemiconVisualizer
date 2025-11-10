'use client';

import { Scene3D } from '../Scene3D';
import { VisualizationState } from '@/lib/types';
import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { createMOSFET, addChannel, addDepletionRegion, MOSFETLayers } from '@/lib/three/mosfetGeometry';

interface TransistorVizProps {
  visualizationState: VisualizationState;
}

export function TransistorViz({ visualizationState }: TransistorVizProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const layersRef = useRef<MOSFETLayers | null>(null);

  // targets animated each frame (set by updateVisualization)
  const targetsRef = useRef({
    scaleX: 1,
    emissive: 0,
    color: new THREE.Color(0x00ff66),
    channelVisible: false,
    depletionVisible: false
  });

  // store updater id for cleanup
  const updaterIdRef = useRef<string | null>(null);

  const handleSceneReady = (scene: THREE.Scene) => {
    sceneRef.current = scene;
    
    // Create MOSFET structure
    const layers = createMOSFET();
    layersRef.current = layers;

    // Add all layers to scene
    scene.add(layers.substrate);
    scene.add(layers.oxide);
    scene.add(layers.gate);
    scene.add(layers.source);
    scene.add(layers.drain);

    // Add optional layers (hidden by default)
    addChannel(scene, layers);
    addDepletionRegion(scene, layers);

    // Ensure channel material is prepared for emissive/opacity animation
    if (layers.channel && layers.channel.material) {
      const mat: any = layers.channel.material;
      mat.emissive = mat.emissive || new THREE.Color(0x00ff66);
      mat.emissiveIntensity = mat.emissiveIntensity ?? 0;
      mat.transparent = true;
      mat.opacity = mat.opacity ?? 1.0;
    }

    // Register a per-frame updater (Scene3D will call updaters each frame)
    const updaters: Function[] = (scene.userData.updaters = scene.userData.updaters || []);

    // avoid duplicate
    if (!updaters.find((u: any) => u._id === 'transistor-smooth-anim')) {
      const updater = () => {
        const layersLocal = layersRef.current;
        const t = targetsRef.current;
        if (!layersLocal || !layersLocal.channel || !layersLocal.depletion) return;

        const ch = layersLocal.channel as THREE.Mesh;
        const dp = layersLocal.depletion as THREE.Mesh;
        const mat: any = ch.material;

        // smooth scale interpolation on X (length)
        const currentScaleX = ch.scale.x || 1;
        ch.scale.x = currentScaleX + (t.scaleX - currentScaleX) * 0.14;

        // smooth emissive intensity
        const currentEm = mat.emissiveIntensity ?? 0;
        mat.emissiveIntensity = currentEm + (t.emissive - currentEm) * 0.12;

        // smooth emissive color lerp
        if (mat.emissive && t.color) {
          mat.emissive.lerp(t.color, 0.12);
        }

        // smooth opacity for fade in/out
        mat.opacity = (mat.opacity ?? 1) + ((t.channelVisible ? 1.0 : 0.08) - (mat.opacity ?? 1)) * 0.12;
        ch.visible = mat.opacity > 0.01 || t.channelVisible;

        // depletion visibility uses simple threshold fade
        dp.visible = t.depletionVisible;
      };
      (updater as any)._id = 'transistor-smooth-anim';
      updaters.push(updater);
      updaterIdRef.current = 'transistor-smooth-anim';
    }

    // Update visibility based on initial state (sets animation targets)
    updateVisualization(visualizationState, layers, scene, targetsRef);
  };
  
  useEffect(() => {
    if (!sceneRef.current || !layersRef.current) return;
    updateVisualization(visualizationState, layersRef.current, sceneRef.current, targetsRef);
  }, [visualizationState]);
  
  // cleanup: remove our updater when unmounting
  useEffect(() => {
    return () => {
      const scene = sceneRef.current;
      const id = updaterIdRef.current;
      if (scene && id) {
        scene.userData.updaters = (scene.userData.updaters || []).filter((u: any) => u._id !== id);
      }
    };
  }, []);

  return (
    <Scene3D
      onSceneReady={handleSceneReady}
      cameraPosition={visualizationState.camera?.position}
      cameraTarget={visualizationState.camera?.target}
    />
  );
}

function updateVisualization(
  state: VisualizationState,
  layers: MOSFETLayers,
  scene: THREE.Scene,
  targetsRef: MutableRefObject<any>
) {
  // Reset all layers visibility (kept immediate for non-animated layers)
  Object.values(layers).forEach(layer => {
    if (layer && layer !== layers.channel && layer !== layers.depletion) layer.visible = false;
  });

  // Show static layers specified in state (substrate/gate/source/drain/oxide)
  if (state.layers) {
    state.layers.forEach(layerName => {
      const layer = layers[layerName as keyof MOSFETLayers];
      if (layer && layer !== layers.channel && layer !== layers.depletion) {
        layer.visible = true;
      }
    });
  }

  // Handle highlights (unchanged - immediate pulse)
  if (state.highlights) {
    state.highlights.forEach(highlightName => {
      const layer = layers[highlightName as keyof MOSFETLayers];
      if (layer && layer instanceof THREE.Mesh) {
        const material = layer.material as THREE.MeshPhongMaterial;
        const originalEmissiveIntensity = material.emissiveIntensity || 0;
        let intensity = originalEmissiveIntensity;
        const animate = () => {
          intensity = originalEmissiveIntensity + Math.sin(Date.now() * 0.006) * 0.6;
          material.emissiveIntensity = Math.max(0, intensity);
        };
        const intervalId = setInterval(animate, 40);
        setTimeout(() => {
          clearInterval(intervalId);
          material.emissiveIntensity = originalEmissiveIntensity;
        }, 1600);
      }
    });
  }

  // Voltage-driven channel model
  const params: any = (state as any).params || {};
  const Vg = Number(params.Vg ?? params.vg ?? 0); // gate
  const Vd = Number(params.Vd ?? params.vd ?? 0); // drain
  const Vs = Number(params.Vs ?? params.vs ?? 0); // source
  const Vth = Number(params.Vth ?? 0.7); // threshold
  const k = Number(params.k ?? 1.2);

  const Vgs = Vg - Vs;
  const Vds = Vd - Vs;
  const Vov = Vgs - Vth;

  const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  // compute visual targets (instead of instant changes) for smooth animation
  let targetScaleX = 1;
  let targetEmissive = 0;
  const targetColor = new THREE.Color(0x00ff66);
  let channelVisible = false;
  let depletionVisible = false;

  if (Vov <= 0) {
    // Off: show depletion region strongly
    channelVisible = false;
    depletionVisible = true;
    targetEmissive = 0;
  } else {
    depletionVisible = false;
    channelVisible = true;

    // channel length fraction
    if (Vds > 0) {
      if (Vds < Vov) targetScaleX = 1;
      else targetScaleX = clamp(Vov / Vds, 0.05, 1);
    } else {
      targetScaleX = 1;
    }

    // current estimate (visual)
    let Id = 0;
    if (Vds < Vov) Id = k * (Vov * Vds - 0.5 * Vds * Vds);
    else Id = 0.5 * k * Vov * Vov;

    // stronger mapping for visibility
    const normalizedId = clamp(Id / (0.5 * k * Math.max(0.01, Vov * Vov)), 0, 1);
    // amplify emissive for clearer effect
    targetEmissive = Math.pow(normalizedId, 0.5) * 4.0;
    // color shifts from green -> yellow -> red with increasing current
    targetColor.setHSL(0.35 - normalizedId * 0.25, 1.0, 0.5);
  }

  // set animation targets
  targetsRef.current.scaleX = targetScaleX;
  targetsRef.current.emissive = targetEmissive;
  targetsRef.current.color.copy(targetColor);
  targetsRef.current.channelVisible = channelVisible;
  targetsRef.current.depletionVisible = depletionVisible;

  // also set immediate visibility for non-animated depletion (so it toggles quickly)
  if (layers.depletion) layers.depletion.visible = depletionVisible;
  // leave channel visibility to animator (it will fade)
  
  // Handle legacy named animations
  if (state.animation) {
    handleAnimation(state.animation, layers, scene);
  }
}

function handleAnimation(animationType: string, layers: MOSFETLayers, scene: THREE.Scene) {
  switch (animationType) {
    case 'off-state':
      // Show depletion region
      if (layers.depletion) {
        layers.depletion.visible = true;
      }
      if (layers.channel) {
        layers.channel.visible = false;
      }
      break;
      
    case 'on-state':
      // Show channel formation
      if (layers.channel) {
        layers.channel.visible = true;
        // Fade in effect
        const material = layers.channel.material as THREE.MeshPhongMaterial;
        material.opacity = 0;
        const fadeIn = () => {
          material.opacity = Math.min(1, material.opacity + 0.02);
          if (material.opacity < 1) {
            requestAnimationFrame(fadeIn);
          }
        };
        fadeIn();
      }
      if (layers.depletion) {
        layers.depletion.visible = false;
      }
      break;
      
    case 'rotate-idle': {
      // Ensure scene.userData.updaters exists
      const updaters: Function[] = (scene.userData.updaters = scene.userData.updaters || []);

      // avoid adding duplicate updater
      const existing = updaters.find((u: any) => u._id === 'transistor-rotate');
      if (existing) return;

      let rotation = 0;
      const updater = (dt?: number) => {
        rotation += 0.002;
        Object.values(layers).forEach(layer => {
          if (layer) layer.rotation.y = rotation;
        });
      };
      // mark so we can identify/remove later if needed
      (updater as any)._id = 'transistor-rotate';

      updaters.push(updater);
      break;
    }
  }
}