const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const Poll = require('./models/Poll');
const Student = require('./models/Student');
const {
  createPoll,
  submitAnswer,
  endPoll,
} = require('./controllers/pollController');

const {
  registerStudent,
  updateStudentSocket,
  kickStudent,
  getActiveStudents
} = require('./controllers/studentController');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api', require('./routes/api'));

// Active poll in memory for real-time performance
let activePoll = null;

io.on('connection', socket => {
  console.log(`New connection: ${socket.id}`);

  // Student registration
  socket.on('registerStudent', async (name, callback) => {
    try {
      const student = await registerStudent(name, socket.id);
      callback({ token: student.token });
      io.emit('studentConnected', student);
    } catch (err) {
      console.error('Student registration error:', err);
    }
  });

  // Student reconnection
  socket.on('reconnectStudent', async (token, callback) => {
    try {
      const student = await updateStudentSocket(token, socket.id);
      if (student) {
        callback({ success: true, name: student.name });
        io.emit('studentReconnected', student);
      } else {
        callback({ success: false });
      }
    } catch (err) {
      console.error('Student reconnect error:', err);
    }
  });

  // Teacher creates poll
  socket.on('createPoll', async pollData => {
    if (!activePoll) {
      try {
        const newPoll = await createPoll(pollData);
        activePoll = newPoll;

        // Set timeout to end poll
        setTimeout(async () => {
          if (activePoll && activePoll._id.equals(newPoll._id)) {
            await endPoll(activePoll._id);
            io.emit('pollEnded', activePoll);
            activePoll = null;
          }
        }, pollData.duration * 1000);

        io.emit('newPoll', activePoll);
      } catch (err) {
        console.error('Create poll error:', err);
      }
    }
  });

  // Student submits answer
  socket.on('submitAnswer', async ({ token, name, answer }) => {
    if (activePoll) {
      try {
        const updatedPoll = await submitAnswer(
          activePoll._id,
          token,
          name,
          answer
        );
        if (updatedPoll) {
          activePoll = updatedPoll;
          io.emit('updateResults', activePoll);
        }
      } catch (err) {
        console.error('Submit answer error:', err);
      }
    }
  });

  // End poll manually
  socket.on('endPoll', async () => {
    if (activePoll) {
      try {
        await endPoll(activePoll._id);
        io.emit('pollEnded', activePoll);
        activePoll = null;
      } catch (err) {
        console.error('End poll error:', err);
      }
    }
  });

  // Kick student
  socket.on('kickStudent', async token => {
    try {
      // Find student and get socketId before deleting
      const student = await Student.findOne({ token });

      if (student) {
        // Delete the student
        await Student.deleteOne({ token });

        // Emit to specific student that they've been kicked
        io.to(student.socketId).emit('kicked');

        // Notify all clients to update student list
        io.emit('studentKicked', token);
      }
    } catch (err) {
      console.error('Kick student error:', err);
    }
  });

  // Request active students
  socket.on('requestActiveStudents', async () => {
    try {
      const students = await getActiveStudents();
      socket.emit('activeStudents', students);
    } catch (err) {
      console.error('Error getting active students:', err);
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
