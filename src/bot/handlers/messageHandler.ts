import { Context, InlineKeyboard } from "grammy";
import { TELEGRAM_BOT_TOKEN } from "../../../index";
import { transcribeVoice } from "../utils/transcribe";
import { saveTask } from "../state/taskState";

export const messageHandler = async (ctx: Context) => {
  const msg = ctx.message;
  if (!msg) return;

  try {
    const keyboard = new InlineKeyboard()
      .text("✅ Correct", "correct")
      .text("✏️ Change", "change")
      .text("🗑 Delete", "delete");

    if (msg.text) {
      saveTask(ctx.from!.id, msg.text);
      await ctx.reply(`Your task: "${msg.text}"`, {
        reply_markup: keyboard,
      });
    } else if (msg.voice) {
      const fileId = msg.voice.file_id;
      const file = await ctx.api.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file.file_path}`;

      await ctx.reply("⏳ I recognize speech, wait a bit...");

      const text = await transcribeVoice(fileUrl, msg.message_id);

      if (text) {
        saveTask(ctx.from!.id, text);
        await ctx.reply(`Your task:\n${text}\nCorrect?`, {
          reply_markup: keyboard,
        });
      } else {
        await ctx.reply("❌ The voice message could not be recognized. Repeat again.");
      }
    } else {
      await ctx.reply("So far, I only understand text and voice messages 🙂");
    }
  } catch (error) {
    console.error("Message processing error:", error);
    await ctx.reply("⚠️ An error occurred while processing the message.");
  }
};
