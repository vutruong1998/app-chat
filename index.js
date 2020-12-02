import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import socket from 'socket.io';
import http from 'http';
import session from 'express-session';
import Chat from './backend/models/chat.model.js';
import authRoutes from './backend/routes/auth.route.js';
import UserHelper from './backend/helpers/user.helper.js';

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Database connected');
  })
  .catch((error)=> {
    console.log('Error connecting to database');
  });

app.use(session({secret: 'randomstringsessionsecret'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const __dirname = process.cwd();
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');

app.use('/', authRoutes);

const help = new UserHelper;

io.on('connection', (socket) => {

    console.log(`user : ${socket.id} connect`);
    socket.on('disconnect', () => {
        help.removeUser(socket.id);

        const listUsers = help.getListUsers();
      
        io.emit('SERVER_SEND_USERS_ONLINE', listUsers)

        console.log(`user : ${socket.id} disconnect`);
    })

    socket.on('USER_CONNECT', async (data) => {
      await help.pushUser(socket.id, data.name);

      const listUsers = help.getListUsers();
      
      io.emit('SERVER_SEND_USERS_ONLINE', listUsers)
    })

    socket.on('CLIENT_WAS_TYPING', async (data) => {
      await help.pushUser(socket.id, data.name);

      const usersTyping = help.getListUsers();

      for (var idx in usersTyping) {
        socket.broadcast.emit('SERVER_RETURN_USER_TYPING', {
          'typing' : `${usersTyping[idx].name} was typing...`,
          'showTyping' : data.showTyping
        })
      }
    });

    socket.on('CLIENT_SEND_MESSAGE', async (data) => {
      const chat = new Chat({
          name: data.name,
          avatar: 'cc',
          message: data.message,
      });

      await chat.save();

      socket.broadcast.emit('SERVER_RETURN_MESSAGE', {
        'name' : data.name,
        'message' : data.message 
      });
    })
});

server.listen(port, () => {
    console.log(`server listen port ${port}`);
})