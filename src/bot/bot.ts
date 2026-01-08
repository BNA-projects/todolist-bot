import { Bot, InlineKeyboard } from "grammy";
import { startHandler } from "./handlers/startHandler";
import { askForTopic } from "./handlers/topicHandler";
import { askForWeekday, registerWeekdayCallbacks } from "./handlers/weekdayHandler";

import {
  saveTaskToDb,
  updateTaskTopic,
  getLastTask,
  updateTaskText,
} from "./services/taskService";

import { transcribeVoice } from "./utils/transcribe";
import { env } from "../config/env";

export function registerBotHandlers(bot: Bot) {
  bot.command("start", startHandler);

  // ✅ Регистрируем обработчики day_*
  registerWeekdayCallbacks(bot);

  // ✅ CONFIRM: теперь показываем только дни недели
  bot.callbackQuery("correct", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("✅ Confirmed!");
    await askForWeekday(ctx);
  });

  bot.callbackQuery("change", async (ctx) => {
    await ctx.answerCallbackQuery();

    const userId = ctx.from?.id;
    if (!userId) return;

    const lastTask = await getLastTask(userId);
    const text = lastTask?.title ?? "No task found";

    const message =
      `✏️ Okay, please send the corrected version of your task.\n\n` +
      `You can copy this:\n<code>${text}</code>`;

    await ctx.editMessageText(message, { parse_mode: "HTML" });
  });

  bot.callbackQuery("delete", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("🗑 Task deleted.");
  });

  // topic callbacks (остаются как есть)
  bot.callbackQuery(/topic_(.+)/, async (ctx) => {
    const match = ctx.match;
    const topic =
      typeof match === "string" ? match.replace("topic_", "") : match[1];

    const userId = ctx.from?.id;
    if (!userId) return;

    await updateTaskTopic(userId, topic);

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(`✅ Your task has been saved successfully`);
  });

  // ------------------- TEXT MESSAGE -------------------
  bot.on("message:text", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = ctx.message.text.trim();
    if (!text) return;

    const lastTask = await getLastTask(userId);

    // если это ответ на сообщение "send corrected version..."
    if (lastTask && ctx.message.reply_to_message) {
      await updateTaskText(userId, text);

      await ctx.reply(`✅ Updated task:\n"${text}"`);

      // ✅ после изменения текста тоже спрашиваем день недели
      await askForWeekday(ctx);
      return;
    }

    // новый таск
    await saveTaskToDb(userId, text);

    const kb = new InlineKeyboard()
      .text("✅ Correct", "correct")
      .text("✏️ Change", "change")
      .row()
      .text("🗑 Delete", "delete");

    await ctx.reply(`Your task:\n"${text}"\nIs this correct?`, {
      reply_markup: kb,
    });
  });

  // ------------------- VOICE MESSAGE -------------------
  bot.on("message:voice", async (ctx) => {
    try {
      const userId = ctx.from?.id;
      if (!userId) return;

      const voice = ctx.message.voice;
      const file = await ctx.api.getFile(voice.file_id);

      const fileUrl = `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

      await ctx.reply("⏳ Recognizing your voice...");

      const text = await transcribeVoice(fileUrl, ctx.message.message_id);

      if (!text) {
        await ctx.reply("❌ I couldn't recognize the audio.");
        return;
      }

      await saveTaskToDb(userId, text);

      const kb = new InlineKeyboard()
        .text("✅ Correct", "correct")
        .text("✏️ Change", "change")
        .row()
        .text("🗑 Delete", "delete");

      await ctx.reply(`Recognized task:\n"${text}"\nIs this correct?`, {
        reply_markup: kb,
      });
    } catch (err) {
      console.error("Voice error:", err);
      await ctx.reply("⚠️ Error processing voice message.");
    }
  });
}
