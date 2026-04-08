import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    let mouseX = w / 2;
    let mouseY = h / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // KSU Blue Configuration: Clean Interactive Plexus (LIGHT THEME)
    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      color: string;
    }
    
    const nodes: Node[] = [];
    const colors = [
      '#2563eb', // Electric Blue
      '#8b5cf6', // Violet
      '#06b6d4', // Cyan
      '#f59e0b', // Amber
      '#ec4899'  // Pink
    ]; 
    // Keep particle count slightly higher for more color density
    // Massive particle count for a truly dense, colorful "cloud" effect
    const count = Math.min(window.innerWidth / 6, 200); 
    
    for (let i = 0; i < count; i++) {
        nodes.push({
            x: Math.random() * w, 
            y: Math.random() * h,
            radius: Math.random() * 1.5 + 1, 
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 0.8, // Increased initial speed
            vy: (Math.random() - 0.5) * 0.8  // Increased initial speed
        });
    }

    let animationId: number;

    const render = () => {
      // Background base: Pure White / Light Slate
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Higher connection distance for a denser "web"
      const connectionDistance = 160;

      for (let i = 0; i < nodes.length; i++) {
         const node = nodes[i];

         // Mouse interaction - Wider attraction radius
         const dxMouse = targetMouseX - node.x;
         const dyMouse = targetMouseY - node.y;
         const distMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
         
         if (distMouse < 250) {
             const force = (250 - distMouse) / 250;
             // Gently push nodes away from the cursor perfectly, creating a natural interaction
             node.vx -= (dxMouse / distMouse) * force * 0.025;
             node.vy -= (dyMouse / distMouse) * force * 0.025;
         }

         // Base physics - Slightly less friction for more persistence
         node.vx *= 0.995;
         node.vy *= 0.995;

         // ORGANIC FLOW: Higher intensity sine/cosine movement
         const time = Date.now() * 0.0008;
         const flowX = Math.sin(time * 0.4 + node.y * 0.008) * 0.35;
         const flowY = Math.cos(time * 0.4 + node.x * 0.008) * 0.35;
         
         node.x += node.vx + flowX;
         node.y += node.vy + flowY;
         
         // Smooth screen wrapping
         if (node.x > w + 50) node.x = -50;
         if (node.x < -50) node.x = w + 50;
         if (node.y > h + 50) node.y = -50;
         if (node.y < -50) node.y = h + 50;

         // Draw Plexus lines FIRST so they sit behind the nodes
         for (let j = i + 1; j < nodes.length; j++) {
             const nodeB = nodes[j];
             const dx = node.x - nodeB.x;
             const dy = node.y - nodeB.y;
             const dist = Math.sqrt(dx*dx + dy*dy);
             
             if (dist < connectionDistance) {
                 ctx.beginPath();
                 const alpha = 1 - (dist / connectionDistance);
                 // The line inherits a unified blue semi-transparent appearance
                 ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.25})`; // KSU Blue
                 ctx.lineWidth = 0.6; // Extremely thin to ensure it NEVER looks messy
                 ctx.moveTo(node.x, node.y);
                 ctx.lineTo(nodeB.x, nodeB.y);
                 ctx.stroke();
             }
         }
         
         // Special bright Connection from Mouse to nearby nodes
         if (distMouse < connectionDistance * 1.5) {
             ctx.beginPath();
             const mouseAlpha = 1 - (distMouse / (connectionDistance * 1.5));
             ctx.strokeStyle = `rgba(30, 64, 175, ${mouseAlpha * 0.4})`; // Darker Blue Mouse Nexus
             ctx.lineWidth = 0.8;
             ctx.moveTo(node.x, node.y);
             ctx.lineTo(targetMouseX, targetMouseY);
             ctx.stroke();
         }
      }

      // Draw the nodes LAST so they perfectly cap the lines
      for (const node of nodes) {
         ctx.beginPath();
         ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
         ctx.fillStyle = node.color;
         // Give nodes a soft 'glow' drop shadow
         ctx.shadowBlur = 4;
         ctx.shadowColor = node.color;
         ctx.fill();
         ctx.shadowBlur = 0; // Reset
      }

      // Overlaid center radial glow for depth
      const rimLight = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h) * 0.8);
      rimLight.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
      rimLight.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = rimLight;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      targetMouseX = w / 2;
      targetMouseY = h / 2;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-white">
       
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-100" />
       
       {/* Cinematic Film Grain Overlay */}
       <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-multiply pointer-events-none">
         <filter id="noiseFilter">
           <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
         </filter>
         <rect width="100%" height="100%" filter="url(#noiseFilter)" />
       </svg>

       {/* Top and Bottom Fade Overlays */}
       <div className="absolute top-0 left-0 right-0 h-[10%] bg-gradient-to-b from-white to-transparent pointer-events-none" />
       <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}
