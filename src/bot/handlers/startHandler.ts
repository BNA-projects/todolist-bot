import { Context } from "grammy";

export const startHandler = (ctx: Context) => {
  ctx.reply(
    `Hi there! 👋 What task would you like to add today?
    You can write or say it. I understand everything.`
  );
};
