const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// خدمة الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// تخزين الأدمن المتصلين
const connectedAdmins = new Set();

io.on('connection', (socket) => {
    console.log('👤 مستخدم متصل:', socket.id);

    // عندما يتصل أدمن
    socket.on('admin_connected', () => {
        connectedAdmins.add(socket.id);
        console.log('🛡️ أدمن متصل');
    });

    // عندما يدخل مستخدم جديد
    socket.on('new_user_login', (userData) => {
        console.log('🟢 مستخدم جديد:', userData);
        
        // إرسال إشعار لجميع الأدمن
        socket.broadcast.emit('user_joined', {
            id: Date.now(),
            username: userData.username,
            ip: userData.ip || 'غير معروف',
            loginTime: new Date().toLocaleString('ar-EG'),
            userAgent: userData.userAgent
        });
    });

    // عند انفصال مستخدم
    socket.on('disconnect', () => {
        connectedAdmins.delete(socket.id);
        console.log('❌ مستخدم انقطع:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 السيرفر شغال على http://localhost:${PORT}`);
});