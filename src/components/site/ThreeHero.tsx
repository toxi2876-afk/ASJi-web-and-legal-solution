import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // WebGL setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    
    // Position camera comfortable for full layout
    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // Warm, golden point lights for ambient reflection
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xc9a84c, 1.8, 15);
    pointLight1.position.set(4, 5, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xf0d368, 1.2, 12);
    pointLight2.position.set(-4, -5, 4);
    scene.add(pointLight2);

    // Base glowing wireframe materials
    const baseColor = 0xc9a84c;

    const createWireframeMaterial = (colorCode: number, opacity: number) => {
      return new THREE.MeshBasicMaterial({
        color: colorCode,
        wireframe: true,
        transparent: true,
        opacity: opacity,
      });
    };

    const material1 = createWireframeMaterial(baseColor, 0.38);
    const material2 = createWireframeMaterial(0xe8cc74, 0.28);
    const standardMaterial = new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.14,
    });

    // 1. Central Web Network Globe (Web/Core Representation)
    const centralGlobeGroup = new THREE.Group();
    
    const innerSphereGeom = new THREE.SphereGeometry(1.2, 16, 16);
    const innerSphere = new THREE.Mesh(innerSphereGeom, standardMaterial);
    centralGlobeGroup.add(innerSphere);

    const outerSphereGeom = new THREE.SphereGeometry(1.5, 12, 12);
    const outerSphere = new THREE.Mesh(outerSphereGeom, material1.clone());
    centralGlobeGroup.add(outerSphere);

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

    const headGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.75, 12);
    const headMesh = new THREE.Mesh(headGeom, material1.clone());
    headMesh.rotation.z = Math.PI / 2;
    gavelGroup.add(headMesh);

    const handleGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.1, 10);
    const handleMesh = new THREE.Mesh(handleGeom, material1.clone());
    handleMesh.position.y = -0.55;
    gavelGroup.add(handleMesh);

    const baseGeom = new THREE.CylinderGeometry(0.4, 0.5, 0.12, 12);
    const baseMesh = new THREE.Mesh(baseGeom, material2.clone());
    baseMesh.position.y = -1.05;
    gavelGroup.add(baseMesh);

    gavelGroup.position.set(-3.4, 1.4, -1.2);
    scene.add(gavelGroup);

    // 3. 3D Scale of Justice (Law Representation)
    const scaleGroup = new THREE.Group();

    const pillarGeom = new THREE.CylinderGeometry(0.035, 0.035, 1.5, 10);
    const pillarMesh = new THREE.Mesh(pillarGeom, material1.clone());
    scaleGroup.add(pillarMesh);

    const baseStandGeom = new THREE.CylinderGeometry(0.3, 0.4, 0.12, 12);
    const baseStand = new THREE.Mesh(baseStandGeom, material1.clone());
    baseStand.position.y = -0.75;
    scaleGroup.add(baseStand);

    const beamGeom = new THREE.CylinderGeometry(0.025, 0.025, 1.2, 10);
    const beamMesh = new THREE.Mesh(beamGeom, material1.clone());
    beamMesh.rotation.z = Math.PI / 2;
    beamMesh.position.y = 0.55;
    scaleGroup.add(beamMesh);

    const strGeom = new THREE.CylinderGeometry(0.007, 0.007, 0.35, 6);
    const strLeft = new THREE.Mesh(strGeom, material2.clone());
    strLeft.position.set(-0.55, 0.35, 0);
    scaleGroup.add(strLeft);

    const strRight = new THREE.Mesh(strGeom, material2.clone());
    strRight.position.set(0.55, 0.35, 0);
    scaleGroup.add(strRight);

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

    const winGeom = new THREE.BoxGeometry(1.5, 1.0, 0.04);
    const winMesh = new THREE.Mesh(winGeom, material2.clone());
    browserGroup.add(winMesh);

    const navBarDividerGeom = new THREE.BoxGeometry(1.3, 0.08, 0.05);
    const navBarDivider = new THREE.Mesh(navBarDividerGeom, material1.clone());
    navBarDivider.position.set(0, 0.35, 0.005);
    browserGroup.add(navBarDivider);

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

    const bookSpineGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 10);
    const bookSpine = new THREE.Mesh(bookSpineGeom, material1.clone());
    lawBookGroup.add(bookSpine);

    const leftFoldGeom = new THREE.BoxGeometry(0.48, 0.85, 0.03);
    const leftFold = new THREE.Mesh(leftFoldGeom, material1.clone());
    leftFold.position.set(-0.25, 0, 0.08);
    leftFold.rotation.y = Math.PI / 10;
    lawBookGroup.add(leftFold);

    const rightFoldGeom = new THREE.BoxGeometry(0.48, 0.85, 0.03);
    const rightFold = new THREE.Mesh(rightFoldGeom, material1.clone());
    rightFold.position.set(0.25, 0, 0.08);
    rightFold.rotation.y = -Math.PI / 10;
    lawBookGroup.add(rightFold);

    const ribbonGeom = new THREE.BoxGeometry(0.06, 1.05, 0.04);
    const ribbon = new THREE.Mesh(ribbonGeom, material2.clone());
    ribbon.position.set(0, -0.1, 0.12);
    lawBookGroup.add(ribbon);

    lawBookGroup.position.set(3.2, 1.5, -1.2);
    scene.add(lawBookGroup);

    // Stars Particles background (Floating ambient space)
    const starsCount = 95;
    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xc8aa54,
      size: 0.042,
      transparent: true,
      opacity: 0.65,
    });

    const starParticles = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starParticles);

    // Parallax mouse variables
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const xRel = event.clientX - rect.left;
      const yRel = event.clientY - rect.top;

      targetMouse.x = (xRel / rect.width) * 2 - 1;
      targetMouse.y = -(yRel / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera looking lookups
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // 3D camera drift with cursor sway
      camera.position.x = mouse.x * 1.8;
      camera.position.y = mouse.y * 1.5;
      camera.position.z = 7 - (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.4;
      camera.lookAt(0, 0, 0);

      // Central Globe gentle bobbing and multi-axis spinning
      centralGlobeGroup.position.y = Math.sin(elapsedTime * 0.4) * 0.2 + mouse.y * 0.2;
      centralGlobeGroup.position.x = mouse.x * 0.2;
      centralGlobeGroup.rotation.y = elapsedTime * 0.15 + mouse.x * 0.3;
      centralGlobeGroup.rotation.x = mouse.y * 0.2;
      innerSphere.rotation.x = -elapsedTime * 0.05;
      outerSphere.rotation.z = elapsedTime * 0.08;
      ringMesh.rotation.z = elapsedTime * 0.25;
      ringMesh2.rotation.z -= elapsedTime * 0.3;

      // Bob & Rotate Legal Gavel structure
      gavelGroup.position.y = 1.4 + Math.sin(elapsedTime * 0.45) * 0.18 + mouse.y * 0.15;
      gavelGroup.position.x = -3.4 + mouse.x * 0.15;
      gavelGroup.rotation.x = elapsedTime * 0.15 + mouse.y * 0.2;
      gavelGroup.rotation.y = elapsedTime * 0.22 + mouse.x * 0.25;

      // Bob & Rotate Scale of Justice - tilting the beam dynamically to simulate weight balancing!
      scaleGroup.position.y = -1.2 + Math.sin(elapsedTime * 0.35 + 1.2) * 0.15 + mouse.y * 0.15;
      scaleGroup.position.x = 3.4 + mouse.x * 0.15;
      scaleGroup.rotation.y = elapsedTime * 0.1 + mouse.x * 0.2;
      
      const tiltVal = Math.sin(elapsedTime * 0.75) * 0.08 + mouse.y * 0.05;
      beamMesh.rotation.z = Math.PI / 2 + tiltVal;
      
      // Counter balance plates & string heights based on beam angle
      strLeft.position.y = 0.35 - tiltVal;
      plateLeft.position.y = 0.15 - tiltVal;
      strRight.position.y = 0.35 + tiltVal;
      plateRight.position.y = 0.15 + tiltVal;

      // Bob & Interactive pan of Web layout frame
      browserGroup.position.y = -1.4 + Math.sin(elapsedTime * 0.4 + 2.0) * 0.12 + mouse.y * 0.12;
      browserGroup.position.x = -3.2 + mouse.x * 0.12;
      browserGroup.rotation.y = Math.PI / 12 + Math.sin(elapsedTime * 0.15) * 0.18 + mouse.x * 0.25;
      browserGroup.rotation.x = Math.sin(elapsedTime * 0.25) * 0.06 + mouse.y * 0.15;

      // Bob & Rotate Law Book
      lawBookGroup.position.y = 1.5 + Math.sin(elapsedTime * 0.5 + 3.0) * 0.16 + mouse.y * 0.15;
      lawBookGroup.position.x = 3.2 + mouse.x * 0.15;
      lawBookGroup.rotation.x = elapsedTime * 0.12 + mouse.y * 0.25;
      lawBookGroup.rotation.y = elapsedTime * 0.2 + mouse.x * 0.2;

      // Slowly rotate starfield
      starParticles.rotation.y = elapsedTime * 0.03 + mouse.x * 0.08;
      starParticles.rotation.x = mouse.y * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-10 select-none overflow-hidden" id="interactive-3d-stage">
      {/* Primary 3D WebGL Web Canvas element */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
