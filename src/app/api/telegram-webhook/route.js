import { NextResponse } from 'next/server';
import fetch from 'node-fetch'; // Pastikan fetch tersedia atau gunakan library seperti 'node-fetch'
import supabase from '@/app/lib/supabase'; // Import client Supabase dari lib

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

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
      // Show main menu
      await sendMessage(chatId, 'Welcome! Please choose an option from the menu below:', {
        keyboard: [
          [{ text: 'Create Post' }],
          [{ text: 'Add New Token' }],
          [{ text: 'Count Posts' }],
          [{ text: 'Help' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      });
    } else if (text === 'Create Post') {
      await sendMessage(chatId, 'Please provide the keyword and category in the following format: "keyword, category"');
    } else if (text === 'Add New Token') {
      await sendMessage(chatId, 'Please provide the new token in the format: "token your-token-value"');
    } else if (text === 'Count Posts') {
      const { data, error } = await supabase.from('articles_ai').select('id');
      if (error) {
        await sendMessage(chatId, 'Error counting posts.');
      } else {
        const postCount = data.length;
        await sendMessage(chatId, `Total number of posts: ${postCount}`);
      }
    } else if (text === 'Help') {
      await sendMessage(chatId, 'Available commands:\n/start - Show the main menu\nCreate Post - Create a new post\nAdd New Token - Add a new token\nCount Posts - Count total number of posts');
    } else if (text.startsWith('token ')) {
      // Add new token
      const [, token] = text.split(' ');
      if (token) {
        // Save token to a Supabase table or another storage mechanism
        // Here you should implement the logic to save the token
        await sendMessage(chatId, `New token received: ${token}`);
      } else {
        await sendMessage(chatId, 'Please provide the token.');
      }
    } else if (text.includes(',')) {
      // Create post with keyword and category
      const [keyword, category] = text.split(',').map(s => s.trim());
      if (keyword && category) {
        const { error } = await supabase.from('articles_ai').insert([
          { keyword, category, title: 'New Post', slug: 'new-post', articles: '', timestamp: new Date() }
        ]);
        if (error) {
          await sendMessage(chatId, 'Error creating post.');
        } else {
          await sendMessage(chatId, 'Post created successfully.');
        }
      } else {
        await sendMessage(chatId, 'Please provide both keyword and category.');
      }
    } else {
      await sendMessage(chatId, 'Unknown command. Type "Help" for a list of available commands.');
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return NextResponse.json({ status: 'error' });
  }
}
