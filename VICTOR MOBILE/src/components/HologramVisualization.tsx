"use client"

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface HologramVisualizationProps {
  hologramData: any;
  opacity: number;
  scale: number;
}

const HologramVisualization = ({ hologramData, opacity, scale }: HologramVisualizationProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hologramData || !mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000033, 10, 50);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0xff00ff, 0.7, 100);
    pointLight2.position.set(-10, 5, -10);
    scene.add(pointLight2);

    const hologramContainer = new THREE.Group();
    scene.add(hologramContainer);

    let stabilizers: THREE.Mesh[] = [];
    let connections: THREE.Line[] = [];

    const updateVisualization = (data: any, currentOpacity: number, currentScale: number) => {
      // Clear previous objects
      stabilizers.forEach(s => scene.remove(s));
      connections.forEach(c => scene.remove(c));
      stabilizers = [];
      connections = [];

      hologramContainer.scale.set(currentScale, currentScale, currentScale);

      const coreGeometry = new THREE.OctahedronGeometry(0.5, 0);
      const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);

      data.stabilizers.forEach((stab: any, i: number) => {
        const isCore = stab.id === 'core';
        const geometry = isCore ? coreGeometry : sphereGeometry;
        const material = new THREE.MeshPhongMaterial({
          color: isCore ? 0xff00ff : 0x00ffff,
          emissive: isCore ? 0x440044 : 0x004444,
          transparent: true,
          opacity: currentOpacity
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(stab.position.x, stab.position.y, stab.position.z);

        const hue = stab.phase * 360;
        material.color.setHSL(hue / 360, 1, 0.5);

        hologramContainer.add(sphere);
        stabilizers.push(sphere);
      });

      data.stabilizers.forEach((stab: any, fromIndex: number) => {
        stab.connections.forEach((conn: any) => {
          const toIndex = data.stabilizers.findIndex((s: any) => s.id === conn.to);
          if (toIndex !== -1 && fromIndex !== toIndex) {
            const from = stabilizers[fromIndex].position;
            const to = stabilizers[toIndex].position;
            const geometry = new THREE.BufferGeometry().setFromPoints([from, to]);
            const material = new THREE.LineBasicMaterial({
              color: new THREE.Color(conn.color),
              transparent: true,
              opacity: currentOpacity * 0.8,
              linewidth: 2
            });
            const line = new THREE.Line(geometry, material);
            hologramContainer.add(line);
            connections.push(line);
          }
        });
      });
    };

    updateVisualization(hologramData, opacity / 100, scale / 100);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      hologramContainer.rotation.y += 0.002;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if(currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [hologramData, opacity, scale]);

  return <div ref={mountRef} style={{ width: '100%', height: '300px' }} />;
};

export default HologramVisualization;
