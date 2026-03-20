'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMousePositionRef } from '@/components/ui/use-mouse-position-ref';

function BasicDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useMousePositionRef(containerRef);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      setPosition({ ...positionRef.current });
    };
    const interval = setInterval(updatePosition, 16); // ~60fps
    return () => clearInterval(interval);
  }, [positionRef]);

  return (
    <div className="space-y-2 w-[400px]">
      <h3 className="text-lg font-medium">Basic Tracking</h3>
      <div
        ref={containerRef}
        className="h-[300px] rounded-xl border bg-muted/30 relative overflow-hidden"
      >
        <motion.div
          className="w-4 h-4 bg-blue-500 rounded-full absolute"
          style={{
            x: position.x - 8,
            y: position.y - 8,
          }}
          transition={{ type: 'spring', damping: 20 }}
        />
        <div className="absolute bottom-4 left-4 font-mono text-sm">
          x: {Math.round(position.x)}, y: {Math.round(position.y)}
        </div>
      </div>
    </div>
  );
}

function InteractiveDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useMousePositionRef(containerRef);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      setPosition({ ...positionRef.current });
    };
    const interval = setInterval(updatePosition, 16);
    return () => clearInterval(interval);
  }, [positionRef]);

  return (
    <div className="space-y-2 w-[400px]">
      <h3 className="text-lg font-medium">Interactive Elements</h3>
      <div
        ref={containerRef}
        className="h-[300px] rounded-xl border bg-muted/30 relative"
      >
        <motion.h2
          className="absolute text-3xl font-bold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            rotate: (position.x - (containerRef.current?.clientWidth || 0) / 2) * 0.02,
            scale: 1 + (position.y / (containerRef.current?.clientHeight || 1)) * 0.001,
          }}
        >
          Move Mouse
        </motion.h2>
      </div>
    </div>
  );
}

function GradientDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useMousePositionRef(containerRef);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      setPosition({ ...positionRef.current });
    };
    const interval = setInterval(updatePosition, 16);
    return () => clearInterval(interval);
  }, [positionRef]);

  return (
    <div className="space-y-2 w-[400px]">
      <h3 className="text-lg font-medium">Dynamic Gradient</h3>
      <div
        ref={containerRef}
        className="h-[300px] rounded-xl border relative overflow-hidden"
      >
        <div
          className="w-full h-full absolute transition-[background] duration-75"
          style={{
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          Hover to move gradient
        </div>
      </div>
    </div>
  );
}

function DocumentationCard() {
  return (
    <div className="space-y-4 p-6 rounded-xl border">
      <h3 className="text-lg font-medium">useMousePositionRef</h3>
      <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
        {`const positionRef = useMousePositionRef(containerRef)

// Access current position
const { x, y } = positionRef.current`}
      </pre>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium mb-2">Features</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Reference-based updates</li>
            <li>No re-renders</li>
            <li>Container-relative</li>
            <li>Touch support</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Use Cases</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Interactive animations</li>
            <li>Cursor effects</li>
            <li>Dynamic gradients</li>
            <li>Mouse tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export { BasicDemo, InteractiveDemo, GradientDemo, DocumentationCard };
