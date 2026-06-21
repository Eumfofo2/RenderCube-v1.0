# RenderCube-v1.0
RenderCubob e um renderizador totalmente feito a base de JavaScript e Canvas API do HTML5 (rodavel na CPU diretamente) (e pelos meus estudos :))
```html
<!-- elemento canvas -->
<canvas id="can"></canvas>
```

como opera? na versão v1.0.0, na renderização funciona no seguinte algoritmo
<table>
    <thead>
        <tr>
            <th>modelos</th>
            <th>preparação</th>
            <th>renderização</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>antes de rodar, e preciso que tenha pelo menos um modelo ativo na lista de modelso</td>
            <td>na renderização em terceira pessoa, passa pela rotação com o objeto na posição do centro (vetor R3) (0, 0, 0) e dps posicionada (vetor R3)</td>
            <td>passa as instruções de vértices, aresta e faces para renderizar como 2d</td>
        </tr>
    </tbody>
</table>

## 🧮 Matemática
- a base utilizada foi __algebra linear__, __trigonometria__ e __matrizes__
- posição de cada vértice 
v<sub>(x,y,z)</sub> = {...}
```js
// exemplo de um triangulo
const v = [
  {x: -0.5, y:  0.5, z: 0.5},
  {x:  0.5, y:  0.5, z: 0.5},
  {x: -0.5, y: -0.5, z: 0.5}
]
```
- depois a junção por arestas pegando pelo índice no _Array_ dos vertices
a<sub>(x,y,z)</sub> = {...}
```js
/*
  cada índice:
  primeiro do Array pegar o P0
  segundo pega o destino    P1
*/
const a = [
  [0, 1],
  [1, 2],
  [2, 0]
]
```
- para contrução do triângulo, vai um terceiro Array que começa a pegar os vértices assim como as arestas (a) 
```js
/*
  cada um dos três pontos pegos por índice nos vértices vão ser utilizados principalmente pra desenhar na tela
*/
const t = [
  [0, 1, 2]
]
```

- como cada objeto Cube está como padrão iniciado no centro (x,y,z) pode acabar evitando de na hora de rotação com matrizes n acabar orbitando a câmera (0,0,0), mais apenas no caso se primeiro for ajustado a posição e dps a rotação (no caso de terceira pessoa primeiro rotação e depois a posição)
- rotação x, y e z:
```
// rotação x
|x'|   | 1   0       0    | |x|
|y'| = | 0 cos(0) -sin(0) |×|y|
|z'|   | 0 sin(0)  cos(0) | |z|

// rotação y
|x'|   |  cos(0) 0 sin(0) | |x|
|y'| = |    0    1   0    |×|y|
|z'|   | -sin(0) 0 cos(0) | |z|

// rotação z
|x'|   | cos(0) -sin(0) 0 | |x|
|y'| = | sin(0)  cos(0) 0 |×|y|
|z'|   |   0       0    1 | |z|
```
- após uma multiplicação de matriz com o ângulo (omega) e as coordenadas, e passado para a parte de incrmenetar uma nova posição seguindo o vetor R3 de posição 
```js
const r = {
  x: 0,
  y: 0,
  z: 0
}
const p = {
  x: 0,
  y: 0,
  z: 5
}
// EX: essa função e uma rotação com o z 
function rotate_Z({x, y, z}, r) {
  // também pode se utilizar radiante seguindo uma setagem da rotação "r = r*(Math.PI/180)"
  const sin = Math.sin(r)
  const cos = Math.cos(r)
  return {
    x: x*cos - y*sin,
    y: x*sin + y*cos,
    z
  }
}
// essa função iria retornar a incremenetacao da posição 
function atualizar_Posicao({x, y, z}) {
   return {x: x+p.x, y: y+p.y, z: z+p.z}
}

```
- depois passado para parte de tradução de coordenadas cartesianas para uma leitura que o Canvas consegue realizar (+ponto de fuga com o z e o fov)
```js
// ... resto
const FOV = 400 // exemplo de fov
const w = canvas.width
const h = canvas.height
// uma "conversao" de 3D para 2D do canvas 
function formatar_Canva({x, y, z}) {
  return {
    x:  x*(FOV/z)+(w/2),
    y: -y*(FOV/z)+(h/2),
    z
  }
}
/*
          FOV   w
 x' = x × ——— + —
           z    2
 
           FOV   h
 x' = -y × ——— + —
            z    2
*/
```
- e a renderização vai ser de acordo com a preferência de implementar outros algoritmos ou já traçar arestas ou faces e etc
## 📃 como utilizar
### 1. → new Cena()
- cena seria um objeto para poder incrementar ou renderizar uma cena a cada ver que seja chamada um método específico (.main()) 
- para poder iniciar uma cena, basta instânciad a sua classe e passae algumas configurações para alguns processos
```js
// exemplo 
const cena = new Cena(ctx,400,'#000000', canvas.width, canvas.height)
```
- 1. ctx → contexto "2d" do Canvas
- 2. 400 → sendo o fov, sendo um campo de visão na cena
- 3. '#000000' → um valor hexagonal definido para um fundo a cada limpagem de cena e atualização de frame no exemplo (mais podendo ser outras formas de definir cores no css/html como HSL, RGB e etc)
- 4. canvas.width → a largura do Canvas
- 5. canvas.height → a altura do canvas

## 🔍 observações
- **🖥️ execução**: como se esta utilizando 
- **🧊 faces uma em cima da outra**: em determinado momento e possível ver que algumas faces acabam ficando em cima da outra
- **⌨️ suporte inputs**: com um atual suporte para input de teclado para plataformas __Win32__, __x86_64 Linux__ e __MacIntel__ além desses, apenas com a interface mobile
- **⬜ Objeto plano**: adição de um objeto plano 
```js
const plane = new Plane(...);
```
