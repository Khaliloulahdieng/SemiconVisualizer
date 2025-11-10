import * as THREE from 'three';
import { getMaterial } from './materials';

export interface MOSFETLayers {
  substrate: THREE.Mesh;
  oxide: THREE.Mesh;
  gate: THREE.Mesh;
  source: THREE.Mesh;
  drain: THREE.Mesh;
  channel?: THREE.Mesh;
  depletion?: THREE.Mesh;
}

export function createMOSFET(): MOSFETLayers {
  const layers: MOSFETLayers = {} as MOSFETLayers;

  // Substrate (p-type silicon base)
  const substrateGeometry = new THREE.BoxGeometry(8, 1, 4);
  layers.substrate = new THREE.Mesh(substrateGeometry, getMaterial('substrate'));
  layers.substrate.position.set(0, -0.5, 0);
  layers.substrate.name = 'substrate';

  // Gate oxide (thin insulating layer)
  const oxideGeometry = new THREE.BoxGeometry(3, 0.1, 4);
  layers.oxide = new THREE.Mesh(oxideGeometry, getMaterial('oxide'));
  layers.oxide.position.set(0, 0.05, 0);
  layers.oxide.name = 'oxide';

  // Polysilicon gate
  const gateGeometry = new THREE.BoxGeometry(3, 0.4, 4);
  layers.gate = new THREE.Mesh(gateGeometry, getMaterial('gate'));
  layers.gate.position.set(0, 0.3, 0);
  layers.gate.name = 'gate';

  // Source (n+ doped region)
  const sourceGeometry = new THREE.BoxGeometry(1.5, 0.8, 4);
  layers.source = new THREE.Mesh(sourceGeometry, getMaterial('source'));
  layers.source.position.set(-3, -0.1, 0);
  layers.source.name = 'source';

  // Drain (n+ doped region)
  const drainGeometry = new THREE.BoxGeometry(1.5, 0.8, 4);
  layers.drain = new THREE.Mesh(drainGeometry, getMaterial('drain'));
  layers.drain.position.set(3, -0.1, 0);
  layers.drain.name = 'drain';

  return layers;
}

export function addChannel(scene: THREE.Scene, layers: MOSFETLayers) {
  if (layers.channel) return layers.channel;

  const channelGeometry = new THREE.BoxGeometry(3, 0.2, 4);
  layers.channel = new THREE.Mesh(channelGeometry, getMaterial('channel'));
  layers.channel.position.set(0, -0.05, 0);
  layers.channel.name = 'channel';
  layers.channel.visible = false;
  
  scene.add(layers.channel);
  return layers.channel;
}

export function addDepletionRegion(scene: THREE.Scene, layers: MOSFETLayers) {
  if (layers.depletion) return layers.depletion;

  const depletionGeometry = new THREE.BoxGeometry(3, 0.3, 4);
  layers.depletion = new THREE.Mesh(depletionGeometry, getMaterial('depletion'));
  layers.depletion.position.set(0, -0.15, 0);
  layers.depletion.name = 'depletion';
  layers.depletion.visible = false;
  
  scene.add(layers.depletion);
  return layers.depletion;
}