'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Gaussian Splat Renderer to ensure it only runs on the client-side
const GaussianSplatRenderer = dynamic(
  () => import('gaussian-splat-renderer-for-lam').then(mod => mod.GaussianSplatRenderer),
  { ssr: false }
);

interface AvatarViewerProps {
  assetPath?: string; // Path to the avatar model (e.g., a .zip file)
}

const AvatarViewer: React.FC<AvatarViewerProps> = ({ assetPath }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null); // Store the renderer instance

  useEffect(() => {
    if (containerRef.current && GaussianSplatRenderer) {
      const initializeRenderer = async () => {
        try {
          // Initialize the renderer
          const renderer = await GaussianSplatRenderer.getInstance(
            containerRef.current!,
            assetPath || './asset/arkit/p2-1.zip' // Use provided assetPath or a default sample
          );
          rendererRef.current = renderer;

          // Basic camera control (you might want more advanced controls)
          // renderer.setCameraPosition(0, 0, 5);
          // renderer.setCameraLookAt(0, 0, 0);

          // Start rendering loop
          renderer.startRender();

          console.log('Gaussian Splat Renderer initialized and rendering started.');
        } catch (error) {
          console.error('Error initializing Gaussian Splat Renderer:', error);
        }
      };

      initializeRenderer();

      // Cleanup function
      return () => {
        if (rendererRef.current) {
          rendererRef.current.dispose();
          rendererRef.current = null;
          console.log('Gaussian Splat Renderer disposed.');
        }
      };
    }
  }, [assetPath]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '500px', background: '#000' }}
    >
      {!rendererRef.current && (
        <div style={{ color: 'white', textAlign: 'center', paddingTop: '200px' }}>
          Loading Avatar Viewer...
        </div>
      )}
    </div>
  );
};

export default AvatarViewer;
