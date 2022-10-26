// export const width = window.innerWidth
// export const height = window.innerHeight
export const width = 1400
export const height = 800

export const margin = {
  right: 100,
  left: 100,
  top: 100,
  bottom: 100,
  gutter: 30,
}

export const canvas = {
  x: -width / 2 + margin.left,
  y: -height / 2 + margin.top,
  w: width - margin.right - margin.left,
  h: height - margin.top - margin.bottom,
}

export const nbCols = 3
export const colWidth = (canvas.w - margin.gutter * (nbCols - 1)) / nbCols

export const blocks = []

blocks[0] = {
  x: canvas.x,
  y: canvas.y,
  w: colWidth,
  h: (3 * canvas.h) / 4 - margin.gutter,
  shader: 'curve'
}

blocks[1] = {
  x: canvas.x,
  y: canvas.y + blocks[0].h + margin.gutter,
  w: colWidth,
  h: canvas.h / 4,
  shader: 'blur'
}

blocks[2] = {
  x: canvas.x + colWidth + margin.gutter,
  y: canvas.y,
  w: colWidth / 2 - margin.gutter / 2,
  h: canvas.h / 2 - margin.gutter / 2,
  shader: 'grid'
}

blocks[3] = {
  x: blocks[2].x + blocks[2].w + margin.gutter,
  y: canvas.y,
  w: colWidth / 2 - margin.gutter / 2,
  h: canvas.h / 2 - margin.gutter / 2,
  shader: 'smallcircles'
}

blocks[4] = {
  x: blocks[3].x + blocks[3].w + margin.gutter,
  y: canvas.y,
  w: colWidth,
  h: canvas.h / 2 - margin.gutter / 2,
  shader: 'waves'
}

blocks[5] = {
  x: canvas.x + colWidth + margin.gutter,
  y: canvas.y + blocks[2].h + margin.gutter,
  w: canvas.w - colWidth - margin.gutter,
  h: canvas.h / 2 - margin.gutter / 2,
  shader: 'circles'
}