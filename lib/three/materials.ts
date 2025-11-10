import * as THREE from 'three';

export const materials = {
  substrate: new THREE.MeshPhongMaterial({
    color: 0x4a90e2,
    transparent: true,
    opacity: 0.7,
    shininess: 30,
  }),
  oxide: new THREE.MeshPhongMaterial({
    color: 0xff6b6b,
    transparent: true,
    opacity: 0.5,
    shininess: 50,
  }),
  gate: new THREE.MeshPhongMaterial({
    color: 0xffd93d,
    shininess: 80,
    specular: 0xffaa00,
  }),
  source: new THREE.MeshPhongMaterial({
    color: 0x6bcf7f,
    transparent: true,
    opacity: 0.8,
    shininess: 40,
  }),
  drain: new THREE.MeshPhongMaterial({
    color: 0x6bcf7f,
    transparent: true,
    opacity: 0.8,
    shininess: 40,
  }),
  channel: new THREE.MeshPhongMaterial({
    color: 0x95e1d3,
    transparent: true,
    opacity: 0.6,
    emissive: 0x95e1d3,
    emissiveIntensity: 0.3,
  }),
  depletion: new THREE.MeshPhongMaterial({
    color: 0x9b59b6,
    transparent: true,
    opacity: 0.4,
  }),
};

type MaterialKey = keyof typeof materials;

export function getMaterial(name: string): THREE.Material {
  if (name in materials) {
    return materials[name as MaterialKey];
  }
  return materials.substrate;
}