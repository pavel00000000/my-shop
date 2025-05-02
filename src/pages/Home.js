import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Home.css';
import image4 from './44.jpg';

// Фрагментный шейдер
const fragmentShader = `#version 300 es
/*********made by Matthias Hurrle (@atzedent)
*/   
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;

#define FC gl_FragCoord.xy
#define R resolution
#define MN min(R.x,R.y)
#define T (time+660.)
#define S smoothstep
#define N normalize
#define rot(a) mat2(cos((a)-vec4(0,11,33,0)))
float rnd(vec2 p) {
    p=fract(p*vec2(12.9898,78.233));
    p+=dot(p,p+34.56);
    return fract(p.x*p.y);
}
float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f), k=vec2(1,0);
    float
    a=rnd(i),
    b=rnd(i+k),
    c=rnd(i+k.yx),
    d=rnd(i+1.);
    return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
    float t=.0, a=1., h=.0; mat2 m=mat2(1.,-1.2,.2,1.2);
    for (float i=.0; i<5.; i++) {
        t+=a*noise(p);
        p*=2.*m;
        a*=.5;
        h+=a;
    }
    return t/h;
}
void main() {
    vec2 uv=(FC-.5*R)/R.y, k=vec2(0,T*.015); 
    vec3 col=vec3(1);
    uv.x+=.25;
    uv*=vec2(2,1);
    float n=fbm(uv*.28+vec2(-T*.01,0));
    n=noise(uv*3.+n*2.);
    col.r-=fbm(uv+k+n);
    col.g-=fbm(uv*1.003+k+n+.003);
    col.b-=fbm(uv*1.006+k+n+.006);
    col=mix(col,vec3(1),dot(col,vec3(.21,.71,.07)));
    col=mix(vec3(.08),col,min(time*.1,1.));
    col=clamp(col,.08,1.);
    O=vec4(col,1);
}`.trim();

// Класс Renderer
class Renderer {
  #vertexSrc = "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}";
  #vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
  constructor(canvas, scale) {
    this.canvas = canvas;
    this.scale = scale;
    this.gl = canvas.getContext("webgl2");
    if (!this.gl) {
      console.error('WebGL2 не поддерживается вашим браузером');
      return;
    }
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
    this.shaderSource = fragmentShader;
    this.mouseCoords = [0, 0];
    this.pointerCoords = [0, 0];
    this.nbrOfPointers = 0;
  }
  updateShader(source) {
    this.reset();
    this.shaderSource = source;
    this.setup();
    this.init();
  }
  updateScale(scale) {
    this.scale = scale;
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
  }
  compile(shader, source) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Ошибка компиляции шейдера:', gl.getShaderInfoLog(shader));
      return false;
    }
    return true;
  }
  reset() {
    const { gl, program, vs, fs } = this;
    if (program && !gl.getProgramParameter(program, gl.DELETE_STATUS)) {
      if (vs && !gl.getShaderParameter(vs, gl.DELETE_STATUS)) {
        gl.detachShader(program, vs);
        gl.deleteShader(vs);
      }
      if (fs && !gl.getShaderParameter(fs, gl.DELETE_STATUS)) {
        gl.detachShader(program, fs);
        gl.deleteShader(fs);
      }
      gl.deleteProgram(program);
    }
  }
  setup() {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!this.compile(this.vs, this.#vertexSrc)) return;
    if (!this.compile(this.fs, this.shaderSource)) return;
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Ошибка линковки программы:', gl.getProgramInfoLog(this.program));
    }
  }
  init() {
    const { gl, program } = this;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#vertices), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    program.resolution = gl.getUniformLocation(program, "resolution");
    program.time = gl.getUniformLocation(program, "time");
    program.touch = gl.getUniformLocation(program, "touch");
    program.pointerCount = gl.getUniformLocation(program, "pointerCount");
    program.pointers = gl.getUniformLocation(program, "pointers");
  }
  render(now = 0) {
    const { gl, program, buffer, canvas, mouseCoords, pointerCoords, nbrOfPointers } = this;
    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.uniform2f(program.resolution, canvas.width, canvas.height);
    gl.uniform1f(program.time, now * 1e-3);
    gl.uniform2f(program.touch, ...mouseCoords);
    gl.uniform1i(program.pointerCount, nbrOfPointers);
    gl.uniform2fv(program.pointers, pointerCoords);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

// Массив статей
const articles = [
  { title: "КРАСА" },
  { title: "ЯКУ" },
  { title: "ПОТРIБНО" },
  { title: "СКУШТУВАТИ..." },
];

// Массив картинок
const images = [image4];

// Список категорий (перенесено из Header.js)
const categories = [
  { path: '/catalog/all', name: 'Загальний роздiл' },
  { path: '/catalog/category1', name: 'Бокси' },
  { path: '/catalog/category2', name: 'Дитячі букети' },
  { path: '/catalog/category3', name: 'Чоловічі букети, коробки' },
  { path: '/catalog/category4', name: 'Солодкі букети, коробки' },
  { path: '/catalog/category5', name: 'Сухофрукти, фрукти' },
  { path: '/catalog/category6', name: 'Полуниця в шоколаді' },
  { path: '/catalog/category8', name: 'Квіти' },
];

const Home = () => {
  const canvasRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio);
    const renderer = new Renderer(canvas, dpr);
    renderer.setup();
    renderer.init();

    const resize = () => {
      const { innerWidth: width, innerHeight: height } = window;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      renderer.updateScale(dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    let raf;
    const loop = (now) => {
      renderer.render(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      renderer.reset();
    };
  }, []);

  return (
    <div className="home-container">
      <canvas id="canvas" ref={canvasRef}></canvas>
      <div className="content-wrapper">
        <div className="left-half">
          <main className="text-overlay">
            {articles.map((article, index) => (
              <article key={index}>
                <h2>{article.title}</h2>
              </article>
            ))}
            {/* Категории в мобильной версии под текстом */}
            {window.innerWidth <= 768 && location.pathname === '/' && (
              <div className="categories-list">
                <span className="categories-title">Категории</span>
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className={location.pathname === category.path ? 'active' : ''}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
        <div className="right-half">
          <div className="image-container">
            <img src={images[0]} alt="Картинка" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;