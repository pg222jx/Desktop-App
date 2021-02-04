import { WindowTemp } from './window-template.js'

class IconEvents {
  /**
   * @constructor
   * @param {string} icon the icon element to add event to
   * @param {string} image image source
   * @param {class} app the app to send into window
   */
  constructor (icon, image, app) {
    this.icon = icon
    this.image = image
    this.app = app
  }

  /**
   * @event click creating window with specified app
   */
  clickIcons () {
    this.icon.addEventListener('click', event => {
      const windowTemp = new WindowTemp(this.image)
      const divTag = document.querySelector('#showWindow')
      divTag.appendChild(windowTemp)
      const appClone = this.app.cloneNode(true)
      windowTemp.appendChild(appClone)
    })
  }
}

// exports
export { IconEvents }
