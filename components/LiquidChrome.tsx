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

    let renderer: any;
    let animationId: number;
    let gl: any;
    
    // PERFORMANCE: Delay WebGL initialization to prioritize main thread for Layout/Paint
    // This helps reduce "Minimize main-thread work" diagnostic.
    const initTimer = setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;

        // PERFORMANCE: Limit DPR to 1 to reduce fragment shader load on high-DPI screens.
        renderer = new Renderer({ antialias: false, alpha: true, dpr: 1 });
        gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);

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

            vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
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
            uResolution: {
            value: new Float32Array([gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height])
            },
            uBaseColor: { value: new Float32Array(baseColor) },
            uAmplitude: { value: amplitude },
            uFrequencyX: { value: frequencyX },
            uFrequencyY: { value: frequencyY },
            uMouse: { value: new Float32Array([0, 0]) } 
        }
        });
        const mesh = new Mesh(gl, { geometry, program });

        function resize() {
            if (!container) return;
            const scale = 1;
            renderer.setSize(container.offsetWidth * scale, container.offsetHeight * scale);
            const resUniform = program.uniforms.uResolution.value;
            resUniform[0] = gl.canvas.width;
            resUniform[1] = gl.canvas.height;
            resUniform[2] = gl.canvas.width / gl.canvas.height;
        }
        window.addEventListener('resize', resize);
        resize();

        // State for smooth mouse movement
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

        function update(t: number) {
            animationId = requestAnimationFrame(update);
            
            const ease = 0.05; 
            mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * ease;
            mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * ease;

            program.uniforms.uMouse.value[0] = mouseCurrent.x;
            program.uniforms.uMouse.value[1] = mouseCurrent.y;

            program.uniforms.uTime.value = t * 0.001 * speed;
            renderer.render({ scene: mesh });
        }
        animationId = requestAnimationFrame(update);

        container.appendChild(gl.canvas);

    }, 150); // Delay execution by 150ms

    return () => {
      clearTimeout(initTimer);
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', (() => {}) as any); // cleanup placeholder
      if (gl) {
         const extension = gl.getExtension('WEBGL_lose_context');
         if (extension) extension.loseContext();
      }
      if (renderer && containerRef.current && renderer.gl.canvas.parentElement) {
         renderer.gl.canvas.parentElement.removeChild(renderer.gl.canvas);
      }
    };
  }, [baseColor, speed, amplitude, frequencyX, frequencyY, interactive]);

  return <div ref={containerRef} className="liquidChrome-container" {...props} />;
};

export default LiquidChrome;