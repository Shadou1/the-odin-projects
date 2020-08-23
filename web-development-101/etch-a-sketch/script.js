
const header = document.querySelector('header')
const toolbarElem = document.querySelector('#toolbar')

const sketchContainer = document.querySelector('#sketch-container')
const sketchWrapper = document.querySelector('#sketch-wrapper')

// Style for setting ::before pseudo element's styles
const extraStyle = document.head.appendChild(document.createElement('style'))

// toolbar buttons and selectors
const buttonColorPen = document.querySelector('#button-color-pen')
const buttonColorBackground = document.querySelector('#button-color-background')

const selectorPen = document.querySelector('#pen-selector')

const buttonClear = document.querySelector('#button-clear')
const buttonGrid = document.querySelector('#button-grid')
const buttonNew = document.querySelector('#button-new')

let isMouseDown = false
let isGridShown = false

let currentColor = buttonColorPen.value
sketchContainer.style.backgroundColor = buttonColorBackground.value

let colorFunction
selectPen(selectorPen.value)

// Create Grid
function createGrid(xSize, ySize) {

    // Clear grid
    sketchWrapper.innerHTML = ''

    for (let i = 0; i < ySize; i++) {

        const rowDiv = document.createElement('div')
        rowDiv.classList.add('grid-row')
        sketchWrapper.appendChild(rowDiv)

        for (let j = 0; j < xSize; j++) {

            const cellDiv = document.createElement('div')
            cellDiv.classList.add('grid-cell')
            rowDiv.appendChild(cellDiv)

        }

    }

    // If grid is shown
    if (isGridShown) {
        const cells = document.querySelectorAll('.grid-cell')
        cells.forEach(cell => cell.classList.toggle('show-grid-cell'))
    }

    // Keeping aspect ratio of inner cells square will create very long and small
    // sketch pads, so I won't use this

    // const aspectRatio = ySize / xSize * 100 + '%'
    // extraStyle.innerHTML = `#sketch-container::before { padding-top: ${aspectRatio}; }`

}

// Resize sketchpad on window resize
function onWindowResize() {

    const extraHeight = +toolbarElem.offsetHeight + +header.offsetHeight

    // Getting elements sizes + margins in vanilla javascript is a bit complicated
    // so I'll use hardcoded numbers for now
    // Also, this only works with square sketch pads
    const minDimension = Math.min(
        document.documentElement.clientWidth - 40,
        document.documentElement.clientHeight - extraHeight - 40
    )

    sketchContainer.style.width = minDimension + 'px'

}

// Callback Functions

function onMouseDown(e) {
    isMouseDown = true
    if (e.target.classList.contains('grid-cell')) {
        e.target.style.backgroundColor = colorFunction(e)
    }
}

function onMouseUp(e) {
    isMouseDown = false
}

function onMouseOver(e) {
    if (isMouseDown) {
        if (e.target.classList.contains('grid-cell')) {
            e.target.style.backgroundColor = colorFunction(e)
        }
    }
}

function getPlainColor(e) {
    e.target.setAttribute('data-brightness', '100')
    e.target.style.filter = 'brightness(100%)'
    return currentColor
}

function getRainbowColor(e) {
    e.target.setAttribute('data-brightness', '100')
    e.target.style.filter = 'brightness(100%)'
    return `rgb(${Math.random() * 255},
                ${Math.random() * 255},
                ${Math.random() * 255})`
}

// Shading pen will only shade already colored cells
function getShadeColor(e) {
    let currentBrightness = e.target.getAttribute('data-brightness')
    currentBrightness -= 10
    e.target.setAttribute('data-brightness', currentBrightness)
    e.target.style.filter = `brightness(${currentBrightness + '%'})`
    return e.target.style.backgroundColor
}

function selectPen(penStyle) {
    if (penStyle == 'plain-pen') colorFunction = getPlainColor
    else if (penStyle == 'rainbow-pen') colorFunction = getRainbowColor
    else if (penStyle == 'shading-pen') {
        // Set Default brightness to 100 when selecting shading pen
        addBrightness()
        colorFunction = getShadeColor
    }
}

function addBrightness() {
    const cells = document.querySelectorAll('.grid-cell')
    cells.forEach(cell => {
        if (!cell.getAttribute('data-brightness')){
            cell.setAttribute('data-brightness', '100')
        }
    })
}

// Resize
window.addEventListener('resize', onWindowResize)

// Mouse up/down
window.addEventListener('mousedown', onMouseDown)
window.addEventListener('mouseup', onMouseUp)

// Mouse over sketchContainer's grid-cell
sketchContainer.addEventListener('mouseover', onMouseOver)

// Select pen / background color
buttonColorPen.addEventListener('change', e => currentColor = e.target.value)
buttonColorBackground.addEventListener('change', e => sketchContainer.style.backgroundColor = e.target.value)

// Select pen style
selectorPen.addEventListener('change', e => {
    selectPen(e.target.value)
})

// buttonPen.addEventListener('click', e => colorFunction = getPlainColor)
// buttonRainbow.addEventListener('click', e => colorFunction = getRainbowColor)
// buttonShading.addEventListener('click', e => {
//     addBrightness()
//     colorFunction = getShadeColor
// })

buttonClear.addEventListener('click', e => {
    const cells = document.querySelectorAll('.grid-cell')
    cells.forEach(cell => cell.style.backgroundColor = 'transparent')
})

buttonGrid.addEventListener('click', e => {
    const cells = document.querySelectorAll('.grid-cell')
    cells.forEach(cell => cell.classList.toggle('show-grid-cell'))
    sketchContainer.classList.toggle('show-grid-sketch')
    isGridShown = !isGridShown
})

// Create new grid
buttonNew.addEventListener('click', e => {

    let newWidth
    while (!+newWidth) {

        newWidth = prompt('What\'s the width?', 32)
        if (+newWidth) {
            if (newWidth > 100) {
                const areYouSure = confirm(`Are you sure? ${newWidth} cells could take a while to generate.`)
                if (!areYouSure) newWidth = undefined
            }
        } else {
            alert(`${newWidth} is not a number hmmmm...`)
        }

    }

    let newHeight
    while (!+newHeight) {

        newHeight = prompt('What\'s the height?', 32)
        if (+newHeight) {
            if (newHeight > 100) {
                const areYouSure = confirm(`Are you sure? This is ${newWidth * newHeight} cells total!`)
                if (!areYouSure) newHeight = undefined
            }
        } else {
            alert(`${newHeight} is not a number hmmmm...`)
        }

    }

    createGrid(newWidth, newHeight)
    onWindowResize()

})

createGrid(32, 32)
onWindowResize()