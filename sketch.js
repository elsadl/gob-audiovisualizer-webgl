import { width, height, blocks, margin } from "./dimensions.js"
import { shaders } from "./shaders.js"

let rtt
let time = 0
let currTime = 0
let tempo = 1
let blue = 0
let tr = 2

let sound
let fft
let peakDetect
let amplitude

let beat = false
let beatValue = 0

let classActive = false

let grid
let offset = 0

const sketch = (sketch) => {
  sketch.preload = () => {
    // on charge le son
    sketch.soundFormats("mp3", "ogg")
    sound = sketch.loadSound("sounds/polahq.mp3")

    // on charge les shaders
    for (const element of shaders) {
      element.program = sketch.loadShader(
        `shaders/${element.vert}.vert`,
        `shaders/${element.frag}.frag`,
        () => (element.loaded = true)
      )
    }
  }

  sketch.setup = () => {
    // on crée le canvas
    let canvas = sketch.createCanvas(width, height, sketch.WEBGL)
    sketch.noStroke()

    sketch.pixelDensity(1)

    // play/pause on click
    canvas.mousePressed(sketch.togglePlay)

    // on crée la texture pour les shaders
    rtt = sketch.createGraphics(width, height, sketch.WEBGL)
    rtt.noStroke()

    // on setup l'analyse du son
    fft = new p5.FFT()
    peakDetect = new p5.PeakDetect()
    amplitude = new p5.Amplitude()

    grid = sketch.createImage(
      sketch.floor(blocks[2].w),
      sketch.floor(blocks[2].h)
    )
    sketch.drawGrid()
  }

  sketch.setUniforms = (target, resolution) => {
    fft.analyze()
    target.setUniform("uResolution", resolution)
    target.setUniform("uTime", time + 1)
    target.setUniform("uTempo", tempo)
    target.setUniform("uBeat", beat)
    target.setUniform("uRandom", Math.random())
    target.setUniform("uBlue", blue)
    target.setUniform("uLevel", amplitude.getLevel())
    target.setUniform("uTreble", fft.getEnergy("treble"))
    target.setUniform("uHighMid", fft.getEnergy("highMid"))
    target.setUniform("uMid", fft.getEnergy("mid"))
    target.setUniform("uLowMid", fft.getEnergy("lowMid"))
    target.setUniform("uBass", fft.getEnergy("bass"))
  }

  sketch.drawShader = (block, shader) => {
    if (!shader) {
      return
    }

    sketch.texture(rtt)
    rtt.shader(shader)

    sketch.setUniforms(shader, [block.w, block.h])
    rtt.rect(0, 0, width, height)
    sketch.rect(block.x + offset, block.y, block.w, block.h)
  }

  sketch.drawGrid = () => {
    grid.loadPixels()

    for (let x = 0; x < grid.width * 2; x++) {
      for (let y = 0; y < grid.height; y++) {
        const lineX = x % 18 === 0 ? 1 : 0
        const lineY = y % 18 === 0 ? 1 : 0
        const color = (lineY + lineX) * 120
        grid.set(x, y, color)
      }
    }

    grid.updatePixels()
  }

  sketch.draw = () => {
    // on vérifie que tous les shaders sont chargés
    const ready = shaders.filter((el) => !el.loaded).length === 0

    sketch.fill("#000")
    sketch.background("#000")
    sketch.rect(-width / 2, -height / 2, width, height)

    if (ready) {
      // on dessine la grille et les shaders
      for (const block of blocks) {
        let blockShader = null
        if (block.shader) {
          blockShader = shaders.find((el) => el.frag === block.shader).program
        }
        if (block.shader === "grid") {
          sketch.stroke(150)
        } else {
          sketch.noStroke()
        }
        sketch.drawShader(block, blockShader)
      }

      shaders
        .find((el) => el.frag === "grid")
        .program.setUniform("uTexture", grid)


      peakDetect.update(fft)

      if (sound.isPlaying()) {
        time += 0.1
        tempo += 0.1 + amplitude.getLevel() * 0.2

        if (sound.currentTime() > 26 && sound.currentTime() < 44) {
          blue = sketch.constrain(
            sketch.map(sound.currentTime(), 26, 26 + tr, 0, 1),
            0,
            1
          )
        }
        if (sound.currentTime() > 44 && sound.currentTime() < 61) {
          blue = sketch.constrain(
            sketch.map(sound.currentTime(), 44, 44 + tr, 1, 0),
            0,
            1
          )
        }
        if (sound.currentTime() > 61 && sound.currentTime() < 96) {
          blue = sketch.constrain(
            sketch.map(sound.currentTime(), 61, 61 + tr, 0, 1),
            0,
            1
          )
        }
        if (sound.currentTime() > 96 && sound.currentTime() < 132) {
          blue = sketch.constrain(
            sketch.map(sound.currentTime(), 96, 96 + tr, 1, 0),
            0,
            1
          )
        }
        if (sound.currentTime() > 132 && sound.currentTime() < 152) {
          blue = sketch.constrain(
            sketch.map(sound.currentTime(), 132, 132 + tr, 0, 1),
            0,
            1
          )
        }
        if (sound.currentTime() > 152) {
          blue = sketch.constrain(
            sketch.map(sound.currentTime(), 152, 152 + tr, 1, 0),
            0,
            1
          )
        }
      }
    }
  }

  sketch.togglePlay = () => {
    if (sound.isPlaying()) {
      sound.pause()
    } else {
      sound.loop()
    }
  }
}

new p5(sketch)
