import React, { useEffect, useState } from 'react'
import * as THREE from 'three'
import ModelPlaceholder from './ModelPlaceholder'

interface ModelLoaderProps {
  src?: string
  scale?: number
  className?: string
}

// Dynamic loader that imports GLTFLoader at runtime to avoid static build
// dependency on three/examples types. Falls back to a placeholder while
// loading or on error.
export const ModelLoader: React.FC<ModelLoaderProps> = ({ src, scale = 1, className }) => {
  const [scene, setScene] = useState<THREE.Object3D | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    if (!src) return

    // dynamic import of GLTFLoader and DRACOLoader
    // Dynamic imports; ts may not have typings for three/examples so ignore
    // @ts-ignore
    const p1 = import('three/examples/jsm/loaders/GLTFLoader').then(m => (m as any).GLTFLoader)
    // @ts-ignore
    const p2 = import('three/examples/jsm/loaders/DRACOLoader').then(m => (m as any).DRACOLoader).catch(() => undefined)

    Promise.all([p1, p2]).then(async ([GLTFLoader, DRACOLoader]) => {
      try {
        const loader: any = new GLTFLoader()
        if (DRACOLoader) {
          const draco = new DRACOLoader()
          // leave default decoder path; projects can set as needed
          loader.setDRACOLoader(draco)
        }

        const gltf = await loader.loadAsync(src)
        if (!mounted) return
        if (gltf && gltf.scene) setScene(gltf.scene.clone())
      } catch (e: any) {
        if (!mounted) return
        setError(e)
        console.error('ModelLoader error loading', src, e)
      }
    }).catch((e) => {
      if (!mounted) return
      setError(e)
      console.error('Failed to import GLTF/DRACO loaders', e)
    })

    return () => { mounted = false }
  }, [src])

  if (!src) return <ModelPlaceholder size={1 * scale} color="#66ccff" />
  if (error) return <ModelPlaceholder size={1 * scale} color="#ff6666" />
  if (!scene) return <ModelPlaceholder size={1 * scale} color="#444" />

  return (
    <primitive object={scene} scale={[scale, scale, scale]} className={className} />
  )
}

export default ModelLoader
