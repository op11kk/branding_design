import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import './styles.css'

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const ease = (value) => value * value * (3 - 2 * value)

function ProductStage({ progressRef, onReady }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100)
    camera.position.set(0, 0, 4.35)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    mount.appendChild(renderer.domElement)

    const product = new THREE.Group()
    const model = new THREE.Group()
    product.add(model)
    scene.add(product)

    const opaqueMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x171b1e,
      metalness: 0.58,
      roughness: 0.17,
      clearcoat: 0.82,
      clearcoatRoughness: 0.16,
    })
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x222c31,
      metalness: 0.1,
      roughness: 0.3,
      transmission: 0,
      thickness: 0.18,
      ior: 1.42,
      transparent: true,
      opacity: 0.9,
      clearcoat: 0.78,
      clearcoatRoughness: 0.18,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    scene.add(new THREE.HemisphereLight(0xd9f3ff, 0x100804, 2.7))

    const keyLight = new THREE.DirectionalLight(0xeaf8ff, 5.2)
    keyLight.position.set(3.2, 4.5, 6.8)
    keyLight.castShadow = true
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x9ec9dd, 4.1)
    fillLight.position.set(-5, -1, 3)
    scene.add(fillLight)

    const signalLight = new THREE.PointLight(0xff4d12, 24, 9, 1.7)
    signalLight.position.set(-2.4, -1.4, 2.1)
    scene.add(signalLight)

    const loader = new GLTFLoader()
    let alive = true

    loader.loadAsync('/models/eagle-clip.glb').then((asset) => {
      if (!alive) return
      asset.scene.traverse((child) => {
        if (!child.isMesh) return
        const identity = `${child.name} ${child.geometry.name}`.toLowerCase()
        const isGlass = identity.includes('glass')
        child.material = isGlass ? glassMaterial : opaqueMaterial
        child.castShadow = !isGlass
        child.receiveShadow = !isGlass
        child.renderOrder = isGlass ? 2 : 1
      })
      const bounds = new THREE.Box3().setFromObject(asset.scene)
      const center = bounds.getCenter(new THREE.Vector3())
      const size = bounds.getSize(new THREE.Vector3())
      asset.scene.position.sub(center)
      model.add(asset.scene)
      product.scale.setScalar(1.88 / Math.max(size.x, size.y, size.z))
      onReady()
    }).catch((error) => {
      console.error('Unable to load Eagle Clip model', error)
    })

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(mount)

    let frame = 0
    let current = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const render = (time) => {
      const target = reducedMotion ? 0.14 : progressRef.current
      current += (target - current) * 0.075
      const p = clamp(current)

      product.rotation.x = -0.08 + Math.sin(p * Math.PI * 1.15) * 0.18
      product.rotation.y = -0.2 + p * Math.PI * 3.6
      product.rotation.z = -0.055 + Math.sin(p * Math.PI * 2) * 0.12
      const scalePulse = 1 + ease(clamp((p - 0.2) / 0.28)) * 0.17 - ease(clamp((p - 0.72) / 0.24)) * 0.1
      product.scale.multiplyScalar(scalePulse / (product.userData.lastScale || 1))
      product.userData.lastScale = scalePulse
      product.position.x = Math.sin(p * Math.PI) * (window.innerWidth > 780 ? 0.22 : 0.05)
      product.position.y = Math.sin(p * Math.PI * 2) * 0.08

      signalLight.position.x = -2.4 + p * 5
      signalLight.intensity = 18 + Math.sin(time * 0.002) * 4
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      opaqueMaterial.dispose()
      glassMaterial.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [onReady, progressRef])

  return <div className="product-stage" ref={mountRef} aria-hidden="true" />
}

const storyBeats = [
  {
    index: '01',
    kicker: 'WEAR',
    title: <>别改变生活。<br />只需戴上它。</>,
    body: '佩戴在衣领下、胸口中央。Eagle Clip 以第一人称视角自然融入每一天。',
  },
  {
    index: '02',
    kicker: 'CAPTURE',
    title: <>不是摆拍。<br />是真实发生。</>,
    body: '移动、烹饪、整理、触碰——机器人需要理解的，正是普通人已经会做的事。',
  },
  {
    index: '03',
    kicker: 'FILTER',
    title: <>留下有用片段，<br />而不是生活噪音。</>,
    body: 'AI 从日常视频中筛选对 Physical AI 训练有价值的真实世界片段。',
  },
  {
    index: '04',
    kicker: 'CONTRIBUTE',
    title: <>真实生活，<br />训练真实智能。</>,
    body: '让每个人都能成为 Physical AI 数据网络的一部分。低门槛、可持续、面向真实世界。',
  },
]

