import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCw, Move } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageAlt: string;
  onClose: () => void;
}

export default function ImageZoomModal({ isOpen, imageUrl, imageAlt, onClose }: ImageZoomModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when opening/changing image
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [isOpen, imageUrl]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setScale(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 }); // reset pan on full zoom out
      return next;
    });
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pinch zoom & pan
  const touchStartDist = useRef(0);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      if (scale > 1) {
        setIsDragging(true);
        const touch = e.touches[0];
        dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
      }
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDist.current = dist;
      touchStartPos.current = { x: position.x, y: position.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.current.x,
        y: touch.clientY - dragStart.current.y
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDist.current;
      setScale(prev => Math.min(Math.max(1, prev * (factor > 1 ? 1.05 : 0.95)), 4));
      touchStartDist.current = dist; // update dist iteratively
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-4 touch-none select-none"
        >
          {/* Header Controls */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-[210]">
            <div className="text-slate-300 text-sm font-medium line-clamp-1 max-w-[60%] bg-slate-900/55 px-3 py-1.5 rounded-full backdrop-blur-xs">
              {imageAlt}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomIn}
                className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={handleRotate}
                className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors text-white cursor-pointer"
                title="Rotate"
              >
                <RotateCw size={18} />
              </button>
              {(scale > 1 || rotation !== 0 || position.x !== 0 || position.y !== 0) && (
                <button
                  onClick={handleReset}
                  className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer transition-colors"
                >
                  คืนค่าเริ่มแรก
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-rose-600/85 hover:bg-rose-500 transition-colors text-white cursor-pointer ml-2"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Interactive Zoom Stage */}
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden cursor-default relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
          >
            <motion.div
              style={{
                x: position.x,
                y: position.y,
                scale: scale,
                rotate: rotation,
              }}
              className="max-w-[95%] max-h-[85%] flex items-center justify-center transition-transform duration-100 ease-out"
            >
              <img
                src={imageUrl}
                alt={imageAlt}
                draggable={false}
                className={`max-w-full max-h-screen object-contain rounded-xl shadow-2xl ${
                  scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''
                }`}
              />
            </motion.div>

            {/* Scale indicator and pan warning */}
            {scale > 1 && (
              <div className="absolute bottom-6 bg-slate-900/80 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 flex items-center gap-2 text-xs text-slate-300">
                <Move size={14} className="text-indigo-400 animate-pulse" />
                <span>ซูม {scale.toFixed(1)}x • ลากเพื่อเลื่อนดูรายละเอียด</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
