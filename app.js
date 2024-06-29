const express = require('express');
const path = require('path');
const { Telegraf } = require('telegraf');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);
const points = {};

app.use(express.json());
app.use(express.static('public'));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to claim points
app.post('/claim', (req, res) => {
    const userId = req.body.userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    if (!points[userId]) {
        points[userId] = 0;
    }

    points[userId] += 10; // Increment points by 10
    res.json({ message: `You have claimed 10 points. Total: ${points[userId]} points.` });
});

// Telegram bot commands
bot.start((ctx) => {
    const userId = ctx.from.id;
    if (!points[userId]) {
        points[userId] = 0;
    }
    ctx.reply(`Welcome! You can claim points by clicking the button on the web app.`);
});

bot.command('claim', (ctx) => {
    const userId = ctx.from.id;
    points[userId] = (points[userId] || 0) + 10;
    ctx.reply(`You have claimed 10 points! Total: ${points[userId]} points.`);
});

bot.launch();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
