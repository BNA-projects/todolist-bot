import dotenv from "dotenv";
dotenv.config();

import { Bot } from "grammy";
import { registerBotHandlers } from "./src/bot/bot";

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("❌ TELEGRAM_BOT_TOKEN is missing!");
}
if (!process.env.ASSEMBLY_API_KEY) {
  throw new Error("❌ ASSEMBLY_API_KEY is missing!");
}

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
export const ASSEMBLY_API_KEY = process.env.ASSEMBLY_API_KEY!;
export const BASE_URL = "https://api.assemblyai.com/v2";

const bot = new Bot(TELEGRAM_BOT_TOKEN);

registerBotHandlers(bot);

bot.start();
console.log("🤖 Bot with AssemblyAI is running...");
