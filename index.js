// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // Middleware to serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Middleware to parse JSON bodies (for form submissions)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const users = {}; // Initialize users object to track connected users

// // Set the view engine to EJS
// app.set('view engine', 'ejs');

// // Set the views directory
// app.set('views', path.join(__dirname, 'views'));

// // Serve the index page
// app.get('/', (req, res) => {
//     const staticRoomId = 'sharedChatRoom';
//     res.render('index', { roomId: staticRoomId }); // Render the homepage with the static room ID
// });

// app.post('/room', (req, res) => {
//     const roomId = req.body.roomId; // Get roomId from the form
//     res.redirect(`/room/${roomId}`); // Redirect to the room page
// });

// // Room route
// app.get('/room/:id', (req, res) => {
//     const roomId  = req.params.id;
//     if (roomId) {
//         res.render('room', { roomId });
//     } else {
//         res.status(400).send("Room ID not found.");
//     }
//  // Render the room page with the room ID
// });

// io.on('connection', (socket) => {
//     // When a user joins a room
//     socket.on('join-room', roomId => {
//         socket.join(roomId); // Join the specified room
//         const userLabel = `User${Math.floor(Math.random() * 1000)}`;
//         users[socket.id] = userLabel;
       
//        // console.log(`${userLabel} has joined the room: ${roomId}`)
//         socket.to(roomId).emit('user-joined', `${userLabel} `);
//     });

//     // When a message is sent

// //    socket.on('send', message => {
// //     const roomId = Object.keys(socket.rooms).find(r => r !== socket.id); // Get the correct room ID
// //     console.log(`Sending message: ${message} to room: ${roomId}`);
// //     socket.to(roomId).emit('receive', { message: message, user: users[socket.id]});

// // });
// // socket.on('send', ({message, roomId }) => {
// //     io.to(roomId).emit('receive', {message:message, user: users[socket.id],sed });
// // });
// socket.on('send', (data) => {
//     console.log(`Message from ${data.senderId} in room ${data.roomId}: ${data.message}`);
//     // Broadcast the message to all clients in the room
//     socket.to(data.roomId).emit('receive', {
//         message: data.message,
//         user: users[socket.id], // Assuming you have a users object mapping socket IDs to usernames
//         senderId: data.senderId // Send the sender's ID to clients
//     });
// });


        

//     // Handle user disconnect
//     socket.on('disconnect', () => {
//         const userLabel = users[socket.id];
//         socket.broadcast.emit('left', userLabel);
//         delete users[socket.id];
//     });
//     socket.on('start-timer', (data) => {
//         const { time, roomId } = data;
    
//         // Broadcast the timer start to all clients in the room
//         io.to(roomId).emit('timer-update', time); // Notify all clients with the initial time
    
//         // Start the countdown on the server-side
//         let currentTime = time;
//         const countdownInterval = setInterval(() => {
//             currentTime--;
    
//             // Emit timer updates to clients
//             io.to(roomId).emit('timer-update', currentTime);
    
//             // Clear interval when time is up
//             if (currentTime <= 0) {
//                 clearInterval(countdownInterval);
//             }
//         }, 1000);
//     });
    
// });

// server.listen(8001, () => {
//     console.log('Server running at http://localhost:8001');
// });
// require('dotenv').config();

// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);
// const { v4: uuidv4 } = require('uuid');

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const users = {}; // Track connected users
// const rooms = {}; // Track room states

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use('/js', express.static(path.join(__dirname, 'js')));
// const { v4: uuidv4 } = require('uuid');

// // Generate unique room ID using uuid
// function generateRoomId() {
//     return uuidv4(); // Generates a highly unique string
// }


// // Example route for your shared chat room

// app.get('/', (req, res) => {
//     const staticRoomId = 'sharedChatRoom';
//     res.render('index', { roomId: staticRoomId });
// });
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// // Cloudinary configuration
// cloudinary.config({ 
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.CLOUD_API_KEY, 
//     api_secret: process.env.CLOUD_API_SECRET 
// });

// // Multer storage setup for Cloudinary
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'chat-uploads',
//         allowed_formats: ['jpg', 'png', 'pdf', 'doc', 'docx', 'txt'],
//         resource_type: 'auto'
//     }
// });
// const upload = multer({ storage: storage });

// // File upload route
// app.post('/upload/room/:id', upload.single('file'), async (req, res) => {
//     const roomId = req.params.id;
//     const file = req.file;
//     if (!rooms[roomId]) {
//         return res.status(400).send({ message: 'Room does not exist' });
//     }
    
  
//     try {
//       // Upload file to Cloudinary
//       const result = await cloudinary.uploader.upload(file.path);
     
//     rooms[roomId].files.push({
//         url: result.secure_url,
//         filename: file.originalname,
//     });

  
//       // Emit the file URL to all users in the room
//       io.to(roomId).emit('fileUploaded', {
//         url: result.secure_url,
//         filename: file.originalname
//       });
  
