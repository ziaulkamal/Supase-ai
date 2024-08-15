import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import supabase from '@/app/lib/supabase';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
const ARTICLES_DATA_API = `${process.env.BASE_URL}/api/telegram/articles_data`;
const TOKEN_DATA_API = `${process.env.BASE_URL}/api/telegram/token_data`;

// Helper function to send messages to Telegram
async function sendMessage(chatId, text, replyMarkup = {}) {
  await fetch(TELEGRAM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      reply_markup: JSON.stringify(replyMarkup),
    }),
  });
}

// Function to handle /start command
async function handleStart(chatId) {
  await sendMessage(chatId, 'Welcome! Please choose an option from the menu below:', {
    keyboard: [
      [{ text: '📝 Buat Artikel Baru' }, { text: '🔑 Tambah Token' }],
      [{ text: '📊 Data Konten' }, { text: 'ℹ️ Bantuan' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  });
}

// Function to handle Create Post
async function handleCreatePost(chatId) {
  await sendMessage(chatId, 'Please enter the keyword, category, and total number of posts in the following format: "keyword, category, total"', {
    reply_markup: {
      force_reply: true
    }
  });
}

// Function to handle Add New Token
async function handleAddToken(chatId) {
  await sendMessage(chatId, 'Please provide the new token in the format: "token your-token-value"', {
    reply_markup: {
      force_reply: true
    }
  });
}

// Function to handle Count Posts
async function handleCountPosts(chatId) {
  const { data, error } = await supabase.from('articles_ai').select('id');
  if (error) {
    await sendMessage(chatId, 'Error counting posts.');
  } else {
    const postCount = data.length;
    await sendMessage(chatId, `Total number of posts: ${postCount}`);
  }
}

// Function to handle Help command
async function handleHelp(chatId) {
  await sendMessage(chatId, 'Available commands:\n/start - Show the main menu\n📝 Buat Artikel Baru - Create a new post\n🔑 Tambah Token - Add a new token\n📊 Data Konten - Count total number of posts');
}

// Function to handle Create Post Data
async function handlePostData(chatId, text) {
  const [keyword, category, total] = text.split(',').map(s => s.trim());
  const isValid = keyword && category && !isNaN(total);

  if (isValid) {
    const response = await fetch(ARTICLES_DATA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, category, total: parseInt(total) })
    });
    const result = await response.json();

    await sendMessage(chatId, result.message);
  } else {
    await sendMessage(chatId, 'Format Anda tidak sesuai. Mohon masukkan data dengan format: "keyword, category, total".');
  }
}

// Function to handle Add New Token Data
async function handleTokenData(chatId, text) {
  const [, token] = text.split(' ');
  if (token) {
    const response = await fetch(TOKEN_DATA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretKey: token })
    });
    const result = await response.json();

    await sendMessage(chatId, result.message);
  } else {
    await sendMessage(chatId, 'Please provide the token.');
  }
}

// Main POST function
export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;
    const chatId = message.chat.id;
    const text = message.text;

    if (text.startsWith('/start')) {
      await handleStart(chatId);
    } else if (text === '📝 Buat Artikel Baru') {
      await handleCreatePost(chatId);
    } else if (text === '🔑 Tambah Token') {
      await handleAddToken(chatId);
    } else if (text === '📊 Data Konten') {
      await handleCountPosts(chatId);
    } else if (text === 'ℹ️ Bantuan') {
      await handleHelp(chatId);
    } else if (message.reply_to_message && message.reply_to_message.text.startsWith('Please enter the keyword')) {
      await handlePostData(chatId, text);
    } else if (message.reply_to_message && message.reply_to_message.text.startsWith('Please provide the new token')) {
      await handleTokenData(chatId, text);
    } else {
      await sendMessage(chatId, 'Unknown command. Type "ℹ️ Bantuan" for a list of available commands.');
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return NextResponse.json({ status: 'error' });
  }
}
