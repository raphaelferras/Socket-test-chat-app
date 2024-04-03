const socket = io()

const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = messageForm.querySelector('input')
const $messageFormButton = messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#sendLocation')
const $messagesContainer = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // get the new message
    const $newmessage = $messagesContainer.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newmessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newmessage.offsetHeight + newMessageMargin

    const visibleHeight = $messagesContainer.offsetHeight

    const containerHeight = $messagesContainer.scrollHeight

    const scrollOffset = $messagesContainer.scrollTop + visibleHeight
    if (containerHeight - newMessageHeight - 10 <= scrollOffset) {
        $messagesContainer.scrollTop = $messagesContainer.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm:ss')
    })
    $messagesContainer.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (link) => {
    console.log(`locationMessage: ${link}`)
    const html = Mustache.render(locationMessageTemplate, {
        username: link.username,
        link: link.url,
        createdAt: moment(link.createdAt).format('HH:mm:ss')
    })
    $messagesContainer.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})