//       res.status(200).send({ message: 'File uploaded successfully' });
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       res.status(500).send({ message: 'File upload failed' });
//     }
//   });

// // Update socket connection to handle file sharing
// io.on('connection', (socket) => {
//     socket.on('join-room', (roomId) => {
//         socket.join(roomId);
//         const userLabel = `User${Math.floor(Math.random() * 1000)}`;
//         users[socket.id] = userLabel;

//         if (!rooms[roomId].creator) {
//             rooms[roomId].creator = socket.id;
//             socket.emit('set-as-creator', true);
//         }

//         // Send existing files to newly joined user
//         if (rooms[roomId].files && rooms[roomId].files.length > 0) {
//             socket.emit('existing-files', rooms[roomId].files);
//         }
//     });
// });

// app.post('/room', (req, res) => {
//     const roomId = req.body.roomId;
//     // Initialize room state when created
//     if (!rooms[roomId]) {
//         rooms[roomId] = {
//             creator: null,
//             isTimerStarted: false,
//             timeLeft: 30,
//             timerInterval: null,
//             files: []
//         };
//     }
//     res.redirect(`/room/${roomId}`);
// });

// app.get('/room/:id', (req, res) => {
//     const roomId = req.params.id;
//     if (roomId) {
//         res.render('room', { roomId });
//     } else {
//         res.status(400).send("Room ID not found.");
//     }
// });

// io.on('connection', (socket) => {
//     socket.on('join-room', (roomId) => {
//         socket.join(roomId);
//         const userLabel = `User${Math.floor(Math.random() * 1000)}`;
//         users[socket.id] = userLabel;

//         // If this is the first user in the room, they're the creator
//         if (!rooms[roomId].creator) {
//             rooms[roomId].creator = socket.id;
//             socket.emit('set-as-creator', true);
//         }

//         // Send current timer state to newly joined user
//         if (rooms[roomId].isTimerStarted) {
//             socket.emit('timer-update', {
//                 timeLeft: rooms[roomId].timeLeft,
//                 isStarted: true
//             });
//         }

//         socket.to(roomId).emit('user-joined', userLabel);
//     });

//     socket.on('send', (data) => {
//         socket.to(data.roomId).emit('receive', {
//             message: data.message,
//             user: users[socket.id],
//             senderId: data.senderId
//         });
//     });

//     socket.on('start-timer', ({ roomId }) => {
//         // Only allow creator to start timer
//         if (rooms[roomId] && socket.id === rooms[roomId].creator && !rooms[roomId].isTimerStarted) {
//             rooms[roomId].isTimerStarted = true;
//             rooms[roomId].timeLeft = 30;

//             // Broadcast timer start to all clients in room
//             io.to(roomId).emit('timer-update', {
//                 timeLeft: rooms[roomId].timeLeft,
//                 isStarted: true
//             });

//             // Start the countdown on server
//             rooms[roomId].timerInterval = setInterval(() => {
//                 rooms[roomId].timeLeft--;

//                 if (rooms[roomId].timeLeft <= 0) {
//                     clearInterval(rooms[roomId].timerInterval);
//                     io.to(roomId).emit('session-ended');
//                     delete rooms[roomId];
//                 } else {
//                     io.to(roomId).emit('timer-update', {
//                         timeLeft: rooms[roomId].timeLeft,
//                         isStarted: true
//                     });
//                 }
//             }, 1000);
//         }
//     });

//     socket.on('disconnect', () => {
//         const userLabel = users[socket.id];
//         socket.broadcast.emit('left', userLabel);
        
//         // Clean up if creator disconnects
//         for (const roomId in rooms) {
//             if (rooms[roomId].creator === socket.id) {
//                 if (rooms[roomId].timerInterval) {
//                     clearInterval(rooms[roomId].timerInterval);
//                 }
//                 io.to(roomId).emit('session-ended');
//                 delete rooms[roomId];
//             }
//         }
        
//         delete users[socket.id];
//     });
// });

// server.listen(8001, () => {
//     console.log('Server running at http://localhost:8001');
// });







require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "*", // Replace '*' with your Render app URL once you have it
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = {}; // Track connected users
const rooms = {}; // Track room states

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const cors = require('cors');

app.use(cors({
  origin: "*", // Ideally, specify your frontend URL instead of '*'
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));


// Cloudinary configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET,
   


});

// Multer storage setup for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chat-uploads',
        allowed_formats: ['jpg', 'png', 'pdf', 'doc', 'docx', 'txt','mp4', 'avi', 'mov'],
        resource_type: 'auto'
    }
});
const upload = multer({ storage: storage });

// Route to render the main page with a form to create a unique room
app.get('/', (req, res) => {
    res.render('index', { socketUrl: process.env.SOCKET_URL });
});

