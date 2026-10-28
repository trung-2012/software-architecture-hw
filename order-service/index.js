const express = require('express');
const app = express();

const orders = [
    { orderId: 101, item: "Laptop", amount: 1500 },
    { orderId: 102, item: "Mouse", amount: 50 }
];

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.listen(8082, () => console.log('Order Service running on 8082'));