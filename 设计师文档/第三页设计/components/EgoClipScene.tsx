"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

export default function EgoClipScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0.05, 7.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xfff7e8, 0x24344f, 2.25);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff2db, 5.2);
    keyLight.position.set(-3.5, 4.2, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const edgeLight = new THREE.DirectionalLight(0xbfd8ff, 4.1);
    edgeLight.position.set(4.5, 1.2, -3.5);
    scene.add(edgeLight);

    const fillLight = new THREE.PointLight(0xffffff, 2.5, 12);
    fillLight.position.set(2.4, -2.1, 4.2);
    scene.add(fillLight);

    const pivot = new THREE.Group();
    const assembly = new THREE.Group();
    pivot.add(assembly);
    pivot.rotation.set(-0.12, -0.72, -0.04);
    pivot.position.y = -0.1;
    scene.add(pivot);

    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      vertexColors: true,
      metalness: 0.16,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
    });

    const coverMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x151a22,
      metalness: 0.08,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.9,
      transmission: 0.12,
      thickness: 0.4,
      side: THREE.DoubleSide,
    });

    const loader = new STLLoader();
    let isDisposed = false;

    Promise.all([
      loader.loadAsync("/素材/ego-clip-3d/egoclip-shell.stl"),
      loader.loadAsync("/素材/ego-clip-3d/egoclip-cover.stl"),
    ]).then(([shellGeometry, coverGeometry]) => {
      if (isDisposed) {
        shellGeometry.dispose();
        coverGeometry.dispose();
        return;
      }

      shellGeometry.computeVertexNormals();
      coverGeometry.computeVertexNormals();

      const shellPositions = shellGeometry.getAttribute("position");
      const shellColors = new Float32Array(shellPositions.count * 3);
      const backColor = new THREE.Color(0x090b0f);
      const frontColor = new THREE.Color(0xf1ede6);
      const vertexColor = new THREE.Color();

      for (let index = 0; index < shellPositions.count; index += 1) {
        const depth = shellPositions.getZ(index);
        const blend = THREE.MathUtils.smoothstep(depth, -0.25, 1.6);
        vertexColor.copy(backColor).lerp(frontColor, blend);
        vertexColor.toArray(shellColors, index * 3);
      }
      shellGeometry.setAttribute("color", new THREE.BufferAttribute(shellColors, 3));

      const shell = new THREE.Mesh(shellGeometry, shellMaterial);
      const cover = new THREE.Mesh(coverGeometry, coverMaterial);
      shell.castShadow = true;
      shell.receiveShadow = true;
      cover.castShadow = true;
      assembly.add(shell, cover);

      const bounds = new THREE.Box3().setFromObject(assembly);
      const center = bounds.getCenter(new THREE.Vector3());
      const size = bounds.getSize(new THREE.Vector3());
      assembly.position.sub(center);
      pivot.scale.setScalar(3.28 / Math.max(size.x, size.y, size.z));
    });

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.65, 64),
      new THREE.ShadowMaterial({ color: 0x7a6247, opacity: 0.14 }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.68;
    shadow.position.z = 0.05;
    shadow.receiveShadow = true;
    scene.add(shadow);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clock = new THREE.Clock();
    let rotationAngle = -0.72;
    let boostUntil = 0;
    let demoTimer = 0;
    let frame = 0;

    const runSpinDemo = () => {
      boostUntil = performance.now() + 1450;
      mount.classList.add("is-demoing");
      window.clearTimeout(demoTimer);
      demoTimer = window.setTimeout(() => mount.classList.remove("is-demoing"), 1550);
    };
    window.addEventListener("egoclip:spin", runSpinDemo);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = performance.now() / 1000;
      if (!reducedMotion.matches) {
        rotationAngle += delta * (performance.now() < boostUntil ? 4.55 : 0.46);
        pivot.rotation.y = rotationAngle;
        pivot.position.y = Math.sin(elapsed * 0.7) * 0.055;
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      isDisposed = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(demoTimer);
      window.removeEventListener("egoclip:spin", runSpinDemo);
      observer.disconnect();
      renderer.dispose();
      shellMaterial.dispose();
      coverMaterial.dispose();
      shadow.geometry.dispose();
      (shadow.material as THREE.Material).dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="product-scene" ref={mountRef} aria-hidden="true" />;
}
