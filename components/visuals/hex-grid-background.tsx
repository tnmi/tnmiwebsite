"use client";

import { useEffect, useRef } from "react";

export default function HexGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const hexRadius = 20;
    const hexHeight = 1.5 * hexRadius;
    const hexWidth = 2 * hexRadius;
    const vertDist = hexHeight;
    const horizDist = hexWidth * 0.75;

    let scrollY = window.scrollY;

    const hexes: { x: number; y: number; offset: number }[] = [];

    for (let y = 0; y < height + hexHeight; y += vertDist) {
      for (let x = 0; x < width + hexWidth; x += horizDist) {
        const xOffset = ((y / vertDist) % 2 === 0 ? 0 : hexWidth / 2);
        const offset = Math.random() * 2 * Math.PI;
        hexes.push({ x: x + xOffset, y, offset });
      }
    }

    const drawHex = (x: number, y: number, radius: number, opacity: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 3 * i;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;

      for (const hex of hexes) {
        const float = Math.sin(time + hex.offset) * 2;
        const scrollShift = scrollY * 0.05;
        const yPos = hex.y + float + scrollShift;
        const visible = yPos >= -hexRadius && yPos <= height + hexRadius;
        if (visible) {
          const opacity = 0.1 + 0.05 * Math.sin(time + hex.offset);
          drawHex(hex.x, yPos, hexRadius, opacity);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
