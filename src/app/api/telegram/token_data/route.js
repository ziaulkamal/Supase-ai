import axios from 'axios';
import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

// URL untuk endpoint API Next.js
const API_URL = `${process.env.BASE_URL}/api/telegram/articles_data`;
const TOKEN_API_URL = `${process.env.BASE_URL}/api/telegram/token_data`;

// Konstanta untuk URL API Telegram
const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

async function sendMessage(chatId, text, replyMarkup = {}) {
  await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
    chat_id: chatId,
    text,
    reply_markup: replyMarkup
  });
}

async function answerCallbackQuery(callbackQueryId, text) {
  await axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
    callback_query_id: callbackQueryId,
    text
  });
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
        // Kirim tombol
        await sendMessage(chatId, 'Pilih salah satu opsi:', {
          inline_keyboard: [
            [{ text: 'Buat Artikel Baru', callback_data: 'create_article' }],
            [{ text: 'Tambah Token', callback_data: 'add_token' }],
            [{ text: 'Data Konten', callback_data: 'data_content' }],
            [{ text: 'ℹ️ Bantuan', callback_data: 'help' }]
          ]
        });
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

      // Acknowledge the callback
      await answerCallbackQuery(callbackQuery.id, 'Opsi dipilih!');
    } else if (message && message.text) {
      const text = message.text.trim();

      if (text.startsWith('"') && text.includes('|')) {
        // Mengolah data artikel
        const parts = text.split('|').map(part => part.trim());

        if (parts.length < 3) {
          await sendMessage(chatId, 'Format perintah tidak benar. Gunakan: "Keyword"|"Category"|Total');
          return NextResponse.json({ status: 'error', message: 'Invalid command format.' });
        }

        const keyword = parts[0].replace(/^"|"$/g, '');
        const category = parts[1].replace(/^"|"$/g, '');
        const total = parseInt(parts[2], 10);

        if (isNaN(total)) {
          await sendMessage(chatId, 'Total harus berupa angka.');
          return NextResponse.json({ status: 'error', message: 'Total must be a number.' });
        }

        const response = await axios.post(API_URL, {
          keyword,
          category,
          total
        });

        const responseMessage = response.data.status === 'ok'
          ? 'Data Anda sudah diproses dan masuk ke jadwal.'
          : response.data.message;

        await sendMessage(chatId, responseMessage);
      } else if (text) {
        // Menangani penambahan token
        const response = await axios.post(TOKEN_API_URL, {
          secretKey: text
        });

        const responseMessage = response.data.status === 'ok'
          ? 'Token berhasil ditambahkan.'
          : response.data.message;

        await sendMessage(chatId, responseMessage);
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing Telegram update:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}
