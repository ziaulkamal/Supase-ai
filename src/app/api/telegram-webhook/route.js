import { NextResponse } from 'next/server';
import fetch from 'node-fetch'; // Pastikan fetch tersedia atau gunakan library seperti 'node-fetch'
import supabase from '@/app/lib/supabase'; // Import client Supabase dari lib

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

// Handle incoming updates from Telegram
export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;
    const chatId = message.chat.id;
    const text = message.text;

    if (text.startsWith('/start')) {
      // Show main menu with icons
      await sendMessage(chatId, 'Welcome! Please choose an option from the menu below:', {
        keyboard: [
          [{ text: '📝 Buat Artikel Baru' }, { text: '🔑 Tambah Token' }],
          [{ text: '📊 Data Konten' }, { text: 'ℹ️ Bantuan' }]
        ],
        resize_keyboard: false,
        one_time_keyboard: true
      });
    } else if (text === '📝 Buat Artikel Baru') {
      await sendMessage(chatId, 'Please enter the keyword, category, and total number of posts in the following format: "keyword, category, total"', {
        reply_markup: {
          force_reply: true
        }
      });
    } else if (text === '🔑 Tambah Token') {
      await sendMessage(chatId, 'Please provide the new token in the format: "token your-token-value"', {
        reply_markup: {
          force_reply: true
        }
      });
    } else if (text === '📊 Data Konten') {
      const { data, error } = await supabase.from('articles_ai').select('id');
      if (error) {
        await sendMessage(chatId, 'Error counting posts.');
      } else {
        const postCount = data.length;
        await sendMessage(chatId, `Total number of posts: ${postCount}`);
      }
    } else if (text === 'ℹ️ Bantuan') {
      await sendMessage(chatId, 'Available commands:\n/start - Show the main menu\n📝 Buat Artikel Baru - Create a new post\n🔑 Tambah Token - Add a new token\n📊 Data Konten - Count total number of posts');
    } else if (message.reply_to_message && message.reply_to_message.text.startsWith('Please enter the keyword')) {
      // Handle the input for creating a new post
      const [keyword, category, total] = text.split(',').map(s => s.trim());
      const isValid = keyword && category && !isNaN(total);

      if (isValid) {
        // Send the data to the articles_data API endpoint
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
    } else if (message.reply_to_message && message.reply_to_message.text.startsWith('Please provide the new token')) {
      // Handle the input for adding a new token
      const [, token] = text.split(' ');
      if (token) {
        // Send the token data to the token_data API endpoint
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
    } else {
      await sendMessage(chatId, 'Unknown command. Type "ℹ️ Bantuan" for a list of available commands.');
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return NextResponse.json({ status: 'error' });
  }
}
