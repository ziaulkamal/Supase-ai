import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import supabase from '@/lib/supabase';

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

// Helper function to request user input
async function requestUserInput(chatId, text, replyMarkup) {
  await sendMessage(chatId, text, { reply_markup: { force_reply: true } });
}

// Main POST function
export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;
    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id;

    // Retrieve user's state from database or session
    let userState = {}; // Ideally, retrieve this from a database or in-memory store

    if (text.startsWith('/start')) {
      await sendMessage(chatId, 'Selamat datang! Silakan pilih opsi dari menu di bawah:', {
        reply_markup: {
          keyboard: [
            [{ text: '📝 Buat Artikel Baru' }, { text: '🔑 Tambah Token' }],
            [{ text: '📊 Data Konten' }, { text: 'ℹ️ Bantuan' }]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
      userState = { state: 'awaiting_action' }; // Reset state
    } else if (text === '📝 Buat Artikel Baru') {
      userState = { state: 'awaiting_keyword' };
      await requestUserInput(chatId, 'Masukkan keyword:', {});
    } else if (text === '🔑 Tambah Token') {
      userState = { state: 'awaiting_token' };
      await requestUserInput(chatId, 'Masukkan token Gemini:', {});
    } else if (text === '📊 Data Konten') {
      const { data, error } = await supabase.from('articles_ai').select('id');
      if (error) {
        await sendMessage(chatId, 'Terjadi kesalahan saat menghitung postingan.');
      } else {
        const postCount = data.length;
        await sendMessage(chatId, `Jumlah total postingan: ${postCount}`);
      }
      userState = { state: 'awaiting_action' }; // Reset state
    } else if (text === 'ℹ️ Bantuan') {
      await sendMessage(chatId, 'Perintah yang tersedia:\n/start - Tampilkan menu utama\n📝 Buat Artikel Baru - Buat postingan baru\n🔑 Tambah Token - Tambahkan token baru\n📊 Data Konten - Hitung total jumlah postingan\nℹ️ Bantuan - Tampilkan bantuan');
      userState = { state: 'awaiting_action' }; // Reset state
    } else if (userState.state === 'awaiting_keyword') {
      userState = { ...userState, state: 'awaiting_category' };
      userState.keyword = text;
      await requestUserInput(chatId, 'Masukkan kategori:', {});
    } else if (userState.state === 'awaiting_category') {
      userState = { ...userState, state: 'awaiting_total' };
      userState.category = text;
      await requestUserInput(chatId, 'Masukkan total:', {});
    } else if (userState.state === 'awaiting_total') {
      userState = { ...userState, state: 'awaiting_action' };
      userState.total = parseInt(text, 10);
      if (isNaN(userState.total)) {
        await sendMessage(chatId, 'Total harus berupa angka. Silakan masukkan kembali total:', {});
        userState.state = 'awaiting_total';
      } else {
        // Save data to Supabase
        const { error } = await supabase.from('telegram_articles').insert([
          { keyword: userState.keyword, category: userState.category, total: userState.total, status: 'pending', created_at: new Date(), updated_at: new Date() }
        ]);
        if (error) {
          await sendMessage(chatId, 'Gagal menyimpan artikel.');
        } else {
          await sendMessage(chatId, 'Data Anda sudah diproses dan masuk ke jadwal.');
        }
        // Clear user state
        userState = { state: 'awaiting_action' };
      }
    } else if (userState.state === 'awaiting_token') {
      userState = { state: 'awaiting_action' };
      const token = text;
      const response = await fetch(`${process.env.BASE_URL}/api/telegram/token_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: token })
      });
      const result = await response.json();
      await sendMessage(chatId, result.message);
    } else {
      await sendMessage(chatId, 'Perintah tidak dikenal. Ketik "ℹ️ Bantuan" untuk daftar perintah yang tersedia.');
    }

    // Here you should save/update userState in your database or in-memory store

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return NextResponse.json({ status: 'error' });
  }
}
