const canvas = document.getElementById("can")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d")
class Plane {
  constructor(cor) {
    this.rotation = {x: 0, y: 0, z: 0}
    this.position = {x: 0, y: 0, z: 0}
    this.scale    = {x: 1, y: 1, z: 1}
    this.vertices = [
      {x:-0.5,y: 0.5,z: 0.5},
      {x: 0.5,y: 0.5,z: 0.5},
      {x: 0.5,y:-0.5,z: 0.5},
      {x:-0.5,y:-0.5,z: 0.5}
    ]
    this.faces = [
      [0, 1, 3],
      [1, 2, 3]
    ]
    this.transparencia = 1.0
    this.corRGB = cor
  }
  return_Obj() {
    return {
      transparencia: this.transparencia,
      vertices:      this.vertices,
      faces:         this.faces,
      colorRGB:      this.corRGB,
      rotate:        this.rotation,
      position:      this.position,
      scale:         this.scale
    }
  }
}
class Cube {
  constructor(cor) {
    this.rotation = {x: 0, y: 70, z: 0}
    this.position = {x: 0, y: 0, z: 2}
    this.scale    = {x: 1, y: 1, z: 1}
    this.vertices = [
      {x:-0.5,y: 0.5,z: 0.5},
      {x: 0.5,y: 0.5,z: 0.5},
      {x: 0.5,y:-0.5,z: 0.5},
      {x:-0.5,y:-0.5,z: 0.5},
      {x:-0.5,y: 0.5,z:-0.5},
      {x: 0.5,y: 0.5,z:-0.5},
      {x: 0.5,y:-0.5,z:-0.5},
      {x:-0.5,y:-0.5,z:-0.5}
    ]
    this.faces = [
      [0, 1, 3], [1, 2, 3],
      [1, 5, 2], [5, 6, 2],
      [5, 4, 6], [4, 7, 6],
      [4, 0, 7], [0, 3, 7],
      [4, 5, 0], [5, 1, 0],
      [7, 6, 3], [6, 2, 3]
    ]
    this.transparencia = 1.0
    this.corRGB = cor
  }
  return_Obj() {
    return {
      transparencia: this.transparencia,
      vertices:      this.vertices,
      faces:         this.faces,
      colorRGB:      this.corRGB,
      rotate:        this.rotation,
      position:      this.position,
      scale:         this.scale
    }
  }
}
class Cena {
  constructor(ctx, fov, w, h) {
    this.camera = [0, 0, 1]
    this.k      = Math.PI/180
    this.luz    = [1, 1, 1]
    this.ctx    = ctx
    this.fov    = fov
    this.w      = w
    this.h      = h
    this.models = []
  }
  rotateZ(p, deg) {
    const r   = deg*this.k
    const sin = Math.sin(r)
    const cos = Math.cos(r)
    return {
      x: p.x * cos - p.y * sin,
      y: p.x * sin + p.y * cos,
      z: p.z
    }
  }
  rotateY(p, deg) {
    const r   = deg*this.k
    const cos = Math.cos(r)
    const sin = Math.sin(r)
    return {
      x: p.x * cos + p.z * sin,
      y: p.y,
      z: p.x * -sin + p.z * cos
    }
  }
  rotateX(p, deg) {
    const r   = deg*this.k
    const cos = Math.cos(r)
    const sin = Math.sin(r)
    return {
      x: p.x,
      y: p.y * cos - p.z * sin,
      z: p.y * sin + p.z * cos
    }
  }
  format(p) {
    const e = 1 / Math.tan(this.fov / 2)
    const z = Math.max(p.z, 0.01)
    return {
      x:  (e * p.x / z) * (this.h / 2) + this.w / 2,
      y: -(e * p.y / z) * (this.h / 2) + this.h / 2
    }
  }
  clear_Canva() {
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0,0,this.w,this.h)
  }
  magnitude(p) {
    return Math.sqrt(p.x**2 + p.y**2 + p.z**2)
  }
  add_Cube(i) {
    if (typeof i !== 'object') {
      throw new Error("erro ao ver o tipo do cubo")
      return
    }
    this.models.push(i)
  }
  main() {
    this.clear_Canva() //resetar tela
    let count = -1
    for (const l of this.models) {
      let facesOrdenadas = []
      // ==> Preparação para renderização das faces
      for (const f of l.faces) {
        count++
        // rotação dos vértices
        const __l3D_1 = this.rotateZ(this.rotateY(this.rotateX(l.vertices[f[0]],l.rotate.x), l.rotate.y), l.rotate.z)
        const __l3D_2 = this.rotateZ(this.rotateY(this.rotateX(l.vertices[f[1]],l.rotate.x), l.rotate.y), l.rotate.z)
        const __l3D_3 = this.rotateZ(this.rotateY(this.rotateX(l.vertices[f[2]],l.rotate.x), l.rotate.y), l.rotate.z)
        
        // posição ao mundo 
        const __l3D_1_p = {
          x: __l3D_1.x+l.position.x,
          y: __l3D_1.y+l.position.y,
          z: __l3D_1.z+l.position.z
        }
        const __l3D_2_p = {
          x: __l3D_2.x+l.position.x,
          y: __l3D_2.y+l.position.y,
          z: __l3D_2.z+l.position.z
        }
        const __l3D_3_p = {
          x: __l3D_3.x+l.position.x,
          y: __l3D_3.y+l.position.y,
          z: __l3D_3.z+l.position.z
        }
        
        // retas da face (vetor unitário)
        const a = {
          x: __l3D_2_p.x - __l3D_1_p.x,
          y: __l3D_2_p.y - __l3D_1_p.y,
          z: __l3D_2_p.z - __l3D_1_p.z 
        }
        const b = {
          x: __l3D_3_p.x - __l3D_1_p.x,
          y: __l3D_3_p.y - __l3D_1_p.y,
          z: __l3D_3_p.z - __l3D_1_p.z 
        }
        
        // normal (reta perpendicular)
        const normal = {
          x: a.y * b.z - a.z * b.y,
          y: a.z * b.x - a.x * b.z,
          z: a.x * b.y - a.y * b.x
        }
        const nor = this.magnitude(normal)
        const n = {
          x: normal.x / nor,
          y: normal.y / nor,
          z: normal.z / nor
        }
        const view = {
          x: -__l3D_1_p.x,
          y: -__l3D_1_p.y,
          z: -__l3D_1_p.z 
        }
        const d = n.x * view.x + n.y * view.y + n.z * view.z
        if (d > 0) continue
        
        // media + iluminação (simples)
        const mX = (__l3D_1_p.x+__l3D_2_p.x+__l3D_3_p.x)/3
        const mY = (__l3D_1_p.y+__l3D_2_p.y+__l3D_3_p.y)/3
        const mZ = (__l3D_1_p.z+__l3D_2_p.z+__l3D_3_p.z)/3
        
        const mv = {
          x: mX - this.luz[0],
          y: mY - this.luz[1],
          z: mZ - this.luz[2]
        }
        const mgM = this.magnitude(mv)
        const w = {
          x: mv.x / mgM,
          y: mv.y / mgM,
          z: mv.z / mgM
        }
        const nL = (normal.x*w.x + normal.y*w.y + normal.z*w.z)
        // preparar para lançar 
        facesOrdenadas.push({
          face: f,
          z:    mZ,
          p1:   __l3D_1_p,
          p2:   __l3D_2_p,
          p3:   __l3D_3_p,
          ilum: 0.2 + 0.8 * Math.max(0, nL)
        })
      }
      facesOrdenadas.sort((a,b) => b.z - a.z)
      for (const face of facesOrdenadas) {
        // desenho das faces (vertices)
        const p1 = this.format(face.p1);
        const p2 = this.format(face.p2);
        const p3 = this.format(face.p3);
        
        // desenho com contexto 2d
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineTo(p3.x, p3.y);
        this.ctx.closePath();
        this.ctx.fillStyle = `rgba(${l.colorRGB[0]*face.ilum}, ${l.colorRGB[1]*face.ilum}, ${l.colorRGB[2]*face.ilum}, ${l.transparencia})`;
        this.ctx.fill();
      }
    }
  }
}
const cubo1 = new Cube([250, 100, 50])
const plano = new Plane([255, 255, 0])
const cena  = new Cena(ctx, 90,  canvas.width, canvas.height)
cena.add_Cube(cubo1.return_Obj())
const p = /Win32|MacIntel|Linux x86_64|Win64/i.test(navigator.userAgent);
// fps + renderização
let   lastTime   = 0
let   frameCount = 0
let   fps = 0
const t = `[ram do disp: ${navigator.deviceMemory}GB]`
function main() {
  cena.main()
  const now = performance.now()
  frameCount++
  if (now - lastTime >= 1000) {
    fps = Math.round((frameCount*1000)/(now-lastTime))
    lastTime = now
    frameCount = 0
    document.getElementById("fps").innerText = `FPS: ${fps}`
    document.getElementById("ram").innerText = `${t} usando: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB, total: ${(performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(1)}MB, limite: ${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(1)}MB`
  }
  requestAnimationFrame(main)
}
main()
if (p) {
} else {
}