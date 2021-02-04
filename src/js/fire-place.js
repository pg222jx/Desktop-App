/**
 * Module for costume element fire-place
 * @author Pernilla Göth
 *
 */

const template = document.createElement('template')
template.innerHTML = `
<style>

    #container {
        text-align: center;
        padding: 2px;
    }

    .button {
        display: inline-block;
        height: 50px;
        opacity: 0.8;
    }

    #water {
      padding-left: 65px;
    }

    #log {
      padding-left: 55px;
    }

    #fireContainer {
        background-color: black;
        border-radius: 5px;
    }

    #fireContainer img {
        width: 600px;
        height: 350px;
        border-radius: 5px;
        transition: opacity 5s;
    }

</style>

<div id="container">
    <div id="buttons">
        <img src="/image/matchlit.png" alt="match" id="match" class="button"/>
        <img src="/image/log.png" alt="log" class="button" id="log"/>
        <img src="/image/waterdrop.png" alt="water" class="button" id="water"/>
    </div>

    <div id="fireContainer">
        <img src="/image/fire2.gif" alt="Fire" id="fireplace"/>
    </div>
</div>
`

class Fireplace extends window.HTMLElement {
  /**
   * Attaching element to shadowroot and storing variables
   * @constructor
   */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.fireImg = this.shadowRoot.querySelector('#fireplace')
    this.fireImg.style.opacity = 0

    this.transition = false
    this.matchLit = false
  }

  /**
   * @event transitionend storing if transition has ended
   * @event transitionstart storing if transition is active
   * @event click adding listener to icons
   */
  connectedCallback () {
    this.fireImg.addEventListener('transitionend', (event) => {
      this.transition = false
    })

    this.fireImg.addEventListener('transitionstart', (event) => {
      this.transition = true
    })

    this.shadowRoot.addEventListener('click', (event) => {
      if (event.target === this.shadowRoot.querySelector('#match')) {
        this.matchEvent()
      } else if (event.target === this.shadowRoot.querySelector('#log')) {
        this.logEvent()
      } else if (event.target === this.shadowRoot.querySelector('#water')) {
        this.waterEvent()
      }
    })
  }

  /**
   * If no transition is active set image opacity to 1 and starting timer
   */
  matchEvent () {
    if (this.transition === false) {
      this.fireImg.style.opacity = 1
      this.matchLit = true
      this.timer()
    }
  }

  /**
   * If transition is active set image opacity to 1 and starting timer
   */
  logEvent () {
    if (this.transition === true) {
      this.fireImg.style.opacity = 1
      this.timer()
    }
  }

  /**
   * Putting out fire and showing smoke image
   */
  waterEvent () {
    if (this.shadowRoot.querySelector('#smoke')) { return }

    if (this.matchLit === true) {
      this.fireImg.style.opacity = 0

      const img = document.createElement('img')
      img.setAttribute('src', '/image/smoke.gif')
      img.setAttribute('id', 'smoke')
      const container = this.shadowRoot.querySelector('#fireContainer')

      setTimeout(() => {
        this.fireImg.remove()
        container.appendChild(img)
        img.style.opacity = 0
      }, 4000)

      setTimeout(() => {
        img.style.opacity = 1
      }, 4500)
    }
  }

  /**
   * Setting image opacity to 0 after 10 sec
   */
  timer () {
    setTimeout(() => {
      this.fireImg.style.opacity = 0
    }, 10000)
  }
}

window.customElements.define('fire-place', Fireplace)

// exports
export { Fireplace }
