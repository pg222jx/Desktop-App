import { IconEvents } from './IconEvent.js'
import { MemoryGame } from './memory-game.js'
import { ChatApp } from './chat-app.js'
import { Fireplace } from './fire-place.js'

/**
 * The starting point of the application
 * @author Pernilla Göth
 *
 */

const memoryIcon = document.querySelector('#memoryIcon')
const memoryImage = memoryIcon.src
const memoryGame = new MemoryGame()
memoryGame.setAttribute('slot', 'app')
const memoryEvent = new IconEvents(memoryIcon, memoryImage, memoryGame)
memoryEvent.clickIcons()

const chatIcon = document.querySelector('#chatIcon')
const chatImage = chatIcon.src
const chatApp = new ChatApp()
chatApp.setAttribute('slot', 'app')
const chatEvent = new IconEvents(chatIcon, chatImage, chatApp)
chatEvent.clickIcons()

const fireIcon = document.querySelector('#fireIcon')
const fireImage = fireIcon.src
const fireApp = new Fireplace()
fireApp.setAttribute('slot', 'app')
const fireEvent = new IconEvents(fireIcon, fireImage, fireApp)
fireEvent.clickIcons()
