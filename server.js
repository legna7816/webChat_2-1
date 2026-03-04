const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

let users = {}; // 추가 - 사용자 정보를 저장하기 위한 객체
let messages = {}; // 각 채팅방의 메시지를 저장하기 위한 객체

// 추가 - 회원가입 요청 처리
app.post('/signup', function(req, res) {
    const { id, password, username } = req.body;

    // ID 중복 검사
    if (users[id]) {
        return res.status(400).json({ error: 'User ID already exists.' });
    }

    // username 중복 검사
    if (Object.values(users).some(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists.' });
    }

    // ID 및 username 등록
    users[id] = { password, username };
    res.status(200).json({ success: 'User signed successfully.' });
});

// 추가 - 로그인 요청 처리
app.post('/login', function(req, res) {
    const { id, password } = req.body;

    if (!users[id]) {
        return res.status(400).json({ error: 'User not found. Please re-enter or sign up.' });
    }

    if (users[id].password !== password) {
        return res.status(400).json({ error: 'Incorrect password.' });
    }

    res.status(200).json({ username: users[id].username });
});

// 메시지 전송
app.post('/send', function(req, res) {
    const { username, message, timestamp, room } = req.body;

    if (!messages[room]) {
        messages[room] = []; // 새로운 채팅방에 대한 메시지 배열 생성
    }

    const messageObj = { username, message, timestamp };
    messages[room].push(messageObj);
    res.sendStatus(200);
});

// 메시지 조회
app.get('/messages', function(req, res) {
    const room = req.query.room;
    const roomMessages = messages[room] || [];
    res.json(roomMessages); // 메시지를 그대로 클라이언트에 전달
});

// 추가 - 채팅방 삭제 요청 처리
app.post('/delete-room', function(req, res) {
    const { roomName } = req.body;

    // 채팅방 메시지 삭제
    if (messages[roomName]) {
        delete messages[roomName];
    }

    res.status(200).json({ success: 'Chat room and messages deleted successfully.' });
});

app.listen(5227, function() {
    console.log('Server Running at http://127.0.0.1:5227/login.html');
});
