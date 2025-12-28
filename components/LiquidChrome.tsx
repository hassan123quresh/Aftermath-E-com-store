import React, { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

interface LiquidChromeProps {
  baseColor?: number[];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
  [key: string]: any;
}

export const LiquidChrome: React.FC<LiquidChromeProps> = ({
  baseColor = [0.1, 0.1, 0.1],
  speed = 0.2,
  amplitude = 0.3,
  frequencyX = 3,
  frequencyY = 3,
  interactive = true,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    let renderer: any;
    let animationId: number;
    let gl: any;
    let isVisible = true;

    try {
        renderer = new Renderer({ 
            powerPreference: "high-performance",
            antialias: false, 
            alpha: true, 
            // Cap DPR to 2 to improve performance on high-res displays (Retina/Mobile)
            // This significantly reduces initialization lag and frame stutter
            dpr: Math.min(window.devicePixelRatio || 1, 2) 
        });
        gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
    } catch (e) {
        console.error("WebGL init failed:", e);
        return;
    }

    // Ensure canvas fills container immediately via CSS
    gl.canvas.style.display = 'block';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    
    container.appendChild(gl.canvas);

    const vertexShader = `
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
    }
    `;

    const fragmentShader = `
    precision highp float;
    uniform float uTime;
    uniform vec3 uResolution;
    uniform vec3 uBaseColor;
    uniform float uAmplitude;
    uniform float uFrequencyX;
    uniform float uFrequencyY;
    uniform vec2 uMouse;
    varying vec2 vUv;

    vec4 renderImage(vec2 uvCoord) {
        vec2 fragCoord = uvCoord * uResolution.xy;
        vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

        for (float i = 1.0; i < 6.0; i++){ 
            uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
            uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
        }

        vec2 diff = (uvCoord - uMouse);
        float dist = length(diff);
        float falloff = exp(-dist * 20.0);
        float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
        uv += (diff / (dist + 0.0001)) * ripple * falloff;

        vec3 color = uBaseColor / (abs(sin(uTime - uv.y - uv.x)) + 0.001);
        return vec4(color, 1.0);
    }

    void main() {
        gl_FragColor = renderImage(vUv);
    }
    `;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            // Initial resolution
            uResolution: { value: new Float32Array([gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height]) },
            uBaseColor: { value: new Float32Array(baseColor) },
            uAmplitude: { value: amplitude },
            uFrequencyX: { value: frequencyX },
            uFrequencyY: { value: frequencyY },
            uMouse: { value: new Float32Array([0, 0]) } 
        }
    });
    const mesh = new Mesh(gl, { geometry, program });

    // Efficient resize handler
    const resize = () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        
        // Only resize if dimensions are valid to prevent WebGL errors
        if (width > 0 && height > 0) {
            renderer.setSize(width, height);
            const resUniform = program.uniforms.uResolution.value;
            resUniform[0] = gl.canvas.width;
            resUniform[1] = gl.canvas.height;
            resUniform[2] = gl.canvas.width / gl.canvas.height;
        }
    };

    // 1. Initial Synchronous Resize
    resize();

    // 2. Warm up render
    renderer.render({ scene: mesh });

    // 3. Set up ResizeObserver
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    function handleMouseMove(event: MouseEvent) {
        const rect = container.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = 1 - (event.clientY - rect.top) / rect.height;
        mouseTarget.x = x;
        mouseTarget.y = y;
    }

    if (interactive) {
        container.addEventListener('mousemove', handleMouseMove);
    }

    // 4. Set up IntersectionObserver to pause loop when out of viewport
    const intersectionObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationId) {
            animationId = requestAnimationFrame(update);
        }
    });
    intersectionObserver.observe(container);

    function update(t: number) {
        if (!isVisible) {
            animationId = 0;
            return;
        }

        animationId = requestAnimationFrame(update);
        
        const ease = 0.05; 
        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * ease;
        mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * ease;

        program.uniforms.uMouse.value[0] = mouseCurrent.x;
        program.uniforms.uMouse.value[1] = mouseCurrent.y;

        program.uniforms.uTime.value = t * 0.001 * speed;
        renderer.render({ scene: mesh });
    }
    
    // Start loop
    animationId = requestAnimationFrame(update);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (interactive && container) {
          container.removeEventListener('mousemove', handleMouseMove);
      }
      if (gl) {
         const extension = gl.getExtension('WEBGL_lose_context');
         if (extension) extension.loseContext();
      }
      if (container && container.contains(gl.canvas)) {
         container.removeChild(gl.canvas);
      }
    };
  }, [baseColor, speed, amplitude, frequencyX, frequencyY, interactive]);

  return (
    <div 
        ref={containerRef} 
        className="liquidChrome-container w-full h-full relative" 
        style={{ backgroundColor: '#141414', ...props.style }} 
        {...props} 
    />
  );
};

export default LiquidChrome;