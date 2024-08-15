import axios from 'axios';
import { NextResponse } from 'next/server';

// URL untuk endpoint API Next.js yang akan menerima data artikel
const API_URL = `${process.env.BASE_URL}/api/telegram/articles_data`;

// ID chat untuk balasan (Opsional, jika diperlukan)
const CHAT_ID = process.env.USER_ID;

export async function POST(request) {
  try {
    const update = await request.json();

    // Log pesan yang diterima dari Telegram
    console.log('Received update from Telegram:', update);

    // Ambil data dari pesan Telegram
    const message = update.message;
    if (!message || !message.text) {
      return NextResponse.json({ status: 'error', message: 'No message text found.' });
    }

    // Ambil teks perintah dari pesan
    const text = message.text.toLowerCase().trim();

    if (text === '/panduan') {
      // Kirim panduan atau informasi
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: message.chat.id,
          text: 'Ini adalah panduan untuk menggunakan bot. Kirim /buatartikel untuk menyimpan artikel.'
        }
      );
    } else if (text.startsWith('/buatartikel')) {
      // Kirim data ke endpoint API Next.js
      const textParts = text.split(' ').slice(1); // Mengambil data setelah '/buatartikel'
      const keyword = textParts[0] || 'default_keyword'; 
      const category = textParts[1] || 'default_category'; 
      const total = textParts[2] ? parseInt(textParts[2], 10) : 1; 

      const response = await axios.post(API_URL, {
        keyword,
        category,
        total
      });

      const responseMessage = response.data.status === 'ok'
        ? 'Data Anda sudah diproses dan masuk ke jadwal.'
        : response.data.message;

      // Kirim balasan ke pengguna Telegram
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: message.chat.id,
          text: responseMessage
        }
      );
    } else {
      // Balasan jika perintah tidak dikenal
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: message.chat.id,
          text: 'Perintah tidak dikenali. Kirim /panduan untuk informasi atau /buatartikel untuk menyimpan artikel.'
        }
      );
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing Telegram update:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}
