import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';

interface ThreeDModelProps {
  lat: number;
  lng: number;
}

export function ThreeDModel({ lat, lng }: ThreeDModelProps) {
  const timeoutRef = useRef<number>();

  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    
    // Create renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Create a simple land cube based on GPS coordinates
    const geometry = new THREE.BoxGeometry(2, 0.2, 2);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00,
      wireframe: false 
    });
    const landCube = new THREE.Mesh(geometry, material);
    
    // Position based on GPS (simplified mapping)
    landCube.position.x = (lat % 1) * 10 - 5;
    landCube.position.z = (lng % 1) * 10 - 5;
    
    scene.add(landCube);

    // Add some lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    const render = () => {
      timeoutRef.current = requestAnimationFrame(render);
      
      // Rotate the land cube
      landCube.rotation.y += 0.01;
      
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        cancelAnimationFrame(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
      <View style={styles.overlay}>
        <Text style={styles.coordinatesText}>
          Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  glView: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  coordinatesText: {
    color: 'white',
    fontSize: 12,
  },
});
