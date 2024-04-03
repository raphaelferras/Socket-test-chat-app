const socket = io()

const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = messageForm.querySelector('input')
const $messageFormButton = messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#sendLocation')
const $messagesContainer = document.querySelector('#messages')

// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('message', (message) => {
    console.log(`message: ${message}`)
    const html = Mustache.render($messageTemplate, {
        message
    })
    $messagesContainer.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (link) => {
    console.log(`locationMessage: ${link}`)
    const html = Mustache.render($locationMessageTemplate, {
        link
    })
    $messagesContainer.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = $messageFormInput.value
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()


        if (error) {
            return console.log('error')
        }

        console.log('the message was received')
    })
})

$sendLocationButton.addEventListener('click', (e) => {
    e.preventDefault()
    $sendLocationButton.setAttribute('disabled', 'disabled')

    if (!navigator.geolocation) {
        return alert('geolocation is not supportted by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('location was shared correctly')
        })
    })
})