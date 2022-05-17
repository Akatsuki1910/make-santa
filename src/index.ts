import * as PIXI from 'pixi.js'
import { Container } from 'pixi.js'

import svg from './svg/*.svg'
import svg2 from './svg/svg/*.svg'

const texture: { [key: string]: PIXI.Texture } = {}

const view = document.getElementById('canvas') as HTMLCanvasElement
let width = window.innerWidth
let height = window.innerHeight

const clickEventType = window.ontouchstart !== null ? 'click' : 'touchend'

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
  buttonSetup()
}

let settings = {}
function setSettings(width: number, height: number) {
  const w = width / 915
  const h = height / 958
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
    button_back: {
      scale: 0.8,
      x: width / 2,
      y: 850 * h,
    },
    button_right: {
      scale: 0.8,
      x: 800 * w,
      y: height - 150 * h,
    },
    button_left: {
      scale: 0.8,
      x: 115 * w,
      y: height - 150 * h,
    },
  }
}
setSettings(width, height)

for (const s in svg) {
  texture[s] = new PIXI.Texture(
    new PIXI.BaseTexture(
      new PIXI.resources.SVGResource(svg[s], {
        scale: settings[s]?.scale || 1,
      }),
    ),
  )
}

for (const s in svg2) {
  texture[s] = new PIXI.Texture(
    new PIXI.BaseTexture(
      new PIXI.resources.SVGResource(svg2[s], {
        scale: settings[s]?.scale || 1,
      }),
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
    if (o.y > height) snowG.removeChild(o)
  }
}
// snow

// title
const titleG = new Container()
const titleS = ['title_1', 'start', 'button_start']
const titleSp: { [key: string]: PIXI.Sprite } = {}
for (const t of titleS) {
  titleSp[t] = new PIXI.Sprite(texture[t])
  titleG.addChild(titleSp[t])
}
titleSp['button_start'].interactive = true
titleSp['button_start'].on('click', () => {
  stage.removeChild(titleG)
  stage.removeChild(snowG)
  // window.alert('start')
  stage.addChild(buttonG)
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
// title

// santa
// santa

// move button
const buttonG = new Container()
const buttonS = ['button_right', 'button_left']
const buttonSp: { [key: string]: PIXI.Sprite } = {}
for (const t of buttonS) {
  buttonSp[t] = new PIXI.Sprite(texture[t])
  buttonG.addChild(buttonSp[t])
  buttonSp[t].interactive = true
  buttonSp[t].on('click', () => {})
}

function buttonSetup() {
  for (const i of buttonS) {
    buttonSp[i].anchor.set(0.5, 0.5)
    buttonSp[i].scale.set((height / 958) * (width / 915))
    buttonSp[i].x = settings[i]?.x
    buttonSp[i].y = settings[i]?.y
  }
}
buttonSetup()
// stage.addChild(buttonG)
// move button

// back
const back = new PIXI.Sprite(texture['button_back'])
back.anchor.set(0.5, 0.5)
back.scale.set((height / 958) * (width / 915))
back.x = settings['button_back']?.x
back.y = settings['button_back']?.y
back.interactive = true
back.on(clickEventType, () => {
  stage.removeChild(back)
  window.alert('back')
  stage.addChild(snowG)
  stage.addChild(titleG)
})
// back

function animation() {
  renderer.render(stage)
  if (Math.random() < 0.1) createSnow()
  moveSnow()
  requestAnimationFrame(animation)
}
animation()
