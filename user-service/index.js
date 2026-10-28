const express = require('express');
const jwt = require('jsonwebtoken');
const Minio = require('minio');
const axios = require('axios');

const app = express();
const SECRET_KEY = "my_secret_key";

const minioClient = new Minio.Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'password123'
});

const users = [{ id: 1, name: "Nguyen Van A" }];

app.get('/login', (req, res) => {
    const token = jwt.sign({ userId: 1 }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

app.get('/validate-token', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        res.status(200).send("OK");
    });
});

app.get('/users', (req, res) => res.json(users));

app.get('/users/avatar-upload-url', async (req, res) => {
    try {
        const url = await minioClient.presignedPutObject('avatars', 'my-avatar.png', 5 * 60);
        res.json({ uploadUrl: url });
    } catch (err) {
        res.status(500).json({ error: "Lỗi sinh Valet Key" });
    }
});

app.get('/dashboard', async (req, res) => {
    try {
        const user = users[0];
        const orderRes = await axios.get('http://order-service:8082/orders');
        res.json({
            userInfo: user,
            recentOrders: orderRes.data
        });
    } catch (err) {
        res.status(500).json({ error: "Lỗi kết nối nội bộ" });
    }
});

app.listen(8081, () => console.log('User Service running on 8081'));