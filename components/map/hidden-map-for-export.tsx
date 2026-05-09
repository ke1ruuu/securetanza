"use client";

import React, { useEffect, useRef, useState } from "react";

interface MapScreenshotCaptureProps {
  onMapReady: (mapElement: HTMLElement) => void;
}

export default function MapScreenshotCapture({ onMapReady }: MapScreenshotCaptureProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('🖼️ Map screenshot capture component mounted');

    if (iframeRef.current && !isReady) {
      const iframe = iframeRef.current;
      
      // Wait for iframe to load
      const handleLoad = () => {
        console.log('🖼️ Iframe loaded, waiting for map to render...');
        
        // Wait for map to fully render
        setTimeout(() => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              // Find the map container in the iframe
              const mapContainer = iframeDoc.querySelector('.leaflet-container')?.parentElement;
              
              if (mapContainer) {
                console.log('✅ Map container found in iframe:', mapContainer);
                onMapReady(mapContainer as HTMLElement);
                setIsReady(true);
              } else {
                console.error('❌ Map container not found in iframe');
              }
            }
          } catch (error) {
            console.error('❌ Error accessing iframe content:', error);
          }
        }, 3000); // Wait 3 seconds for map to fully load
      };

      iframe.addEventListener('load', handleLoad);

      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, [onMapReady, isReady]);

  console.log('🖼️ Rendering iframe for map capture');

  return (
    <iframe
      ref={iframeRef}
      src="/"
      style={{
        position: 'fixed',
        left: '-9999px',
        top: '0',
        width: '1200px',
        height: '800px',
        border: 'none',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      title="Map Screenshot Capture"
    />
  );
}

