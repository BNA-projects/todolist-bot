TaskBot — Telegram × Supabase × Next.js

A simple and intuitive task management system where you create tasks through a Telegram bot — using text or voice — and manage them through a clean web interface.

🧩 Project Description

Telegram Task Manager is a lightweight and convenient task manager where
tasks are created through a Telegram bot — either as text messages or voice messages
(thanks to AssemblyAI speech-to-text integration).

All tasks are stored, displayed, edited, and managed on the website,
where you can also create new tasks and delete existing ones.

Users don’t need to open an admin panel or visit the website —
they can simply type or speak a task directly to the Telegram bot.
The system automatically saves all data to PostgreSQL (Supabase),
and the web interface presents tasks clearly and neatly.

Architecture:

![alt text](/public/image.png)


⚙️ Tech Stack

🖥️ Frontend
Next.js / React
Supabase client
Server Components / SPA (depending on implementation)

🗄️ Backend / Database
Supabase
PostgreSQL
REST API
RLS Policies

🤖 Telegram Bot
grammY (Telegram Bot API)
Webhook handling
Supabase SDK integration

🎤 Voice Input
AssemblyAI
Speech-to-text conversion
Voice message transcription
Automatic task creation from audio messages

🔁 How It Works

The user sends a text or voice message to the Telegram bot.
Text messages are saved directly.
Voice messages are sent to AssemblyAI for transcription.
The bot sends the finalized task to Supabase.
The website fetches tasks from Supabase via API.
The user can view, sort, edit, and delete tasks.

🚀 Project Goal

To create an intuitive task management tool that users can interact with
directly from Telegram, without switching apps.
Write or speak your tasks — and the system automatically saves, structures,
and displays everything on the website.


