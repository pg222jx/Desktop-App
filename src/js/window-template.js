
/**
 * Module for costume element window-template
 * @author Pernilla Göth
 *
 */

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      position: absolute;
      left: 80px; 
      top: 80px;
    }

    #window {
      background-color: rgb(255, 255, 255, 0.5);
      height: auto;
      width: auto;
      border-radius: 5px;
      box-shadow: 5px 5px 10px #212121;
    }

    #menuBar {
      background-color: rgb(0, 0, 0, 0.5);
      height: 30px;
      width: auto;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    #menuBar img {
      margin: 2px;
      height: 25px;
      float: left;
    }

    #menuActions {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    #menuActions li {
      display: inline-block;
      float: right;
      padding-right: 7px;
      padding-left: 7px;
      cursor: pointer;
      background-color: #ad3636;
      border-style: solid;
      border-color: #a32929;
      border-width: 2px;
      margin-left: 2px;
      border-radius: 3px;
      font-size: 15px;
      margin-top: 4px;
      margin-right: 4px;
    }

    #close {
      margin-right: 2px;
      box-shadow: 1px 1px 1px black;
      transition: background-color 0.5s;
    }

    #close:hover {
      background-color: #a32929;
    }
  </style>

  <div id="window">
    <div id="menuBar">
    <img/>
      <ul id="menuActions">
        <li id="close">X</li>
      </ul>
    </div>
    <slot name="app"></slot>
  </div>
`
let myZIndex = 0

class WindowTemp extends window.HTMLElement {
  /**
   * Attaching element to shadowroot and storing variables
   * @constructor
   * @param {string} image
   * @param {class} app
   */
  constructor (image) {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.image = image

    this.imgTag = this.shadowRoot.querySelector('img')
    this.imgTag.setAttribute('src', this.image)

    this.container = this.shadowRoot.querySelector('#window')
    this.menuBar = this.shadowRoot.querySelector('#menuBar')

    this.mouseDown = false

    this.currentX = 0
    this.currentY = 0
    this.initialX = undefined
    this.initialY = undefined
  }

  /**
 * Inspiration found: https://www.kirupa.com/html5/drag.htm
 * @events to be able to move window on page
 */
  connectedCallback () {
    this.container.addEventListener('pointerdown', (event) => {
      this.style.zIndex = myZIndex++

      if (event.target === this.menuBar) {
        this.initialX = event.clientX - this.currentX
        this.initialY = event.clientY - this.currentY

        this.mouseDown = true
      }
    })

    window.addEventListener('pointermove', (event) => {
      if (this.mouseDown) {
        this.currentX = event.clientX - this.initialX
        this.currentY = event.clientY - this.initialY

        this.style.transform = 'translate3d(' + this.currentX + 'px, ' + this.currentY + 'px, 0)'
      }
    })

    window.addEventListener('pointerup', () => {
      this.mouseDown = false
    })

    this.shadowRoot.querySelector('#close').addEventListener('click', event => {
      this.style.zIndex = myZIndex++
      const element = document.querySelector('window-template')
      element.parentNode.removeChild(this)
    })
  }
}

window.customElements.define('window-template', WindowTemp)

// exports
export { WindowTemp }
