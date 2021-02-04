/**
 * Module for costume element memory-game
 * @author Pernilla Göth
 *
 */

const template = document.createElement('template')
template.innerHTML = `
<style>

  #container {
    padding: 25px;
    height: auto;
    width: auto;
    text-align: center;
    font-family: "Courier New", Courier, monospace;s
  }

  #game {
  display: inline-block;
  }

  #game img {
    width: 50px;
    box-shadow: 2px 2px 3px grey;
  }

</style>

<div id="container">
  <div id="game"></div>
</div>`

class MemoryGame extends window.HTMLElement {
  /**
   * Attaching element to shadowroot and storing variables
   * @constructor
   */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.rows = 4
    this.cols = 4

    this.cards = []

    this.hasFlippedCard = false
    this.firstCard = undefined
    this.secondCard = undefined

    this.lockBoard = false

    this.hiddenImg = 0

    this.id = null
    this.counter = 0

    this.moves = 0

    this.timer()

    this.createGame()
    this.shuffledCardsArray()
  }

  /**
   * @event click adding listener to flip cards with mouse or enter key
   */
  connectedCallback () {
    const hiddenCards = this.shadowRoot.querySelectorAll('.hiddenCard')
    const a = this.shadowRoot.querySelectorAll('a')

    for (let i = 0; i < hiddenCards.length; i++) {
      hiddenCards[i].addEventListener('click', event => {
        this.whenClicked(hiddenCards[i], this.cards[i])
      })
      a[i].addEventListener('keydown', event => {
        if (event.keyCode === 13) {
          this.whenClicked(hiddenCards[i], this.cards[i])
        }
      })
    }
  }

  /**
   * Setting up the game/adding cards
   */
  createGame () {
    const gameContainer = this.shadowRoot.querySelector('#game')
    let id = 0
    for (let i = 0; i < this.rows * this.cols; i++) {
      id++
      const aTag = document.createElement('a')
      aTag.setAttribute('href', '#')
      const img = document.createElement('img')
      img.setAttribute('src', './image/0.png')
      img.setAttribute('class', 'hiddenCard')
      img.setAttribute('id', id)
      aTag.appendChild(img)
      gameContainer.appendChild(aTag)

      if ((i + 1) % this.cols === 0) {
        const br = document.createElement('br')
        gameContainer.appendChild(br)
      }
    }
  }

  /**
   * shuffling the cards
   * @returns {array} shuffled array with the cards numbers
   */
  shuffledCardsArray () {
    for (let i = 1; i <= (this.rows * this.cols) / 2; i++) {
      this.cards.push(i)
      this.cards.push(i)
    }
    // fisherYates shuffle
    let length = this.cards.length
    let temporaryValue
    let randomCard

    while (length > 0) {
      randomCard = Math.floor(Math.random() * length)
      length -= 1
      temporaryValue = this.cards[length]
      this.cards[length] = this.cards[randomCard]
      this.cards[randomCard] = temporaryValue
    }
    return this.cards
  }

  /**
   * Turning the cards and adding functionality
   * @param {number} hiddenCard the hidden cards index
   * @param {number} shownCard the image number from the shuffled array
   */
  whenClicked (hiddenCard, shownCard) {
    if (this.lockBoard) { return }
    hiddenCard.src = './image/' + shownCard + '.png'
    this.moves++

    if (!this.hasFlippedCard) {
      this.hasFlippedCard = true
      this.firstCard = hiddenCard
    } else {
      this.secondCard = hiddenCard
      if (this.firstCard.id === this.secondCard.id) { return }
      this.hasFlippedCard = false

      if (this.firstCard.src === this.secondCard.src) {
        this.lockBoard = true
        window.setTimeout(() => {
          this.firstCard.style.visibility = 'hidden'
          this.secondCard.style.visibility = 'hidden'
        }, 500)
        this.hiddenImg += 2
        this.showTime()
      } else {
        this.lockBoard = true
        window.setTimeout(() => {
          this.firstCard.src = './image/0.png'
          this.secondCard.src = './image/0.png'
        }, 500)
      }

      window.setTimeout(() => {
        this.lockBoard = false
      }, 500)
    }
  }

  // extended feature = show how long it took for the player to win

  /**
   * Timer to count how many seconds the game takes
   */
  timer () {
    let counter = 0

    this.id = setInterval(() => {
      counter++
      this.counter = counter
    }, 1000)
  }

  /**
 * Showing how long and how many moves it took to play
 */
  showTime () {
    const gameContainer = this.shadowRoot.querySelector('#game')

    if (this.hiddenImg === (this.rows * this.cols)) {
      gameContainer.innerHTML = `
      <style>
        #finishedGame {
          border-radius: 3px;
          border-style: none;
          background-color: #d3d6db;
          font-family: "Courier New", Courier, monospace;
          margin-top: 5px;
          margin-bottom: 5px;
          padding: 7px;
        }

        .bold {
          font-weight: bold;
        }
      </style>
      <div id="finishedGame">
        <p>You finished the game in</p>
        <p class="bold">${this.counter} seconds </p>
        <p>and</p>
        <p class="bold">${this.moves / 2} moves!</p>
      </div>
      `
      clearInterval(this.id)
    }
  }
}

window.customElements.define('memory-game', MemoryGame)

// exports
export { MemoryGame }
