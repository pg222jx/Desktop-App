/**
 * Module for costume element chat-app
 * @author Pernilla Göth
 *
 */

const template = document.createElement('template')
template.innerHTML = `
<style>

  #container {
    height: auto;
    width: auto;
    text-align: center;
  }

  #messages {
    display: inline-block;
    padding-top: 5px;
    padding-right: 15px;
    width: 250px;
    height: 200px;
    margin-bottom: 15px;
    border-radius: 3px;
    font-family: "Courier New", Courier, monospace;
    font-size: 13px;
    overflow: auto;
  }

  #messages p {
    text-align: left;
  }

  #messages .name {
    font-weight: bold;
    padding-left: 5px;
  }

  #messages .text {
    padding-left: 15px;
    font-size: 13px;
  }

  #submit {
    border-radius: 3px;
    border-style: none;
    margin-top: 5px;
    background-color: #d3d6db;
    font-family: "Courier New", Courier, monospace;
    height: 2em;
    box-shadow: 1px 1px 5px #383535;
  }

  #submit:hover {
    background-color: white;
  }

  #messageArea {
    width: 245px;
    border-radius: 3px;
    border-style: none;
    padding: 2px;
  }

  #setUsername {
    margin-top: 30px;
  }

  #submitUsername {
    border-radius: 3px;
    border-style: none;
    background-color: #d3d6db;
    font-family: "Courier New", Courier, monospace;
    height: 2em;
    box-shadow: 1px 1px 5px #383535;
  }

  #submitUsername:hover {
    background-color: white;
  }

  #usernameInput {
    width: 80%;
    height: 25px;
    border-style: none;
    border-radius: 3px;
    font-family: "Courier New", Courier, monospace;
  }

  #changeName {
    border-radius: 3px;
    border-style: none;
    background-color: #d3d6db;
    font-family: "Courier New", Courier, monospace;
    height: 2em;
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 8px;
  }

  #changeName:hover {
    background-color: white;
  }

</style>

<div id="container">
  <div id="chat">
  <div id="setUsername"></div>
    <div id="messages"></div>

    <form>
      <textarea id="messageArea" placeholder="Write message here"></textarea><br>
      <button id="submit" type="submit">Send</button>
    </form>
    <button id="changeName" type="submit">Change username?</button>
  </div>
</div>`

class ChatApp extends window.HTMLElement {
  /**
   * Attaching element to shadowroot and storing variables
   * @constructor
   */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')

    this.messageToSend = this.shadowRoot.querySelector('#messageArea')
    this.submit = this.shadowRoot.querySelector('#submit')

    this.username = undefined
    this.usernameTemplate = undefined

    this.setUsername()
  }

  /**
   * @event click submit, sending the users message
   * @event click changeName, deleting stored username and storing new one
   * @event onmessage parsing and printing the recieved message
   */

  connectedCallback () {
    this.submit.addEventListener('click', event => {
      event.preventDefault()
      this.sendMessage()
    })

    this.socket.onmessage = (event) => {
      let recievedMessage = event.data
      recievedMessage = JSON.parse(recievedMessage)

      if (recievedMessage.type !== 'message') { return }

      const pName = document.createElement('p')
      pName.setAttribute('class', 'name')
      pName.textContent = `${recievedMessage.username}: `

      const pText = document.createElement('p')
      pText.setAttribute('class', 'text')
      pText.textContent = `${recievedMessage.data}`

      const messages = this.shadowRoot.querySelector('#messages')
      messages.appendChild(pName)
      messages.appendChild(pText)

      // scroll to end of page
      pText.scrollIntoView()
    }

    const changeName = this.shadowRoot.querySelector('#changeName')
    changeName.addEventListener('click', event => {
      if (this.usernameTemplate !== undefined) { return }
      window.localStorage.removeItem('Username')
      this.setUsername()
    })
  }

  /**
   * sending users message to server
   */

  sendMessage () {
    const message = {
      type: 'message',
      data: this.messageToSend.value,
      username: this.username,
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    this.socket.send(JSON.stringify(message))
    this.messageToSend.value = ''
  }

  /**
   * Storing set username to variable and localstorage
   */
  setUsername () {
    if (window.localStorage.getItem('Username') === null) {
      const setUsername = this.shadowRoot.querySelector('#setUsername')
      this.usernameTemplate = document.createElement('div')
      this.usernameTemplate.innerHTML = `
      <input type="text" name="username" id="usernameInput" placeholder="Username"> <br><br>
      <input type="submit" name="submitUsername" id="submitUsername" value="Save">
      `
      setUsername.appendChild(this.usernameTemplate)

      const submitUsername = this.shadowRoot.querySelector('#submitUsername')

      submitUsername.addEventListener('click', event => {
        this.username = this.shadowRoot.querySelector('#usernameInput').value
        window.localStorage.setItem('Username', JSON.stringify(this.username))
        this.usernameTemplate.remove()
        this.usernameTemplate = undefined
      })
    } else {
      this.username = JSON.parse(window.localStorage.getItem('Username'))
    }
  }
}

window.customElements.define('chat-app', ChatApp)

// exports
export { ChatApp }
