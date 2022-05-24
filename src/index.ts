import * as PIXI from 'pixi.js'
import { Container } from 'pixi.js'

import svg from './svg/*.svg'
import svg2 from './svg/svg/*.svg'

const texture: { [key: string]: PIXI.Texture } = {}

const view = document.getElementById('canvas') as HTMLCanvasElement
let width = window.innerWidth
let height = window.innerHeight

let onClick = false
const clickEventType = window.ontouchstart !== null ? 'click' : 'touchend'
const startEventType = window.ontouchstart !== null ? 'mousedown' : 'touchstart'
const endEventType = window.ontouchstart !== null ? 'mouseup' : 'touchend'

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
  roundBox.x = width / 2
  back.x = width / 2
  text.x = width / 2
  resultG.x = width / 2
  tb.x = width / 2
  twitter.x = width / 2
}

// 0 title
// 1 game
// 2 end
let gameFlg = 0
let score = 0
let lv = 1

let settings = {}
let w = width / 915
let h = height / 958
function setSettings(width: number, height: number) {
  w = width / 915
  h = height / 958
  settings = {
    result_one: {
      scale: 0.8,
    },
    result_two: {
      scale: 0.8,
    },
    result_three: {
      scale: 0.8,
    },
    result_four: {
      scale: 0.8,
    },
    result_five: {
      scale: 0.8,
    },
    twitter_brands: {
      scale: 0.1,
    },
    yes_clothes: {
      scale: 0.2,
    },
    not_clothes: {
      scale: 0.2,
    },
    snow: {
      scale: 0.1,
    },
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
        scale: settings[s]?.scale || 0.3,
      }),
    ),
  )
}

for (const s in svg2) {
  texture[s] = new PIXI.Texture(
    new PIXI.BaseTexture(
      new PIXI.resources.SVGResource(svg2[s], {
        scale: settings[s]?.scale || 0.3,
      }),
    ),
  )
}

// const te = new PIXI.Texture(
//   new PIXI.BaseTexture(String(digits)),
//   new PIXI.Rectangle(0, 0, 100, 100),
// )
// console.log(te)
// const sp = new PIXI.Sprite(te)
// stage.addChild(sp)

const roundBox = new PIXI.Graphics()
roundBox.beginFill(0xffffff)
roundBox.drawRoundedRect(0, 0, 450, 100, 10)
roundBox.endFill()
roundBox.pivot.set(225, 50)
roundBox.x = width / 2
roundBox.y = 190
const textStyle = new PIXI.TextStyle({
  fill: 'black',
  fontSize: 100,
  fontFamily: 'Courier New',
})
const text = new PIXI.Text('00.00', textStyle)
text.anchor.set(0.5, 0.5)
text.x = width / 2
text.y = 190 / 2 + 100
const timer = new PIXI.Container()
timer.addChild(roundBox)
timer.addChild(text)

// snow
const snowG = new Container()
function createSnow() {
  const s = new PIXI.Sprite(texture['snow'])
  snowG.addChild(s)
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
titleSp['button_start'].on(clickEventType, () => {
  removeG(titleGs)
  gameFlg = 1
  startTime = Date.now()
  santaSetup()
  score = 0
  lv = 1
  clothesG.removeChildren()
  addG(gameGs)
})

function titleSetup() {
  for (const i of titleS) {
    titleSp[i].anchor.set(0.5, 0.5)
    titleSp[i].scale.set(h)
    titleSp[i].x = settings[i]?.x
    titleSp[i].y = settings[i]?.y
  }
}
titleSetup()
// title

// santa
const santaG = new PIXI.Sprite()
const santaS: PIXI.Texture[] = []
for (const f of ['left', 'right']) {
  for (const s of ['stand', 'run']) {
    for (const n of ['one', 'two', 'three', 'four', 'five']) {
      const tex = texture[`santa_${f}_${s}_${n}`]
      santaS.push(tex)
    }
  }
}

function santaSetup() {
  santaG.texture = santaS[0]
  santaG.interactive = true
  santaG.anchor.set(0.5, 0.5)
  santaG.x = width / 2
  santaG.y = height - 300
}
santaSetup()

let memSanta = 0
function changeSanta(i: number) {
  if (i === -1) i = onClick ? memSanta - 5 : memSanta
  else i += lv - 1
  if (memSanta !== i) {
    santaG.texture = santaS[i]
    memSanta = i
  }
}

function moveSanta() {
  if (Math.floor(memSanta / 5) % 2 === 1) {
    if (Math.floor(memSanta / 10) === 0) {
      santaG.x -= 3
      if (santaG.x < 0) {
        santaG.x = 0
      }
    } else {
      santaG.x += 3
      if (santaG.x > width) {
        santaG.x = width
      }
    }
  }
}

// santa

// clothes
const clothesG = new Container()
function createClothes() {
  const s = new PIXI.Sprite(
    texture[Math.random() > 0.2 ? 'yes_clothes' : 'not_clothes'],
  )
  s.interactive = true
  clothesG.addChild(s)
  s.y = -50
  s.x = Math.random() * (width - 40)
}

function moveClothes() {
  for (const o of clothesG.children) {
    o.y += 3
    if (o.y > height) clothesG.removeChild(o)
  }
}
// clothes

// move button
const buttonG = new PIXI.Container()
const buttonS = ['button_left', 'button_right']
const buttonSp: { [key: string]: PIXI.Sprite } = {}
for (const i in buttonS) {
  const t = buttonS[i]
  buttonSp[t] = new PIXI.Sprite(texture[t])
  buttonG.addChild(buttonSp[t])
  buttonSp[t].interactive = true
  buttonSp[t].on(startEventType, () => bStart(+i * 10 + 5))
  buttonSp[t].on(endEventType, () => bEnd(+i * 10))
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    bStart(0 * 10 + 5)
  } else if (e.key === 'ArrowRight') {
    bStart(1 * 10 + 5)
  }
})

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') {
    bStart(0 * 10)
  } else if (e.key === 'ArrowRight') {
    bStart(1 * 10)
  }
})
window.addEventListener(endEventType, () => bEnd(-1))

