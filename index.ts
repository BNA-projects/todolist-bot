import { env } from "./src/config/env";

import { Bot } from "grammy";
import { registerBotHandlers } from "./src/bot/bot";

const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

registerBotHandlers(bot);

bot.start();
console.log("🤖 Bot with AssemblyAI & Supabase is running...");
