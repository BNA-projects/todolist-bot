import { InlineKeyboard, Context, Bot } from "grammy";
import { updateTaskWeekday } from "../services/taskService";
import { askForTopic } from "./topicHandler";

export async function askForWeekday(ctx: Context) {
  const kb = new InlineKeyboard()
    .text("Mon", "day_mon")
    .text("Tue", "day_tue")
    .text("Wed", "day_wed")
    .row()
    .text("Thu", "day_thu")
    .text("Fri", "day_fri")
    .row()
    .text("Sat", "day_sat")
    .text("Sun", "day_sun");

  await ctx.reply("Please choose a weekday:", { reply_markup: kb });
}

export function registerWeekdayCallbacks(bot: Bot) {
  bot.callbackQuery(/^day_(.+)/, async (ctx) => {
    const weekday = String(ctx.match?.[1] ?? "").toLowerCase();
    const userId = ctx.from?.id;
    if (!userId) return;

    await updateTaskWeekday(userId, weekday);

    await ctx.answerCallbackQuery();

    if (ctx.callbackQuery?.message) {
      await ctx.editMessageText(`Weekday selected: ${weekday.toUpperCase()}`);
    }

    await askForTopic(ctx);
  });
}
