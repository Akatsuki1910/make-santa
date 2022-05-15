import * as PIXI from 'pixi.js'
import { Container } from 'pixi.js'

import svg from './svg/*.svg'
import svg2 from './svg/svg/*.svg'

const score = 0
const timeLimit = 0
const isGameStarted = false
const texture: { [key: string]: PIXI.SVGResource } = {}
const texture2: { [key: string]: PIXI.Texture } = {}

const view = document.getElementById('canvas') as HTMLCanvasElement
const width = window.innerWidth
const height = window.innerHeight

const stage = new PIXI.Container()
const renderer = PIXI.autoDetectRenderer({
  width,
  height,
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  view,
  backgroundColor: 0xb8fff3,
})

window.onresize = () => {
  renderer.resize(window.innerWidth, window.innerHeight)
  renderer.render(stage)
}

for (const s in svg) {
  // texture[s] = PIXI.Texture.from(svg[s])
  texture[s] = new PIXI.SVGResource(svg[s], { scale: 2 })
}

for (const s in svg2) {
  texture2[s] = PIXI.Texture.from(svg2[s])
}

const titleG = new Container()
const title = new PIXI.Sprite(texture2['title_1'])
title.x = width / 2
title.y = 100
titleG.addChild(title)
const start = new PIXI.Sprite(texture2['start'])
titleG.addChild(start)
const sb = new PIXI.Sprite(texture2['button_start'])
titleG.addChild(sb)
stage.addChild(titleG)

// const leftB = new PIXI.Sprite(texture['button_left'])
const b = new PIXI.Texture(new PIXI.BaseTexture(texture['button_left']))
const leftB = new PIXI.Sprite(b)
// leftB.scale.set(2, 2)
stage.addChild(leftB)
// const rightB = new PIXI.Sprite(texture['button_right'])
// stage.addChild(rightB)

function animation() {
  renderer.render(stage)
  requestAnimationFrame(animation)
}
animation()
