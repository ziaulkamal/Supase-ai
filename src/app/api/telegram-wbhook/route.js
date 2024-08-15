import { NextResponse } from 'next/server';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ status: 'ok' });
    }

    const chatId = message.chat.id;
    const userMessage = message.text;

    // Tangani pesan atau perintah yang diterima
    let responseText = '';
    if (userMessage.startsWith('/start')) {
      responseText = 'Selamat datang! Kirimkan pesan atau data Anda.';
    } else if (userMessage.startsWith('/save')) {
      const dataToSave = userMessage.slice(6).trim(); // Ambil data setelah perintah /save
      // Simpan data ke database atau proses sesuai kebutuhan
      responseText = `Data Anda telah disimpan: ${dataToSave}`;
    } else {
      responseText = `Anda mengirimkan: ${userMessage}`;
    }

    await fetch(TELEGRAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: responseText,
      }),
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return NextResponse.json({ status: 'error' });
  }
}
