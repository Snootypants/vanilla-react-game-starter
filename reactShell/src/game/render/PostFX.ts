import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

export function createComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  size: { width: number; height: number }
) {
  // Set renderer properties to match vanilla
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  // Create composer
  const composer = new EffectComposer(renderer)
  composer.setSize(size.width, size.height)
  
  // Add render pass
  composer.addPass(new RenderPass(scene, camera))
  
  // Add outline pass
  const outlinePass = new OutlinePass(
    new THREE.Vector2(size.width, size.height),
    scene,
    camera
  )
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

  return {
    composer,
    resize: (width: number, height: number) => {
      composer.setSize(width, height)
      outlinePass.setSize(width, height)
    },
    render: (delta: number) => {
      composer.render(delta)
    }
  }
}