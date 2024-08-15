import axios from 'axios';
import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

async function sendMessage(chatId, text, replyMarkup = {}) {
  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      reply_markup: replyMarkup
    });
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
}

async function answerCallbackQuery(callbackQueryId, text) {
  try {
    await axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text
    });
  } catch (error) {
    console.error('Error answering callback query:', error.response ? error.response.data : error.message);
  }
}

export async function POST(request) {
  try {
    const update = await request.json();
    console.log('Received update from Telegram:', update);

    const message = update.message;
    const callbackQuery = update.callback_query;

    const chatId = message?.chat.id || callbackQuery?.message?.chat.id;

    if (message) {
      const text = message.text.toLowerCase().trim();

      if (text === '/start') {
        await sendMessage(chatId, 'Pilih salah satu opsi:', {
          inline_keyboard: [
            [{ text: 'Buat Artikel Baru', callback_data: 'create_article' }],
            [{ text: 'Tambah Token', callback_data: 'add_token' }],
            [{ text: 'Data Konten', callback_data: 'data_content' }],
            [{ text: 'ℹ️ Bantuan', callback_data: 'help' }]
          ]
        });
      } else if (text.startsWith('"') && text.includes('|')) {
        const parts = text.split('|').map(part => part.trim());

        if (parts.length < 3) {
          await sendMessage(chatId, 'Format perintah tidak benar. Gunakan format: "Keyword"|"Category"|Total');
          return NextResponse.json({ status: 'error', message: 'Invalid command format.' });
        }

        const keyword = parts[0].replace(/^"|"$/g, '');
        const category = parts[1].replace(/^"|"$/g, '');
        const total = parseInt(parts[2], 10);

        if (isNaN(total)) {
          await sendMessage(chatId, 'Total harus berupa angka.');
          return NextResponse.json({ status: 'error', message: 'Total must be a number.' });
        }

        const response = await axios.post(`${process.env.BASE_URL}/api/telegram/articles_data`, {
          keyword,
          category,
          total
        });

        const responseMessage = response.data.status === 'ok'
          ? 'Data Anda sudah diproses dan masuk ke jadwal.'
          : response.data.message;

        await sendMessage(chatId, responseMessage);
      } else if (text) {
        const response = await axios.post(`${process.env.BASE_URL}/api/telegram/token_data`, {
          secretKey: text
        });

        const responseMessage = response.data.status === 'ok'
          ? 'Token berhasil ditambahkan.'
          : response.data.message;

        await sendMessage(chatId, responseMessage);
      }
    } else if (callbackQuery) {
      const data = callbackQuery.data;
      const messageId = callbackQuery.message.message_id;

      if (data === 'create_article') {
        await sendMessage(chatId, 'Masukkan data artikel dalam format "Keyword"|"Category"|Total');
      } else if (data === 'add_token') {
        await sendMessage(chatId, 'Masukkan secret key token');
      } else if (data === 'data_content') {
        await sendMessage(chatId, 'Menampilkan data konten...');
      } else if (data === 'help') {
        await sendMessage(chatId, 'Ini adalah panduan bantuan. Gunakan tombol untuk mengakses berbagai fitur.');
      }

      await answerCallbackQuery(callbackQuery.id, 'Opsi dipilih!');
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing Telegram update:', error.response ? error.response.data : error.message);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}
