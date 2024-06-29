const express = require('express');
const { Telegraf } = require('telegraf');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = 'https://furc-telegram-bot-wxjk.vercel.app'; // Replace with your Vercel URL
const bot = new Telegraf(BOT_TOKEN);
const points = {};

app.use(express.json());
app.use(express.static('public'));

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
    ctx.reply(`Welcome! Click the link to claim your points:\n${WEB_APP_URL}`);
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
