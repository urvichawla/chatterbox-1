const socket = io(window.location.origin, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});


// DOM Elements
const form = document.getElementById('send-container');
const messageinp = document.getElementById('messageinp');
const messageContainer = document.querySelector("#message-container");
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');
const fileUploadForm = document.getElementById('file-upload-form');
const fileList = document.getElementById('file-list');

// Get room ID from URL
const roomId = window.location.pathname.split('/').pop();

// Audio setup
const audio = new Audio('/ting-sound-197759.mp3');

// State variables
let isCreator = false;
let isTimerStarted = false;

// Join room on connection
socket.emit('join-room', roomId);

// Handle creator status
socket.on('set-as-creator', (creator) => {
    isCreator = creator;
    if (!creator) {
        startTimerBtn.style.display = 'none';
    } else {
        document.getElementById('file-upload-container').style.display = 'block';
        
        // Add beforeunload event listener for creator
        window.addEventListener('beforeunload', (e) => {
            if (isCreator) {
                // Emit creator-leaving event
                socket.emit('creator-leaving', roomId);
                
                // Cancel the event
                e.preventDefault();
                // Chrome requires returnValue to be set
                e.returnValue = '';
            }
        });
    }
});

// Message handling
const append = (message, position) => {
    const messageEl = document.createElement('div');
    messageEl.innerText = message;
    messageEl.classList.add('message', position);
    messageContainer.append(messageEl);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if (position === 'left') {
        audio.play();
    }
};

// Handle message form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageinp.value.trim();
    if (message) {
        append(`${isCreator ? 'Creator' : 'You'}: ${message}`, 'right');;
        socket.emit('send', { message, roomId, senderId: socket.id });
        messageinp.value = '';
    }
});

// Handle received messages
socket.on('receive', data => {
    if (data.senderId !== socket.id) {
        append(`${data.user}: ${data.message}`, 'left');
    }
});

// File upload handling
fileUploadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file first');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`/upload/room/${roomId}`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (response.ok) {
            fileInput.value = ''; // Clear the input
            alert('File uploaded successfully!');
        } else {
            throw new Error(data.message || 'Upload failed');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
    }
});

// Handle file upload notifications
socket.on('fileUploaded', (file) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<a href="${file.url}" target="_blank" class="file-link">${file.filename}</a>`;
    fileList.appendChild(listItem);
});

// Load existing files when joining room
socket.on('existing-files', (files) => {
    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${file.url}" target="_blank" class="file-link">${file.filename}</a>`;
        fileList.appendChild(listItem);
    });
});

// Timer functions
function updateTimerDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

startTimerBtn.addEventListener('click', () => {
    if (isCreator && !isTimerStarted) {
        socket.emit('start-timer', { roomId });
        startTimerBtn.disabled = true;
    }
});

socket.on('timer-update', (data) => {
    isTimerStarted = data.isStarted;
    updateTimerDisplay(data.timeLeft);
    startTimerBtn.disabled = isTimerStarted;
});

socket.on('session-ended', (reason) => {
    alert(reason || "Chat session has ended!");
    window.location.href = '/';
});

// Handle user join/leave events
socket.on('user-joined', (username) => {
    append(`${username} joined the chat`, 'center');
});

socket.on('left', (username) => {
    append(`${username} left the chat`, 'center');
});

socket.on('creator-leaving', () => {
    append('The room creator has left. This session will end.', 'center');
    // Disable all interactive elements
    if (form) form.disabled = true;
    if (messageinp) messageinp.disabled = true;
    if (startTimerBtn) startTimerBtn.disabled = true;
    if (fileUploadForm) fileUploadForm.disabled = true;
    
    setTimeout(() => {
        window.location.href = '/';
    }, 3000); // Give users 3 seconds to read the message
});

socket.on('room-not-found', () => {
    alert('This room does not exist!');
    window.location.href = '/';
});