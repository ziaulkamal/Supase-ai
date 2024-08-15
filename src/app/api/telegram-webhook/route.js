import axios from 'axios';
import { NextResponse } from 'next/server';

// Endpoint Telegram API
const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

// Cache untuk menyimpan state pengguna
const userStateCache = new Map();

// Kirim pesan ke chat
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

// Menjawab callback query
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

// Menangani permintaan POST dari webhook
export async function POST(request) {
  try {
    const update = await request.json();
    console.log('Received update from Telegram:', update);

    const message = update.message;
    const callbackQuery = update.callback_query;

    const chatId = message?.chat.id || callbackQuery?.message?.chat.id;

    // Mendapatkan data dari cache state pengguna
    const userState = userStateCache.get(chatId);

    if (message) {
      const text = message.text.trim().toLowerCase();

      // Cek jika perintah untuk mengakhiri sesi
      if (text === '/end') {
        if (userState) {
          await sendMessage(chatId, `Sesi fitur ${userState.state} telah selesai`);
          userStateCache.delete(chatId);
        } else {
          await sendMessage(chatId, 'Tidak ada sesi aktif yang ditemukan.');
        }
        return NextResponse.json({ status: 'success' });
      }

      // Cek jika perintah untuk memulai sesi baru
      if (text === '/run') {
        await sendMessage(chatId, 'Pilih salah satu opsi:', {
          inline_keyboard: [
            [{ text: 'Buat Artikel Baru', callback_data: 'create_article' }],
            [{ text: 'Tambah Token', callback_data: 'add_token' }],
            [{ text: 'Data Konten', callback_data: 'data_content' }],
            [{ text: 'ℹ️ Bantuan', callback_data: 'help' }]
          ]
        });
        userStateCache.set(chatId, { state: 'awaiting_option' });
        return NextResponse.json({ status: 'success' });
      }

      // Jika ada sesi aktif
      if (userState) {
        if (userState.state === 'awaiting_article') {
          if (text.startsWith('"') && text.includes('|')) {
            const parts = text.split('|').map(part => part.trim());

            if (parts.length !== 3) {
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
            userStateCache.delete(chatId);
          } else {
            await sendMessage(chatId, 'Format perintah tidak benar. Gunakan format: "Keyword"|"Category"|Total');
          }
        } else if (userState.state === 'awaiting_token') {
          if (text.length < 5) { // Misalnya, token harus lebih dari 5 karakter
            await sendMessage(chatId, 'Token tidak valid. Pastikan token memiliki panjang yang benar.');
            return;
          }

          const response = await axios.post(`${process.env.BASE_URL}/api/telegram/token_data`, {
            secretkey: text
          });

          const responseMessage = response.data.status === 'ok'
            ? 'Token berhasil ditambahkan.'
            : response.data.message;

          await sendMessage(chatId, responseMessage);
          userStateCache.delete(chatId);
        }
      } else {
        await sendMessage(chatId, 'Untuk setiap aksi mulai dengan /run dan untuk mengakhiri sesi user /end');
      }
    } else if (callbackQuery) {
      const data = callbackQuery.data;

      if (data === 'create_article') {
        await sendMessage(chatId, 'Masukkan data artikel dalam format berikut: \n "Keyword"|"Category"|Total');
        userStateCache.set(chatId, { state: 'awaiting_article' });
      } else if (data === 'add_token') {
        await sendMessage(chatId, 'Masukkan secret key token');
        userStateCache.set(chatId, { state: 'awaiting_token' });
      } else if (data === 'data_content') {
        try {
          const response = await axios.get(`${process.env.BASE_URL}/api/telegram/content_count`);
          if (response.data.status === 'ok') {
            const { articleCount, categoryCount } = response.data;
            await sendMessage(chatId, `Jumlah Artikel: ${articleCount}\nJumlah Kategori Unik: ${categoryCount}`);
          } else {
            await sendMessage(chatId, 'Terjadi kesalahan saat mengambil data konten.');
          }
        } catch (error) {
          console.error('Error fetching content count:', error.message);
          await sendMessage(chatId, 'Terjadi kesalahan saat mengambil data konten.');
        }
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
