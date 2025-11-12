import { Bot } from "grammy";
import { startHandler } from "./handlers/startHandler";
import { messageHandler } from "./handlers/messageHandler";
import { getTask, clearTask, saveTask } from "./state/taskState";
import { askForTopic, handleTopicSelection } from "./handlers/topicHandler";

export function registerBotHandlers(bot: Bot) {
  bot.command("start", startHandler);
  bot.on("message", messageHandler);


  bot.callbackQuery("correct", async (ctx) => {
    const userId = ctx.from?.id;
    const task = userId ? getTask(userId) : undefined;

    await ctx.answerCallbackQuery();

    if (task) {
      await ctx.editMessageText(`✅ Confirmed:\n${task}`);
      await askForTopic(ctx); 
    } else {
      await ctx.editMessageText("⚠️ No task found to save.");
    }
  });


  bot.callbackQuery("change", async (ctx) => {
    const userId = ctx.from?.id;
    const task = userId ? getTask(userId) : undefined;

    await ctx.answerCallbackQuery();

    if (task) {
      await ctx.editMessageText(
        `✏️ Okay, send the corrected version of your task.\n\nYou can copy this:\n<code>${task}</code>`,
        { parse_mode: "HTML" }
      );
    } else {
      await ctx.editMessageText("✏️ Okay, send the corrected version.");
    }
  });

  bot.callbackQuery("delete", async (ctx) => {
    const userId = ctx.from?.id;
    const task = userId ? getTask(userId) : undefined;

    await ctx.answerCallbackQuery();

    if (task) {
      clearTask(userId!);
      await ctx.editMessageText(`🗑 Task deleted:\n${task}`);
    } else {
      await ctx.editMessageText("🗑 Task deleted.");
    }
  });

  bot.callbackQuery(/topic_/, handleTopicSelection);

  bot.on("message:text", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    saveTask(userId, ctx.message.text);
    await ctx.reply(`✅ Got it:\n"${ctx.message.text}"`);
    await askForTopic(ctx);
  });
}
