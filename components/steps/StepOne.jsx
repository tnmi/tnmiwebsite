"use client";
import React, { useState, useEffect } from 'react';

// Complete StepOne component with hexagon animations

export default function StepOne({ onComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setIsUploading(true);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      if (onComplete) onComplete();
    }, 2000);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      if (onComplete) onComplete();
    }, 2000);
  };

  // Hexagon component with glassmorphism liquid glass effect
  const Hexagon = ({ size, opacity = 1 }) => (
    <div 
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '12px',
        opacity: opacity,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.05)',
        mixBlendMode: 'overlay',
        borderRadius: 'inherit',
        pointerEvents: 'none',
      }}></div>
    </div>
  );

  return (
    <section className="relative z-10 py-36 px-6 max-w-7xl mx-auto text-white overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl pointer-events-none z-0 border border-white/10 shadow-inner" />
      <div className="absolute -top-40 -left-40 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-10 blur-3xl pointer-events-none z-0" />
      {/* Floating background hexagons */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <Hexagon 
              size="64px" 
              opacity={1}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400 mb-10 px-6 sm:px-12 pt-12 pb-16 text-center">
          Upload Your Tech Sheet
        </h1>
        <div className="text-center mb-8">
          <p className="text-xl text-gray-300">
            Drop your files into the hexagon portal below
          </p>
        </div>

        <div
          className={`relative w-full h-96 rounded-3xl transition-all duration-500 transform ${
            isDragging 
              ? 'scale-105 shadow-2xl shadow-cyan-400/50' 
              : 'scale-100 shadow-xl shadow-purple-400/30'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            background: isDragging
              ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            backdropFilter: 'blur(20px)',
            border: isDragging
              ? '3px solid rgba(6, 182, 212, 0.8)'
              : '2px solid rgba(148, 163, 184, 0.3)',
          }}
        >
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          {/* Hexagon Grid Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Main hexagon formation */}
              <div 
                style={{
                  transform: isDragging ? 'rotate(360deg)' : 'rotate(0deg)',
                  transition: 'transform 3s linear infinite',
                  animation: isDragging ? 'spin 3s linear infinite' : 'none'
                }}
              >
                {[...Array(19)].map((_, i) => {
                  const angle = (i * 360) / 19;
                  const radius = 80 + (i % 3) * 40;
                  const x = Math.cos(angle * Math.PI / 180) * radius;
                  const y = Math.sin(angle * Math.PI / 180) * radius;
                  
                  return (
                    <div
                      key={i}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    >
                      <div 
                        className={isDragging ? 'animate-bounce' : 'animate-pulse'}
                        style={{
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        <Hexagon 
                          size="32px" 
                          opacity={0.7}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Center hexagon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div 
                  style={{
                    transition: 'all 0.3s ease',
                    transform: isDragging ? 'scale(1.25)' : 'scale(1)',
                    animation: isDragging ? 'spin 2s linear infinite' : 'pulse 2s ease-in-out infinite'
                  }}
                >
                  <Hexagon 
                    size="64px" 
                    opacity={1}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Upload status overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl">
              <div className="text-center">
                <div className="mb-4 flex justify-center items-center">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="inline-block w-5 h-5 bg-cyan-400 mx-1 animate-bounce"
                      style={{
                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                        margin: '0 4px',
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>
                <p className="text-2xl font-bold text-white"></p>
              </div>
            </div>
          )}

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            {isDragging ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="text-4xl animate-bounce">🚀</div>
                <p className="text-2xl font-bold text-white">
                  Drop to Launch Upload!
                </p>
                <p className="text-lg text-cyan-300">
                  Files will be processed instantly
                </p>
              </div>
            ) : files.length > 0 && !isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="text-4xl">✨</div>
                <p className="text-xl font-bold text-white">
                  {files.length} file{files.length > 1 ? 's' : ''} ready!
                </p>
                <div className="text-sm text-gray-300 flex flex-col items-center space-y-1">
                  {files.map((file, i) => (
                    <div key={i}>{file.name}</div>
                  ))}
                </div>
              </div>
            ) : !isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="text-4xl animate-bounce">📄</div>
                <p className="text-xl font-bold text-white">
                  Drop your tech sheet here
                </p>
                <p className="text-lg text-gray-300">
                  or click to browse files
                </p>
              </div>
            ) : (<div></div>)}
          </div>

          {/* Particle effects */}
          {isDragging && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              files.length > 0 ? 'bg-cyan-400' : 'bg-gray-600'
            }`}></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Step 1 of 3</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}