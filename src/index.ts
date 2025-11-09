import 'dotenv/config';
import { Bot } from 'grammy';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command('start', ctx => ctx.reply('Hello! I am your TaskBot'));
bot.on('message:text', ctx => ctx.reply(`You said: ${ctx.message.text}`));

bot.start();
console.log('Bot is running...');
