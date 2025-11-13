import { InlineKeyboard, Context } from "grammy";
import { updateTaskTopic } from "../services/taskService";

const topics = [
  { emoji: "💼", name: "Work" },
  { emoji: "📚", name: "Learning" },
  { emoji: "💰", name: "Finance" },
  { emoji: "🏠", name: "Home" },
  { emoji: "💪", name: "Health" },
  { emoji: "🎨", name: "Creative" },
  { emoji: "🤝", name: "Social" },
];

export const topicKeyboard = (() => {
  const kb = new InlineKeyboard();
  topics.forEach((topic, index) => {
    kb.text(
      `${topic.emoji} ${topic.name}`,
      `topic_${topic.name.toLowerCase()}`
    );
    if ((index + 1) % 2 === 0) kb.row();
  });
  return kb;
})();

export async function askForTopic(ctx: Context) {
  await ctx.reply("Please choose a topic for your task:", {
    reply_markup: topicKeyboard,
  });
}

export async function handleTopicSelection(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) {
    await ctx.answerCallbackQuery();
    return ctx.reply("⚠️ No user found.");
  }

  const topicKey =
    typeof ctx.match === "string"
      ? ctx.match.replace("topic_", "")
      : ctx.match && ctx.match[0]
      ? ctx.match[0].replace("topic_", "")
      : "";

  if (!topicKey) {
    await ctx.answerCallbackQuery();
    return ctx.reply("⚠️ No topic selected.");
  }

  const topicLabel =
    topics.find((t) => t.name.toLowerCase() === topicKey)?.name ?? topicKey;

  await updateTaskTopic(userId, topicLabel);

  await ctx.answerCallbackQuery();
  await ctx.editMessageText(`✅ Task topic set to: ${topicLabel}`);
}
