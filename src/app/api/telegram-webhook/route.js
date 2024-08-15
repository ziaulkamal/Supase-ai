import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import supabase from '@/app/lib/supabase';

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
    const userId = message.from.id;

    let userState = getUserState(userId); // Retrieve user state

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
      setUserState(userId, { state: 'awaiting_action' }); // Reset state
    } else if (text === '📝 Buat Artikel Baru') {
      setUserState(userId, { state: 'awaiting_keyword' });
      await sendMessage(chatId, 'Masukkan keyword, kategori, dan total dalam format "keyword, kategori, total"');
    } else if (text === '🔑 Tambah Token') {
      setUserState(userId, { state: 'awaiting_token' });
      await sendMessage(chatId, 'Masukkan token Gemini:');
    } else if (text === '📊 Data Konten') {
      const { data, error } = await supabase.from('articles_ai').select('id');
      if (error) {
        await sendMessage(chatId, 'Terjadi kesalahan saat menghitung postingan.');
      } else {
        const postCount = data.length;
        await sendMessage(chatId, `Jumlah total postingan: ${postCount}`);
      }
      setUserState(userId, { state: 'awaiting_action' }); // Reset state
    } else if (text === 'ℹ️ Bantuan') {
      await sendMessage(chatId, 'Perintah yang tersedia:\n/start - Tampilkan menu utama\n📝 Buat Artikel Baru - Buat postingan baru\n🔑 Tambah Token - Tambahkan token baru\n📊 Data Konten - Hitung total jumlah postingan\nℹ️ Bantuan - Tampilkan bantuan');
      setUserState(userId, { state: 'awaiting_action' }); // Reset state
    } else if (userState?.state === 'awaiting_keyword') {
      const [keyword, category, total] = text.split(',').map(s => s.trim());
      if (keyword && category && !isNaN(total)) {
        setUserState(userId, { state: 'awaiting_action' });
        const { error } = await supabase.from('telegram_articles').insert([
          { keyword, category, total: parseInt(total, 10), status: 'pending', created_at: new Date(), updated_at: new Date() }
        ]);
        if (error) {
          await sendMessage(chatId, 'Gagal menyimpan artikel.');
        } else {
          await sendMessage(chatId, 'Data Anda sudah diproses dan masuk ke jadwal.');
        }
        clearUserState(userId);
      } else {
        await sendMessage(chatId, 'Format tidak sesuai. Pastikan formatnya adalah "keyword, kategori, total".');
      }
    } else if (userState?.state === 'awaiting_token') {
      const token = text;
      const response = await fetch(`${process.env.BASE_URL}/api/telegram/token_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: token })
      });
      const result = await response.json();
      await sendMessage(chatId, result.message);
      clearUserState(userId);
    } else {
      await sendMessage(chatId, 'Perintah tidak dikenal. Ketik "ℹ️ Bantuan" untuk daftar perintah yang tersedia.');
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return NextResponse.json({ status: 'error' });
  }
}
