
const generateMessage = (username, message) => {
    return {
        username: username,
        text: message,
        createdAt: new Date().getTime()
    }
}


const generateUrlMessage = (username, url) => {
    return {
        username: username,
        url: url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateUrlMessage
}