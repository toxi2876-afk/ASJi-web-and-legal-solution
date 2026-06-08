import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface ThreeHeroProps {}

export default function ThreeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xc9a84c, 1.5);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xf0d368, 0.8);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const material1 = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const material2 = new THREE.MeshBasicMaterial({
      color: 0xe8cc74,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const standardMaterial = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      transparent: true,
      opacity: 0.12,
    });

    // 1. Central Web Network Globe (Web/Core Representation)
    const centralGlobeGroup = new THREE.Group();
    
    const innerSphereGeom = new THREE.SphereGeometry(1.2, 16, 16);
    const innerSphere = new THREE.Mesh(innerSphereGeom, standardMaterial);
    centralGlobeGroup.add(innerSphere);

    const outerSphereGeom = new THREE.SphereGeometry(1.5, 12, 12);
    const outerSphere = new THREE.Mesh(outerSphereGeom, material1.clone());
    centralGlobeGroup.add(outerSphere);

    // Dynamic orbital data rings representing global link
    const ringGeom = new THREE.TorusGeometry(2.1, 0.03, 8, 48);
    const ringMesh = new THREE.Mesh(ringGeom, material2.clone());
    ringMesh.rotation.x = Math.PI / 2.3;
    centralGlobeGroup.add(ringMesh);

    const ringGeom2 = new THREE.TorusGeometry(1.8, 0.02, 6, 36);
    const ringMesh2 = new THREE.Mesh(ringGeom2, material1.clone());
    ringMesh2.rotation.y = Math.PI / 4;
    centralGlobeGroup.add(ringMesh2);

    scene.add(centralGlobeGroup);

    // 2. 3D Legal Gavel (Law Representation)
    const gavelGroup = new THREE.Group();

    // Mallet head
    const headGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.75, 12);
    const headMesh = new THREE.Mesh(headGeom, material1.clone());
    headMesh.rotation.z = Math.PI / 2;
    gavelGroup.add(headMesh);

    // Handle
    const handleGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.1, 10);
    const handleMesh = new THREE.Mesh(handleGeom, material1.clone());
    handleMesh.position.y = -0.55;
    gavelGroup.add(handleMesh);

    // Sound block base
    const baseGeom = new THREE.CylinderGeometry(0.4, 0.5, 0.12, 12);
    const baseMesh = new THREE.Mesh(baseGeom, material2.clone());
    baseMesh.position.y = -1.05;
    gavelGroup.add(baseMesh);

    gavelGroup.position.set(-3.4, 1.4, -1.2);
    scene.add(gavelGroup);

    // 3. 3D Scale of Justice (Law Representation)
    const scaleGroup = new THREE.Group();

    // Central pillar stand
    const pillarGeom = new THREE.CylinderGeometry(0.035, 0.035, 1.5, 10);
    const pillarMesh = new THREE.Mesh(pillarGeom, material1.clone());
    scaleGroup.add(pillarMesh);

    // Base stand
    const baseStandGeom = new THREE.CylinderGeometry(0.3, 0.4, 0.12, 12);
    const baseStand = new THREE.Mesh(baseStandGeom, material1.clone());
    baseStand.position.y = -0.75;
    scaleGroup.add(baseStand);

    // Scale Beam (Crossbar) - will be animated to tilt dynamically!
    const beamGeom = new THREE.CylinderGeometry(0.025, 0.025, 1.2, 10);
    const beamMesh = new THREE.Mesh(beamGeom, material1.clone());
    beamMesh.rotation.z = Math.PI / 2;
    beamMesh.position.y = 0.55;
    scaleGroup.add(beamMesh);

    // Hanging support lines
    const strGeom = new THREE.CylinderGeometry(0.007, 0.007, 0.35, 6);
    const strLeft = new THREE.Mesh(strGeom, material2.clone());
    strLeft.position.set(-0.55, 0.35, 0);
    scaleGroup.add(strLeft);

    const strRight = new THREE.Mesh(strGeom, material2.clone());
    strRight.position.set(0.55, 0.35, 0);
    scaleGroup.add(strRight);

    // Scale plates container
    const plateGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.03, 12);
    const plateLeft = new THREE.Mesh(plateGeom, material1.clone());
    plateLeft.position.set(-0.55, 0.15, 0);
    scaleGroup.add(plateLeft);

    const plateRight = new THREE.Mesh(plateGeom, material1.clone());
    plateRight.position.set(0.55, 0.15, 0);
    scaleGroup.add(plateRight);

    scaleGroup.position.set(3.4, -1.2, -1.5);
    scene.add(scaleGroup);

    // 4. 3D Web/Responsive Monitor Frame Layout (Web Representation)
    const browserGroup = new THREE.Group();

    // Main window monitor screen
    const winGeom = new THREE.BoxGeometry(1.5, 1.0, 0.04);
    const winMesh = new THREE.Mesh(winGeom, material2.clone());
    browserGroup.add(winMesh);

    // Header navigation dividing line
    const navBarDividerGeom = new THREE.BoxGeometry(1.3, 0.08, 0.05);
    const navBarDivider = new THREE.Mesh(navBarDividerGeom, material1.clone());
    navBarDivider.position.set(0, 0.35, 0.005);
    browserGroup.add(navBarDivider);

    // Mock web component visual layouts
    const cardGeom = new THREE.BoxGeometry(0.35, 0.5, 0.05);
    const card1 = new THREE.Mesh(cardGeom, material1.clone());
    card1.position.set(-0.4, -0.05, 0.01);
    browserGroup.add(card1);

    const card2 = new THREE.Mesh(cardGeom, material1.clone());
    card2.position.set(0.4, -0.05, 0.01);
    browserGroup.add(card2);

    const card3 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.05), material1.clone());
    card3.position.set(0, 0.09, 0.01);
    browserGroup.add(card3);

    const card4 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.05), material1.clone());
    card4.position.set(0, -0.19, 0.01);
    browserGroup.add(card4);

    browserGroup.position.set(-3.2, -1.4, -1.5);
    scene.add(browserGroup);

    // 5. 3D Book of Corporate Law & Statutes (Law Representation)
    const lawBookGroup = new THREE.Group();

    // Spine binding
    const bookSpineGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 10);
    const bookSpine = new THREE.Mesh(bookSpineGeom, material1.clone());
    lawBookGroup.add(bookSpine);

    // Left folded book page
    const leftFoldGeom = new THREE.BoxGeometry(0.48, 0.85, 0.03);
    const leftFold = new THREE.Mesh(leftFoldGeom, material1.clone());
    leftFold.position.set(-0.25, 0, 0.08);
    leftFold.rotation.y = Math.PI / 10;
    lawBookGroup.add(leftFold);

    // Right folded book page
    const rightFoldGeom = new THREE.BoxGeometry(0.48, 0.85, 0.03);
    const rightFold = new THREE.Mesh(rightFoldGeom, material1.clone());
    rightFold.position.set(0.25, 0, 0.08);
    rightFold.rotation.y = -Math.PI / 10;
    lawBookGroup.add(rightFold);

    // Bookmark cord ribbon hanging from spine
    const ribbonGeom = new THREE.BoxGeometry(0.06, 1.05, 0.04);
    const ribbon = new THREE.Mesh(ribbonGeom, material2.clone());
    ribbon.position.set(0, -0.1, 0.12);
    lawBookGroup.add(ribbon);

    lawBookGroup.position.set(3.2, 1.5, -1.2);
    scene.add(lawBookGroup);

    // Stars Particles background
    const starsCount = 80;
    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xc9a84c,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });

    const starParticles = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starParticles);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Central Globe gentle bobbing and multi-axis spinning
      centralGlobeGroup.position.y = Math.sin(elapsedTime * 0.4) * 0.2;
      centralGlobeGroup.rotation.y = elapsedTime * 0.15;
      innerSphere.rotation.x = -elapsedTime * 0.05;
      outerSphere.rotation.z = elapsedTime * 0.08;
      ringMesh.rotation.z = elapsedTime * 0.25;
      ringMesh2.rotation.z = -elapsedTime * 0.35;

      // Bob & Rotate Legal Gavel structure
      gavelGroup.position.y = 1.4 + Math.sin(elapsedTime * 0.45) * 0.18;
      gavelGroup.rotation.x = elapsedTime * 0.15;
      gavelGroup.rotation.y = elapsedTime * 0.22;

      // Bob & Rotate Scale of Justice - tilting the beam dynamically to simulate weight balancing!
      scaleGroup.position.y = -1.2 + Math.sin(elapsedTime * 0.35 + 1.2) * 0.15;
      scaleGroup.rotation.y = elapsedTime * 0.1;
      beamMesh.rotation.z = Math.PI / 2 + Math.sin(elapsedTime * 0.75) * 0.12;
      
      // Counter balance plates & string heights based on beam angle
      const tiltVal = Math.sin(elapsedTime * 0.75) * 0.08;
      strLeft.position.y = 0.35 - tiltVal;
      plateLeft.position.y = 0.15 - tiltVal;
      strRight.position.y = 0.35 + tiltVal;
      plateRight.position.y = 0.15 + tiltVal;

      // Bob & Interactive pan of Web layout frame
      browserGroup.position.y = -1.4 + Math.sin(elapsedTime * 0.4 + 2.0) * 0.12;
      browserGroup.rotation.y = Math.PI / 12 + Math.sin(elapsedTime * 0.15) * 0.18;
      browserGroup.rotation.x = Math.sin(elapsedTime * 0.25) * 0.06;

      // Bob & Rotate Law Book
      lawBookGroup.position.y = 1.5 + Math.sin(elapsedTime * 0.5 + 3.0) * 0.16;
      lawBookGroup.rotation.x = elapsedTime * 0.12;
      lawBookGroup.rotation.y = elapsedTime * 0.2;

      // Slowly rotate starfield
      starParticles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
