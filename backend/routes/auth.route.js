import express from 'express';
import { login , logout } from '../controllers/auth.controller.js';
import Chat from '../models/chat.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.name) {
        res.redirect('/login');
    }
    var chatMap = {};

    await Chat.find({}, function(err, chats) {
        chats.forEach(function(chat) {
            chatMap[chat._id] = chat;
        });
    });
    let name = req.session.name;
    res.render('index', {
        ten: name,
        chats: chatMap 
    });
});

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', login);

router.get('/logout', logout);

export default router;