// Room creation route
app.post('/create-room', (req, res) => {
    const roomId = uuidv4(); // Generate a unique ID for each room
    rooms[roomId] = {  // Initialize room datassssss
        creator: null,
        isTimerStarted: false,
        timeLeft: 30,
        timerInterval: null,
        files: []
    };
    res.redirect(`/room/${roomId}`); // Redirect to the unique room page
});
// Example using Express.js
app.post('/room', (req, res) => {
    const { roomId } = req.body;
    if (!roomId) {
        return res.status(400).send('Room ID is required');
    }
    // Logic to join the room using roomId
    res.redirect(`/room/${roomId}`); // Redirect to the room or handle accordingly
});


// Join a room with a unique ID
app.get('/room/:id', (req, res) => {
    const roomId = req.params.id;
    if (rooms[roomId]) {
        res.render('room', { roomId, socketUrl: process.env.SOCKET_URL  });
    } else {
        res.status(404).send("Room does not exist.");
    }
});

// File upload route specific to each room
app.post('/upload/room/:id', upload.single('file'), async (req, res) => {
    const roomId = req.params.id;
    const file = req.file;
    if (!rooms[roomId]) {
        return res.status(400).send({ message: 'Room does not exist' });
    }

    try {
        // Upload file to Cloudinary and add it to room's files array
        const result = await cloudinary.uploader.upload(file.path);
        rooms[roomId].files.push({
            url: result.secure_url,
            filename: file.originalname,
        });

        // Emit the file URL to all users in the room
        io.to(roomId).emit('fileUploaded', {
            url: result.secure_url,
            filename: file.originalname
        });

        res.status(200).send({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send({ message: 'File upload failed' });
    }
});

// Socket.io connection handling
io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        if (rooms[roomId]) {
            socket.join(roomId);
            const userLabel = `User${Math.floor(Math.random() * 1000)}`;
            users[socket.id] ={ label: userLabel,
            roomId:roomId,
            }



            // Assign creator role if this is the first user
            if (!rooms[roomId].creator) {
                rooms[roomId].creator = socket.id;
                socket.emit('set-as-creator', true);
            }
            else{
                socket.emit('set-as-creator', false);

            }

            // Send existing files and timer state to the new user
            socket.emit('existing-files', rooms[roomId].files ||[]);
            if (rooms[roomId].isTimerStarted) {
                socket.emit('timer-update', {
                    timeLeft: rooms[roomId].timeLeft,
                    isStarted: true
                });
            }

            // Notify others in the room
            socket.to(roomId).emit('user-joined', userLabel);
        } else {
            socket.emit('room-not-found');
        }
    });
    socket.on('creator-leaving', (roomId) => {
        if (rooms[roomId] && rooms[roomId].creator === socket.id) {
            handleRoomClosure(socket, roomId);
        }
    });

    socket.on('send', (data) => {
        const sender = users[socket.id];
        if (sender) {
            socket.to(data.roomId).emit('receive', {
                message: data.message,
                user: sender.label, // Use the label from our users object
                senderId: socket.id
        });
    }
    });

    socket.on('start-timer', ({ roomId }) => {
        if (rooms[roomId] && socket.id === rooms[roomId].creator && !rooms[roomId].isTimerStarted) {
            rooms[roomId].isTimerStarted = true;
            rooms[roomId].timeLeft = 30;

            io.to(roomId).emit('timer-update', {
                timeLeft: rooms[roomId].timeLeft,
                isStarted: true
            });

            rooms[roomId].timerInterval = setInterval(() => {
                rooms[roomId].timeLeft--;

                if (rooms[roomId].timeLeft <= 0) {
                    clearInterval(rooms[roomId].timerInterval);
                    io.to(roomId).emit('session-ended');
                    delete rooms[roomId];
                } else {
                    io.to(roomId).emit('timer-update', {
                        timeLeft: rooms[roomId].timeLeft,
                        isStarted: true
                    });
                }
            }, 1000);
        }
    });

    

    // Handle all disconnections
    socket.on('disconnect', () => {
        const userData = users[socket.id];
        if (!userData) return;

        const { label, roomId } = userData;

        // Notify others that user has left
        socket.to(roomId).emit('left', label);

        // If creator disconnects, end the session
        if (rooms[roomId] && rooms[roomId].creator === socket.id) {
            handleRoomClosure(roomId, "Creator has disconnected!");
        }

        // Remove user from users object
        delete users[socket.id];
    });
});

// Helper function to handle room closure
function handleRoomClosure(roomId, reason) {
    const room = rooms[roomId];
    if (room) {
        // Clear timer if it exists
        if (room.timerInterval) {
            clearInterval(room.timerInterval);
        }

        // Notify all users in the room
        io.to(roomId).emit('session-ended', reason);

        // Delete the room
        delete rooms[roomId];
    }
}

// Start the server
server.listen(8001, () => {
    console.log('Server running at http://localhost:8001');
});
