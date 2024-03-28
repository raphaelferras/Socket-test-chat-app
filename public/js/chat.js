const socket = io()

const chatForm = document.querySelector('#messageForm')

socket.on('message', (message) => {
    console.log(`message: ${message}`)
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.messageInput.value
    e.target.elements.messageInput.value = ''
    socket.emit('sendMessage', message)
})