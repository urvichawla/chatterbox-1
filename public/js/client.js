// const socket = io(window.location.origin, {
//     transports: ['websocket', 'polling'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000
// });


// DOM Elements
const form = document.getElementById('send-container');
const messageinp = document.getElementById('messageinp');
const messageContainer = document.querySelector("#message-container");
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');
 const endsession = document.getElementById('end-sessions');

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
        endsession.style.display = 'none'; 
       
    } else {
        endsession.style.display = 'inline-block'; // Show the button
        endsession.disabled = false; 
        
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
// const append = (message, position) => {
//     const messageEl = document.createElement('div');
//     messageEl.classList.add('message', position);
  
//     if (message.includes('```')) {
//         // Split message into code and non-code parts
//         const parts = message.split(/```(\w+)?\n?|\n?```/);
//         parts.forEach((part, index) => {
//             if (index % 2 === 0) {
//                 // Non-code part
//                 if (part.trim()) {
//                     const textNode = document.createElement('div');
//                     textNode.textContent = part;
//                     messageEl.appendChild(textNode);
//                 }
//             } else {
//                 // Code part
//                 const codeBlock = document.createElement('pre');
//                 const codeEl = document.createElement('code');
//                 // If language is specified, add class for syntax highlighting
//                 if (parts[index - 1] && parts[index - 1].trim()) {
//                     codeEl.className = `language-${parts[index - 1].trim()}`;
//                 }
//                 codeEl.textContent = part;
//                 codeBlock.appendChild(codeEl);
//                 messageEl.appendChild(codeBlock);
//                 // Apply syntax highlighting
//                 hljs.highlightElement(codeEl);
//             }
//         });
//     } else if (message.includes('`')) {
//         // Handle inline code
//         const parts = message.split(/`([^`]+)`/);
//         parts.forEach((part, index) => {
//             if (index % 2 === 0) {
//                 // Non-code part
//                 if (part.trim()) {
//                     const textNode = document.createElement('div');
//                     textNode.textContent = part;
//                     messageEl.appendChild(textNode);
//                 }
//             } else {
//                 // Inline code part
//                 const inlineCode = document.createElement('code');
//                 inlineCode.className = 'inline-code';
//                 inlineCode.textContent = part;
//                 messageEl.appendChild(inlineCode);
//             }
//         });
//     } else{
//         messageEl.innerText = message;

//     }
   
//     messageContainer.append(messageEl);
//     messageContainer.scrollTop = messageContainer.scrollHeight;
//     if (position === 'left') {
//         audio.play();
//     }
// // };
// const append = (message, position) => {
//     const messageEl = document.createElement('div');
//     messageEl.classList.add('message', position);
  
//     if (message.includes('```')) {
//         // Split message into code and non-code parts
//         const parts = message.split(/```(\w+)?\n?|\n?```/);
//         parts.forEach((part, index) => {
//             if (index % 2 === 0) {
//                 // Non-code part (regular text)
//                 if (part.trim()) {
//                     const textNode = document.createElement('div');
//                     textNode.textContent = part;
//                     messageEl.appendChild(textNode);
//                 }
//             } else {
//                 // Code part
//                 const codeBlock = document.createElement('pre');
//                 const codeEl = document.createElement('code');
                
//                 // Get the language specified after the opening ```
//                 const language = parts[index - 1]?.trim().toLowerCase();
                
//                 if (language) {
//                     // Only add the language class if it's a valid language in highlight.js
//                     if (hljs.getLanguage(language)) {
//                         codeEl.className = `language-${language}`;
//                     }
//                 }
                
//                 codeEl.textContent = part;
//                 codeBlock.appendChild(codeEl);
//                 messageEl.appendChild(codeBlock);
                
//                 // Apply syntax highlighting
//                 hljs.highlightElement(codeEl);
//             }
//         });
//     } else if (message.includes('`')) {
//         // Handle inline code
//         const parts = message.split(/`([^`]+)`/);
//         parts.forEach((part, index) => {
//             if (index % 2 === 0) {
//                 // Non-code part
//                 if (part.trim()) {
//                     const textNode = document.createElement('div');
//                     textNode.textContent = part;
//                     messageEl.appendChild(textNode);
//                 }
//             } else {
//                 // Inline code part
//                 const inlineCode = document.createElement('code');
//                 inlineCode.className = 'inline-code';
//                 inlineCode.textContent = part;
//                 messageEl.appendChild(inlineCode);
//             }
//         });
//     } else {
//         messageEl.innerText = message;
//     }
   
//     messageContainer.append(messageEl);
//     messageContainer.scrollTop = messageContainer.scrollHeight;
//     if (position === 'left') {
//         audio.play();
//     }
// };
// const append = (message, position) => {
//     const messageEl = document.createElement('div');
//     messageEl.classList.add('message', position);

//     // Extract the user prefix if it exists (e.g., "Creator: " or "You: ")
//     let content = message;
//     const prefixMatch = message.match(/^(Creator|You): /);
//     const prefix = prefixMatch ? prefixMatch[0] : '';
//     if (prefix) {
//         content = message.slice(prefix.length);
//     }

//     // Function to detect programming language based on content
//     const detectLanguage = (code) => {
//         // Common patterns for different languages
//         const patterns = {
//             cpp: /#include|std::|iostream|int main/,
//             python: /^(def |print|import |class |if __|from )/,
//             javascript: /^(function|const|let|var|=>)/,
//             html: /^<!DOCTYPE|<html|<div|<p|<script/,
//             css: /^(\.|#|body|@media|@import)/
//         };

//         for (const [lang, pattern] of Object.entries(patterns)) {
//             if (pattern.test(code.trim())) {
//                 return lang;
//             }
//         }
//         return '';
//     };
//     content = content.replace(/\\n/g, '\n');

//     // Handle explicitly marked code blocks with ```
//     if (content.includes('```')) {
//         const parts = content.split(/```(\w+)?\n?|\n?```/);
//         if (prefix) {
//             messageEl.appendChild(document.createTextNode(prefix));
//         }
//         parts.forEach((part, index) => {
//             if (index % 2 === 0) {
//                 if (part.trim()) {
//                     const textNode = document.createElement('div');
//                     textNode.textContent = part;
//                     messageEl.appendChild(textNode);
//                 }
//             } else {
//                 const codeBlock = document.createElement('pre');
//                 const codeEl = document.createElement('code');
//                 const language = parts[index - 1]?.trim().toLowerCase() || detectLanguage(part);
//                 if (language && hljs.getLanguage(language)) {
//                     codeEl.className = `language-${language}`;
//                 }
//                 codeEl.textContent = part;
//                 codeBlock.appendChild(codeEl);
//                 messageEl.appendChild(codeBlock);
//                 hljs.highlightElement(codeEl);
//             }
//         });
//     } 
//     // Auto-detect and format code that isn't wrapped in backticks
//     else if (content.includes('#include') || content.includes('int main') || 
//              content.includes('std::') || content.includes('cout')) {
//         if (prefix) {
//             messageEl.appendChild(document.createTextNode(prefix));
//         }
//         const codeBlock = document.createElement('pre');
//         const codeEl = document.createElement('code');
//         codeEl.className = 'language-cpp';
//         codeEl.textContent = content;
//         codeBlock.appendChild(codeEl);
//         messageEl.appendChild(codeBlock);
//         hljs.highlightElement(codeEl);
//     }
//     // Handle inline code
//     else if (content.includes('`')) {
//         if (prefix) {
//             messageEl.appendChild(document.createTextNode(prefix));
//         }
//         const parts = content.split(/`([^`]+)`/);
//         parts.forEach((part, index) => {
//             if (index % 2 === 0) {
//                 if (part.trim()) {
//                     const textNode = document.createElement('div');
//                     textNode.textContent = part;
//                     messageEl.appendChild(textNode);
//                 }
//             } else {
//                 const inlineCode = document.createElement('code');
//                 inlineCode.className = 'inline-code';
//                 inlineCode.textContent = part;
//                 messageEl.appendChild(inlineCode);
//             }
//         });
//     }
//     // Regular text
//     else {
//         messageEl.innerText = message;
//     }

//     messageContainer.append(messageEl);
//     messageContainer.scrollTop = messageContainer.scrollHeight;
//     if (position === 'left') {
//         audio.play();
//     }
// };
const append = (message, position) => {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message', position);

    // Extract user prefix
    let content = message;
    const prefixMatch = message.match(/^(Creator|You): /);
    const prefix = prefixMatch ? prefixMatch[0] : '';
    if (prefix) content = message.slice(prefix.length);

    // Language detection function
    const detectLanguage = (code) => {
        const patterns = {
            cpp: /#include|std::|iostream|int main/,
            python: /^(def |print|import |class |if __|from )/,
            javascript: /^(function|const|let|var|=>|console\.|return|new|for|while|if|else|document\.|async|await|try|catch|switch|case|throw|class)/,
            html: /^<!DOCTYPE|<html|<div|<p|<script/,
            css: /^(\.|#|body|@media|@import)/
        };
        for (const [lang, pattern] of Object.entries(patterns)) {
            if (pattern.test(code.trim())) return lang;
        }
        return '';
    };

    // Create code block utility
    const createCodeBlock = (content, language) => {
        const codeBlock = document.createElement('pre');
        const codeEl = document.createElement('code');
        codeEl.className = `language-${language}`;
        codeEl.textContent = content;
        codeBlock.appendChild(codeEl);
        hljs.highlightElement(codeEl);
        return codeBlock;
    };

    content = content.replace(/\\n/g, '\n');

    // Handle code blocks with backticks
    if (content.includes('```')) {
        const parts = content.split(/```(\w+)?\n?|\n?```/);
        if (prefix) messageEl.appendChild(document.createTextNode(prefix));
        parts.forEach((part, index) => {
            if (index % 2 === 0 && part.trim()) {
                const textNode = document.createElement('div');
                textNode.textContent = part;
                messageEl.appendChild(textNode);
            } else {
                const language = detectLanguage(part);
                messageEl.appendChild(createCodeBlock(part, language));
            }
        });
    }
    // Auto-detect and format code without backticks
    else if (detectLanguage(content)) {
        if (prefix) messageEl.appendChild(document.createTextNode(prefix));
        const language = detectLanguage(content);
        messageEl.appendChild(createCodeBlock(content, language));
    }
    // Inline code or regular text
    else if (content.includes('`')) {
        if (prefix) messageEl.appendChild(document.createTextNode(prefix));
        const parts = content.split(/`([^`]+)`/);
        parts.forEach((part, index) => {
            if (index % 2 === 0 && part.trim()) {
                const textNode = document.createElement('div');
                textNode.textContent = part;
                messageEl.appendChild(textNode);
            } else {
                const inlineCode = document.createElement('code');
                inlineCode.className = 'inline-code';
                inlineCode.textContent = part;
                messageEl.appendChild(inlineCode);
            }
        });
    } else {
        messageEl.innerText = message;
    }

    messageContainer.append(messageEl);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if (position === 'left') audio.play();
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
endsession.addEventListener('click',()=>{
    console.log('End session clicked, roomId:', roomId);
    if(isCreator){
        socket.emit('end-sessions',roomId);
        endsession.disabled = true; // Di
       // Send just the roomId, not an object
         
    }
    
})


socket.on('timer-update', (data) => {
    isTimerStarted = data.isStarted;
    updateTimerDisplay(data.timeLeft);
    startTimerBtn.disabled = isTimerStarted;
});



 socket.on('session-ended', (reason) => {
    alert(reason || "Chat session has ended!");
    if (form) form.disabled = true;
    if (messageinp) messageinp.disabled = true;
    if (startTimerBtn) startTimerBtn.disabled = true;
    if (fileUploadForm) fileUploadForm.disabled = true;
    if (endsession) endsession.disabled = true;
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
    if(endsession) endsession.disabled=true;
    
    
    setTimeout(() => {
        window.location.href = '/';
    }, 3000); // Give users 3 seconds to read the message
});


socket.on('room-not-found', () => {
    alert('This room does not exist!');
    window.location.href = '/';
});