const socket = io()

const chatForm = document.querySelector('#messageForm')
const sendLocationButton = document.querySelector('#sendLocation')

socket.on('message', (message) => {
    console.log(`message: ${message}`)
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.messageInput.value
    e.target.elements.messageInput.value = ''
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return console.log('error')
        }
        console.log('the message was received')
    })
})

sendLocationButton.addEventListener('click', (e) => {
    e.preventDefault()

    if (!navigator.geolocation) {
        return alert('geolocation is not supportted by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})