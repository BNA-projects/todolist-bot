import { InlineKeyboard, Context } from "grammy";
import { getTask, clearTask } from "../state/taskState";


const topics = [
  { emoji: "💼 ", name: "Work" },
  { emoji: "📚", name: "Learning" },
  { emoji: "💰", name: "Finance" },
  { emoji: "🏠", name: "Home" },
  { emoji: "❤️", name: "Health" },
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
  const task = userId ? getTask(userId) : undefined;
  const data = ctx.callbackQuery?.data;

  if (!userId || !task || !data) {
    await ctx.answerCallbackQuery();
    await ctx.reply("⚠️ No active task found.");
    return;
  }

  const topic = data.replace("topic_", "");
  const topicLabel =
    topics.find((t) => t.name.toLowerCase() === topic)?.name ?? topic;

  await ctx.answerCallbackQuery();
  await ctx.editMessageText(`✅ Task saved:\n"${task}"\nTopic: ${topicLabel}`);

  clearTask(userId);
}
