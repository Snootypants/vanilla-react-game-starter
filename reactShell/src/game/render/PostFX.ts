import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

let composer: EffectComposer
let outlinePass: OutlinePass
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.Camera
let useComposerFlag = false

// VignetteShader copied verbatim from vanilla
const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 1.15 },
    darkness: { value: 0.55 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float offset; uniform float darkness; varying vec2 vUv; void main(){ vec4 texel = texture2D(tDiffuse, vUv); vec2 uv = vUv - 0.5; float vignette = smoothstep(0.8, offset, length(uv)); gl_FragColor = vec4(texel.rgb*(1.0 - vignette*darkness), texel.a); }`
}

export function createComposer(
  rendererParam: THREE.WebGLRenderer,
  sceneParam: THREE.Scene,
  cameraParam: THREE.Camera,
  size: { width: number; height: number }
) {
  renderer = rendererParam
  scene = sceneParam
  camera = cameraParam

  // Set renderer properties to match vanilla exactly
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  // Create composer
  composer = new EffectComposer(renderer)
  composer.setSize(size.width, size.height)
  
  // Add render pass
  composer.addPass(new RenderPass(scene, camera))
  
  // Add outline pass
  outlinePass = new OutlinePass(
    new THREE.Vector2(size.width, size.height),
    scene,
    camera
  )
  outlinePass.edgeStrength = 3.0
  outlinePass.edgeGlow = 0.4
  outlinePass.edgeThickness = 1.0
  outlinePass.pulsePeriod = 0.0
  outlinePass.visibleEdgeColor.set(0xd7f0ff)
  outlinePass.hiddenEdgeColor.set(0x111319)
  composer.addPass(outlinePass)
  
  // Add bloom pass with exact vanilla parameters
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(size.width, size.height),
    0.9,  // strength
    0.8,  // radius  
    0.85  // threshold
  )
  bloom.threshold = 0.2
  bloom.strength = 1.25
  bloom.radius = 0.6
  composer.addPass(bloom)

  // Add vignette pass
  const vignettePass = new ShaderPass(VignetteShader)
  composer.addPass(vignettePass)

  return {
    composer,
    resize,
    render,
    setUseComposer
  }
}

export function resize(width: number, height: number) {
  renderer.setSize(width, height)
  composer.setSize(width, height)
  outlinePass.setSize(width, height)
}

export function render(delta: number) {
  return useComposerFlag ? composer.render(delta) : renderer.render(scene, camera)
}

export function setUseComposer(flag: boolean) {
  useComposerFlag = !!flag
}

export { composer }