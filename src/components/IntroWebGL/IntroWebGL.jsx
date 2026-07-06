import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { flavors } from '../../data/flavors';
import { SplitText } from '../../utils/SplitText';
import styles from './IntroWebGL.module.css';

const WAVE_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float bigWave = sin(pos.x * 0.8 + uTime * 1.2) * 0.45;
    float midWave = sin(pos.y * 1.4 + uTime * 1.6) * 0.25;
    float detailWave = sin((pos.x + pos.y) * 2.5 + uTime * 2.0) * 0.08;

    float elevation = (bigWave + midWave + detailWave) * uProgress;
    pos.z += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const WAVE_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform vec3 uHighlight;
  uniform float uProgress;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec3 color = mix(uColor * 0.9, uHighlight, vElevation * 0.8 + 0.1);
    float foam = smoothstep(0.35, 0.55, vElevation) * uProgress;
    color = mix(color, vec3(1.0), foam * 0.35);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const introCanConfigs = [
  { flavorIndex: 0, x: -2.6, y: 0.6, z: 0.4, rotation: 0.35 },
  { flavorIndex: 3, x: 2.4, y: 0.9, z: 0.2, rotation: -0.45 },
  { flavorIndex: 4, x: -1.1, y: 1.4, z: 0.8, rotation: 0.15 },
  { flavorIndex: 5, x: 1.4, y: 1.1, z: 0.5, rotation: -0.25 },
];

function MilkWave({ materialRef }) {
  return (
    <mesh ref={materialRef} rotation={[-Math.PI / 2.35, 0, 0]} position={[0, -1.2, 0]}>
      <planeGeometry args={[14, 10, 96, 64]} />
      <shaderMaterial
        vertexShader={WAVE_VERTEX_SHADER}
        fragmentShader={WAVE_FRAGMENT_SHADER}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uColor: { value: new THREE.Color('#FFF8F0') },
          uHighlight: { value: new THREE.Color('#FFFBF5') },
        }}
      />
    </mesh>
  );
}

function FloatingCan({ texture, config, progressRef, index }) {
  const meshRef = useRef();
  const startY = -3.2;
  const endY = config.y;
  const startRot = config.rotation + Math.PI;
  const endRot = config.rotation;

  useFrame((state) => {
    const p = progressRef.current.progress;
    const rise = Math.max(0, Math.min(1, (p - 0.25 - index * 0.04) * 1.8));
    const settle = Math.min(1, p * 2.5);

    if (meshRef.current) {
      const y = THREE.MathUtils.lerp(startY, endY, gsap.parseEase('back.out(1.2)')(rise));
      meshRef.current.position.y = y + Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.04 * settle;
      meshRef.current.position.x = config.x;
      meshRef.current.position.z = config.z;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(startRot, endRot + state.clock.elapsedTime * 0.25, settle);
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + index * 2) * 0.06 * settle;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(0.45, 1.05, settle));
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.6, 1.6]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.05} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Scene({ progressRef, textures }) {
  const waveRef = useRef();
  const { viewport } = useThree();

  useFrame((state) => {
    if (waveRef.current) {
      waveRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      waveRef.current.material.uniforms.uProgress.value = progressRef.current.waveHeight;
    }
  });

  const waveMesh = useMemo(
    () => <MilkWave materialRef={waveRef} />,
    []
  );

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      {waveMesh}
      {textures.map((texture, i) => (
        <FloatingCan
          key={introCanConfigs[i].flavorIndex}
          texture={texture}
          config={introCanConfigs[i]}
          progressRef={progressRef}
          index={i}
        />
      ))}
    </>
  );
}

export function IntroWebGL({ prefersReducedMotion, onComplete }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const logoMaskRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [textures, setTextures] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const progressRef = useRef({ progress: 0, waveHeight: 0 });
  const timelineRef = useRef(null);

  useEffect(() => {
    try {
      setHasSeenIntro(sessionStorage.getItem('moolyIntroSeen') === '1');
    } catch (e) {
      setHasSeenIntro(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.classList.add('intro-locked');
    } else {
      document.body.classList.remove('intro-locked');
    }
    return () => document.body.classList.remove('intro-locked');
  }, [visible]);

  useEffect(() => {
    const urls = introCanConfigs.map((c) => flavors[c.flavorIndex].img);
    const loader = new THREE.TextureLoader();
    Promise.all(
      urls.map(
        (url) =>
          new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
          })
      )
    )
      .then((loadedTextures) => {
        loadedTextures.forEach((t) => {
          t.minFilter = THREE.LinearFilter;
          t.generateMipmaps = false;
        });
        setTextures(loadedTextures);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded || !visible || hasSeenIntro) {
      if (hasSeenIntro) {
        finishIntro();
      }
      return;
    }

    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const logoMask = logoMaskRef.current;
    const progressBar = progressBarRef.current;
    const progressText = progressTextRef.current;

    gsap.set(logoMask, { clipPath: 'inset(50% 50% 50% 50% round 50%)' });
    gsap.set(logo.querySelectorAll('.char'), { opacity: 0, y: 24 });
    gsap.set(overlay, { clipPath: 'circle(150% at 50% 50%)' });

    const tl = gsap.timeline({
      onComplete: () => {
        finishIntro();
        try {
          sessionStorage.setItem('moolyIntroSeen', '1');
        } catch (e) {}
      },
    });
    timelineRef.current = tl;

    tl.to(
      progressRef.current,
      {
        progress: 1,
        duration: 5.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          const p = Math.round(progressRef.current.progress * 100);
          if (progressBar) progressBar.style.width = p + '%';
          if (progressText) progressText.textContent = p + '%';
        },
      },
      0
    );

    tl.to(
      progressRef.current,
      {
        waveHeight: 1,
        duration: 1.6,
        ease: 'power2.out',
      },
      0.2
    );
    tl.to(
      progressRef.current,
      {
        waveHeight: 0.35,
        duration: 2.8,
        ease: 'power2.inOut',
      },
      2.0
    );

    tl.to(
      logo.querySelectorAll('.char'),
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.05,
        ease: 'back.out(1.4)',
      },
      2.9
    );
    tl.to(
      logoMask,
      {
        clipPath: 'inset(0% 0% 0% 0% round 0%)',
        duration: 0.9,
        ease: 'power3.out',
      },
      2.8
    );

    tl.to(
      overlay,
      {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 1.05,
        ease: 'power3.inOut',
      },
      4.4
    );

    const handleClick = () => {
      tl.kill();
      finishIntro();
    };
    overlay.addEventListener('click', handleClick, { once: true });

    return () => {
      overlay.removeEventListener('click', handleClick);
      tl.kill();
    };
  }, [loaded, visible, hasSeenIntro]);

  const finishIntro = () => {
    setVisible(false);
    document.body.classList.remove('intro-locked');
    onComplete?.();
  };

  if (!visible) return null;

  return (
    <div ref={overlayRef} className={styles.introOverlay} aria-hidden="true">
      <div className={styles.canvasWrap}>
        {loaded && textures.length > 0 && (
          <Canvas
            camera={{ position: [0, 0, 5.5], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
          >
            <Scene progressRef={progressRef} textures={textures} />
          </Canvas>
        )}
      </div>

      <div ref={logoRef} className={styles.introLogo}>
        <div ref={logoMaskRef} className={styles.logoMask}>
          <SplitText>MooLy</SplitText>
        </div>
      </div>

      <div className={styles.introProgress}>
        <div ref={progressBarRef} className={styles.introProgressBar} />
        <span ref={progressTextRef} className={styles.introProgressText}>0%</span>
      </div>
    </div>
  );
}
