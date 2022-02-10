const socket = io();

//Elements:

const form = document.querySelector('#messageForm');
const messageFormInput = document.querySelector('#chatInput');
const messageFormButton = document.querySelector('#submitFormbutton');
const locationButton = document.querySelector('#sendLocation');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//options
const { username, room } =  Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
    // message = "Auto";
    const $newMessage = $messages.lastElementChild;

    // height of last message element
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // visible height of component
    const visibleHeight = $messages.offsetHeight;

    // total height of overflow container
    const conteinerHeight = $messages.scrollHeight;

    // how far have i scrolled;
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (conteinerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('locationMessage', ({ username, url, created_at }) => {
    const html = Mustache.render(locationTemplate, { username, url, created_at });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

socket.on('message', ({ username, text, created_at }) => {
    console.log('message', text)
    const html = Mustache.render(messageTemplate, { username, message: text, created_at });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, { room, users });
    $sidebar.innerHTML = html;
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    //disable form

    messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (error) => {
        // enable form
        messageFormButton.removeAttribute('disabled');
        messageFormInput.value = '';
        messageFormInput.focus();
    })

})

locationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Location not supported by your browser');
    }

    locationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude }}) => {
        socket.emit('sendLocation', { latitude, longitude }, () => {
            console.log('submited location')
            locationButton.removeAttribute('disabled');
        });
    });
})

// socket.on('countUpdated', (count) => {
//     console.log('the count has been updated', count)
// })

// document.getElementById('increment').addEventListener('click', () => {
//     console.log('clicked');
//     socket.emit('increment');
// });
socket.emit('join', { username, room }, error => {
    if (error) {
        alert(error);
        location.href='/';
    }
});