function bStart(i: number) {
  changeSanta(i)
  onClick = true
}

function bEnd(i: number) {
  changeSanta(i)
  onClick = false
}

function buttonSetup() {
  for (const i of buttonS) {
    buttonSp[i].anchor.set(0.5, 0.5)
    buttonSp[i].scale.set(Math.min(h * w, 1))
    buttonSp[i].x = settings[i]?.x
    buttonSp[i].y = settings[i]?.y
  }
}
buttonSetup()
// move button

// back
const back = new PIXI.Sprite(texture['button_back'])
back.anchor.set(0.5, 0.5)
back.scale.set(h)
back.x = settings['button_back']?.x
back.y = settings['button_back']?.y
back.interactive = true
back.on(clickEventType, () => {
  removeG(endGs)
  gameFlg = 0
  addG(titleGs)
})
// back

// result
const resultG = new PIXI.Sprite()
resultG.anchor.set(0.5, 0.5)
resultG.x = width / 2
resultG.y = height / 2 - 150
resultG.scale.set(h)
function resultTex() {
  let num: string
  if (lv === 1) num = 'one'
  if (lv === 2) num = 'two'
  if (lv === 3) num = 'three'
  if (lv === 4) num = 'four'
  if (lv === 5) num = 'five'
  resultG.texture = texture[`result_${num}`]
}
// result

// twitter
const twitterG = new Container()
const tb = new PIXI.Graphics()
tb.beginFill(0x1da1f2)
tb.drawRoundedRect(0, 0, 100, 100, 10)
tb.endFill()
tb.pivot.set(tb.width / 2, tb.height / 2)
tb.x = width / 2
tb.y = height / 2 + 200 * h
twitterG.addChild(tb)

const twitter = new PIXI.Sprite(texture['twitter_brands'])
twitter.anchor.set(0.5, 0.5)
twitter.x = width / 2
twitter.y = height / 2 + 200 * h
twitter.scale.set(h)
twitterG.addChild(twitter)
twitterG.interactive = true
twitterG.on(clickEventType, () => {
  const url = `http://twitter.com/share?text=%23MAKE_SANTA%0a私は${score}ポイントでした！&url=https://make-santa.aktk1910.pw`
  window.open(url)
})
// twitter

const titleGs = [snowG, titleG]
const gameGs = [timer, clothesG, buttonG, santaG]
const endGs = [back, resultG, twitterG]

function addG(gs: PIXI.Container[]) {
  for (const g of gs) {
    stage.addChild(g)
  }
}

function removeG(gs: PIXI.Container[]) {
  for (const g of gs) {
    stage.removeChild(g)
  }
}

addG(titleGs)
let startTime: number
function animation() {
  renderer.render(stage)

  if (gameFlg === 1) {
    const f = renderer.plugins.interaction.hitTest(santaG, clothesG)
    if (f) {
      const svgText = f.texture.baseTexture.resource.svg
      if (svgText.match(/yes/)) {
        score++
        if (10 < score) lv = 2
        if (25 < score) lv = 3
        if (35 < score) lv = 4
        if (50 < score) lv = 5
        clothesG.removeChild(f)
      } else {
        startTime -= 2000
        clothesG.removeChild(f)
      }
    }
  }

  if (onClick) moveSanta()

  if (Math.random() < 0.1 * w) {
    if (gameFlg === 0) createSnow()
    if (gameFlg === 1) createClothes()
  }
  if (gameFlg === 0) moveSnow()
  if (gameFlg === 1) moveClothes()

  if (gameFlg === 1) {
    let t = 40 - (Date.now() - startTime) / 1000
    text.text = ('0' + String(t.toFixed(2))).slice(-5)
    if (t < 0) {
      text.text = '00.00'
      removeG(gameGs)
      gameFlg = 2
      resultTex()
      addG(endGs)
    }
  }
  requestAnimationFrame(animation)
}
animation()
