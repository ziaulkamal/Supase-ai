import axios from 'axios';
import { NextResponse } from 'next/server';

// URL untuk endpoint API Next.js yang akan menerima data artikel
const API_URL = `${process.env.BASE_URL}/api/telegram/articles_data`;

export async function POST(request) {
  try {
    const update = await request.json();
    console.log('Received update from Telegram:', update);

    // Ambil data dari pesan Telegram
    const message = update.message;
    if (!message || !message.text) {
      return NextResponse.json({ status: 'error', message: 'No message text found.' });
    }

    // Ambil teks perintah dari pesan
    const text = message.text.toLowerCase().trim();
    const chatId = message.chat.id;

    if (text.startsWith('/panduan')) {
      // Kirim panduan atau informasi
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: chatId,
          text: 'Ini adalah panduan untuk menggunakan bot. Kirim /buatartikel "Keyword"|"Category"|10 untuk menyimpan artikel.'
        }
      );
    } else if (text.startsWith('/buatartikel')) {
      // Menghapus '/buatartikel' dari teks
      const commandText = text.slice('/buatartikel'.length).trim();
      
      // Pisahkan berdasarkan '|'
      const parts = commandText.split('|').map(part => part.trim());
      
      if (parts.length < 3) {
        await axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
          {
            chat_id: chatId,
            text: 'Format perintah tidak benar. Gunakan: /buatartikel "Keyword"|"Category"|Total'
          }
        );
        return NextResponse.json({ status: 'error', message: 'Invalid command format.' });
      }

      // Ekstrak data
      const keyword = parts[0].replace(/^"|"$/g, ''); // Menghapus kutip ganda di sekitar keyword
      const category = parts[1].replace(/^"|"$/g, ''); // Menghapus kutip ganda di sekitar category
      const total = parseInt(parts[2], 10);

      if (isNaN(total)) {
        await axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
          {
            chat_id: chatId,
            text: 'Total harus berupa angka.'
          }
        );
        return NextResponse.json({ status: 'error', message: 'Total must be a number.' });
      }

      // Kirim data ke endpoint API Next.js
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
          chat_id: chatId,
          text: responseMessage
        }
      );
    } else {
      // Balasan jika perintah tidak dikenal
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: chatId,
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