function App() {
  const heroRef = useRef(null)
  const progressRef = useRef(0)
  const [activeBeat, setActiveBeat] = useState(0)
  const [modelReady, setModelReady] = useState(false)
  const handleModelReady = useCallback(() => setModelReady(true), [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      const hero = heroRef.current
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1)
      const progress = clamp(-rect.top / travel)
      progressRef.current = progress
      document.documentElement.style.setProperty('--story-progress', progress.toFixed(4))
      const nextBeat = Math.min(3, Math.floor(progress * 4.15))
      setActiveBeat((previous) => previous === nextBeat ? previous : nextBeat)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Eagle Clip 首页">
          <span className="wordmark-mark" aria-hidden="true">EC</span>
          <span>EAGLE CLIP</span>
        </a>
        <nav aria-label="主要导航">
          <a href="#story">产品</a>
          <a href="#principles">原理</a>
          <a href="#trust">信任</a>
        </nav>
        <a className="header-cta" href="#contact">加入早期体验 <span>↗</span></a>
      </header>

      <main id="top">
        <section className={`hero ${modelReady ? 'is-ready' : ''}`} id="story" ref={heroRef}>
          <div className="hero-sticky">
            <div className="technical-grid" aria-hidden="true" />
            <div className="signal-line" aria-hidden="true"><i /></div>
            <div className="hero-brand" aria-hidden={activeBeat !== 0}>
              <p className="hero-overline">CONSUMER HARDWARE FOR PHYSICAL AI</p>
              <h1><span>EAGLE</span><span>CLIP</span></h1>
              <p className="hero-statement">REAL LIFE TRAINS<br /><em>REAL INTELLIGENCE.</em></p>
            </div>

            <ProductStage progressRef={progressRef} onReady={handleModelReady} />

            <div className="model-loader" role="status" aria-live="polite">
              <span /> {modelReady ? 'MODEL READY' : 'LOADING PRODUCT GEOMETRY'}
            </div>

            <div className="story-copy" aria-live="polite">
              {storyBeats.map((beat, index) => (
                <article className={`story-beat ${activeBeat === index ? 'is-active' : ''}`} key={beat.index} aria-hidden={activeBeat !== index}>
                  <div className="beat-meta"><span>{beat.index}</span><span>{beat.kicker}</span></div>
                  <h2>{beat.title}</h2>
                  <p>{beat.body}</p>
                </article>
              ))}
            </div>

            <div className="form-readout" aria-label="产品三维图纸尺寸">
              <span>FORM STUDY</span>
              <strong>47.5 × 51.2 × 14.6</strong>
              <small>MM / SOURCE GEOMETRY</small>
            </div>

            <div className="scroll-cue" aria-hidden="true">
              <span>SCROLL TO EXPLORE</span><i />
            </div>
          </div>
        </section>

        <section className="principles" id="principles">
          <div className="section-index">01 — HOW IT WORKS</div>
          <div className="principles-heading">
            <p>一枚消费级设备，<br />连接两种智能。</p>
            <h2>你负责生活。<br />Eagle Clip 负责看见。</h2>
          </div>
          <ol className="flow-list">
            <li><span>01</span><h3>佩戴</h3><p>夹在衣领下方、胸口中央，保持自然的第一人称视角。</p></li>
            <li><span>02</span><h3>采集</h3><p>把普通生活中真实发生的动作与交互，转化为连续视频。</p></li>
            <li><span>03</span><h3>筛选</h3><p>AI 识别值得保留的训练片段，减少无效数据。</p></li>
            <li><span>04</span><h3>贡献</h3><p>有价值的真实世界数据进入 Physical AI 训练流程。</p></li>
          </ol>
        </section>

        <section className="trust" id="trust">
          <div className="trust-orbit" aria-hidden="true"><span>CAPTURE</span><span>FILTER</span><span>CONTROL</span></div>
          <div className="trust-copy">
            <div className="section-index">02 — TRUST BY DESIGN</div>
            <h2>摄像头要被信任，<br />不能只靠一句承诺。</h2>
            <p>正式产品页面会把采集状态、用户控制、隐私筛选和数据去向放在首屏叙事里，而不是藏进条款。</p>
            <div className="trust-note"><span>DESIGN PRINCIPLE</span><strong>Visible capture. Clear control.</strong></div>
          </div>
        </section>

        <section className="contact" id="contact">
          <p>EAGLE CLIP / EARLY ACCESS</p>
          <h2>让真实世界，<br />成为机器人最好的老师。</h2>
          <a href="mailto:hello@ubl.ai">加入早期体验 <span>↗</span></a>
          <small>当前为视觉与交互原型。正式文案、联系方式及产品参数将在下一版替换。</small>
        </section>
      </main>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
