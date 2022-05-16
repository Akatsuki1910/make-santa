import * as PIXI from 'pixi.js'
import { Container } from 'pixi.js'

import svg from './svg/*.svg'
import svg2 from './svg/svg/*.svg'

const texture: { [key: string]: PIXI.Texture } = {}

const view = document.getElementById('canvas') as HTMLCanvasElement
let width = window.innerWidth
let height = window.innerHeight

const stage = new PIXI.Container()
const renderer = PIXI.autoDetectRenderer({
  width,
  height,
  resolution: 1,
  antialias: true,
  view,
  backgroundColor: 0xb8fff3,
})

window.onresize = () => {
  width = window.innerWidth
  height = window.innerHeight

  renderer.resize(width, height)
  setSettings(width, height)
  titleSetup()
}

let settings = {}
function setSettings(width: number, height: number) {
  const h = height / 915
  settings = {
    title_1: {
      scale: 1,
      x: width / 2,
      y: 130 * h,
    },
    start: {
      scale: 0.8,
      x: width / 2,
      y: 500 * h,
    },
    button_start: {
      scale: 0.8,
      x: width / 2,
      y: 850 * h,
    },
  }
}
setSettings(width, height)

for (const s in svg) {
  texture[s] = new PIXI.Texture(
    new PIXI.BaseTexture(
      new PIXI.SVGResource(svg[s], { scale: settings[s]?.scale || 1 }),
    ),
  )
}

for (const s in svg2) {
  texture[s] = new PIXI.Texture(
    new PIXI.BaseTexture(
      new PIXI.SVGResource(svg2[s], { scale: settings[s]?.scale || 1 }),
    ),
  )
}

// snow
const snowG = new Container()
stage.addChild(snowG)
function createSnow() {
  const s = new PIXI.Sprite(texture['snow'])
  snowG.addChild(s)
  s.scale.set(0.1)
  s.y = -50
  s.x = Math.random() * width
}

function moveSnow() {
  for (const o of snowG.children) {
    o.y += 2
  }
}
// snow

// title
const titleG = new Container()
const titleS = ['title_1', 'start', 'button_start']
const titleSp = {}
for (const t of titleS) {
  titleSp[t] = new PIXI.Sprite(texture[t])
  titleG.addChild(titleSp[t])
}
titleSp['button_start'].interactive = true
titleSp['button_start'].on('click', () => {
  stage.removeChild(titleG)
  window.alert('start')
})

function titleSetup() {
  for (const i of titleS) {
    titleSp[i].anchor.set(0.5, 0.5)
    titleSp[i].scale.set(height / 958)
    titleSp[i].x = settings[i]?.x
    titleSp[i].y = settings[i]?.y
  }
}
titleSetup()
stage.addChild(titleG)
// stage.removeChild(titleG)
// title

function animation() {
  renderer.render(stage)
  if (Math.random() < 0.1) createSnow()
  moveSnow()
  requestAnimationFrame(animation)
}
animation()
