import axios from 'axios';
import { NextResponse } from 'next/server';

import { webHookTelegram } from '@/app/lib/supabase';

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
            [{ text: 'Buat Data Baru', callback_data: 'create_article' }],
            [{ text: 'Tambah Token', callback_data: 'add_token' }],
            [{ text: 'Data Konten', callback_data: 'data_content' }],
            [{ text: 'Tambah Master Prompt', callback_data: 'add_prompt' }],
            [{ text: 'ℹ️ Bantuan', callback_data: 'help' }]
          ]
        });
        userStateCache.set(chatId, { state: 'awaiting_option' });
        return NextResponse.json({ status: 'success' });
      }

      // Jika ada sesi aktif
      if (userState) {
        if (userState.state === 'set_artikel') {
          if (text.startsWith('"') && text.includes('|')) {
            const parts = text.split('|').map(part => part.trim());

            if (parts.length !== 4) {
              await sendMessage(chatId, 'Format perintah tidak benar. Gunakan format: "Keyword"|"Category"|Negara(ID/TW/US/DE)|Total');
              return NextResponse.json({ status: 'error', message: 'Invalid command format.' });
            }

            // Proses setiap bagian sesuai aturan
            const keyword = parts[0].replace(/^"|"$/g, ''); // Menghapus tanda kutip di awal dan akhir
            const category = parts[1].replace(/^"|"$/g, ''); // Menghapus tanda kutip di awal dan akhir
            const language = parts[2].replace(/^"|"$/g, ''); // Menghapus tanda kutip di awal dan akhir
            const total = parseInt(parts[3], 10); // Mengonversi total menjadi integer

            if (isNaN(total)) {
              await sendMessage(chatId, 'Total harus berupa angka.');
              return NextResponse.json({ status: 'error', message: 'Total must be a number.' });
            }

            await webHookTelegram({ keyword, category, language, total }, 'insert')
            await sendMessage(chatId, 'Berhasil !, Data akan masuk ke queue untuk di proses');
          } else {
            await sendMessage(chatId, 'Format perintah tidak benar. Gunakan format: "Keyword"|"Category"|Negara(ID/TW/US/DE)|Total');
          }
        } else if (userState.state === 'set_prompt'){
          if (text.includes('|')) {
              const parts = text.split('|').map(part => part.trim());

              if (parts.length !== 8) {
                await sendMessage(chatId, "format master prompt tidak benar.");
                return NextResponse.json({ status: 'error', message: 'Invalid command format.' });
              }

              const typeFormat    = parts[0];
              const sectionTitle  = parts[1];
              const sectionTwo    = parts[2];
              const sectionThree  = parts[3];
              const sectionFour   = parts[4];
              const sectionFive   = parts[5];
              const sectionSix    = parts[6];
              const sectionComment = parts[6];

              await webHookTelegram({ typeFormat, sectionTitle, sectionTwo, sectionThree, sectionFour, sectionFive, sectionSix, sectionComment }, 'insertMasterPrompt')
              await sendMessage(chatId, 'Berhasil !, Master Prompt sudah ditambahkan ke database');
          }
          await webHookTelegram({data}, 'insertMasterPrompt')
          await sendMessage(chatId, 'Berhasil menambahkan master prompt')
        }
        
        
        else if (userState.state === 'set_token') {
          if (text.length < 5) { // Misalnya, token harus lebih dari 5 karakter
            await sendMessage(chatId, 'Token tidak valid. Pastikan token memiliki panjang yang benar.');
            return;
          }

          await webHookTelegram({secretkey:text}, 'insertToken');
          await sendMessage(chatId, 'Berhasil menambahkan Token Baru ');
        }else if(userState.state === 'set_count'){
          const response = await webHookTelegram(null, 'read');
          if (response) {
            console.log(response);
            const { totalArticles, totalCategories } = response;
            await sendMessage(chatId, `Jumlah Artikel: ${totalArticles}\nJumlah Kategori Unik: ${totalCategories}`);
          } else {
            await sendMessage(chatId, 'Terjadi kesalahan saat mengambil data konten.');
          }
        }
      } else {
        await sendMessage(chatId, 'Untuk setiap aksi mulai dengan /run dan untuk mengakhiri sesi user /end');
      }
    } else if (callbackQuery) {
      const data = callbackQuery.data;

      if (data === 'create_article') {
        await sendMessage(chatId, 'Masukkan data artikel dalam format berikut: \n "Keyword"|"Category"|Negara(ID/TW/US/DE)|Total');
        userStateCache.set(chatId, { state: 'set_artikel' });
      } else if (data === 'add_token') {
        await sendMessage(chatId, 'Masukkan secret key token');
        userStateCache.set(chatId, { state: 'set_token' });
      } else if (data === 'add_prompt') {
        await sendMessage(chatId, 'Masukkan data prompt dalam format berikut: \n tipe|isi perintah prompt sesi 1 untuk mengatur title dan slug|isi perintah prompt untuk mengatur section 2|isi perintah prompt untuk mengatur section 3|isi perintah prompt untuk mengatur section 4|isi perintah prompt untuk mengatur section 5|isi perintah prompt untuk mengatur section 6|berikan komentar terkait untuk penggunaan');
        userStateCache.set(chatId, { state: 'set_prompt' });
      } else if (data === 'data_content') {
        try {
          const response = await webHookTelegram(null, 'read');
          if (response) {
            const { totalArticles, totalCategories } = response;
            await sendMessage(chatId, `Jumlah Artikel: ${totalArticles}\nJumlah Kategori Unik: ${totalCategories}`);
          } else {
            await sendMessage(chatId, 'Terjadi kesalahan saat mengambil data konten.');
          }
        } catch (error) {
          console.error('Error fetching content count:', error.message);
          await sendMessage(chatId, 'Terjadi kesalahan saat mengambil data konten.');
        }
      } else if (data === 'help') {
        await sendMessage(chatId, `
Selamat datang di bot kami! Berikut adalah fitur-fitur yang tersedia:

📝 **Buat Artikel Baru**
- Klik tombol ini untuk memulai proses pembuatan artikel baru. Kirimkan data artikel dalam format: "Keyword"|"Category"|Negara(ID/TW/US/DE)|Total.
- Selama sesi belum di akhiri, maka anda bisa menambah data keyword secara terus menerus sampai sesi di akhiri


🔑 **Tambah Token**
- Klik tombol ini untuk menambahkan token baru. Masukkan token Anda saat diminta.
- Pastikan token yang Anda masukkan valid.
- Selama sesi belum di akhiri, maka anda bisa menambah Token secara terus menerus sampai sesi di akhiri


📊 **Data Konten**
- Klik tombol ini untuk mendapatkan informasi jumlah artikel dan kategori.
- Bot akan memberikan jumlah artikel dan kategori yang ada dalam sistem.


📊 **Tambah Master Prompt**
- Klik tombol ini untuk memulai atur master prompt untuk setiap kategori. Kirimkan data dalam Format berikut : tipe|isi perintah prompt sesi 1 untuk mengatur title dan slug|isi perintah prompt untuk mengatur section 2|isi perintah prompt untuk mengatur section 3|isi perintah prompt untuk mengatur section 4|isi perintah prompt untuk mengatur section 5|isi perintah prompt untuk mengatur section 6|berikan komentar terkait untuk penggunaan
- Bot akan memberikan jumlah artikel dan kategori yang ada dalam sistem.


ℹ️ **Bantuan**
- Klik tombol ini untuk melihat panduan ini lagi.
- Panduan ini memberikan informasi tentang cara menggunakan bot dan fitur-fitur yang tersedia.



**Perintah Khusus**

🚀 /run
- Memulai sesi baru dan menampilkan opsi yang tersedia.
- Kirimkan perintah ini untuk melihat opsi-opsi yang dapat Anda pilih.


🔚 /end
- Mengakhiri sesi aktif.
- Kirimkan perintah ini untuk menyelesaikan sesi yang sedang berlangsung dan menghapus status Anda.


_Untuk bantuan lebih lanjut, gunakan tombol bantuan atau kirimkan pesan jika Anda membutuhkan bantuan tambahan_
          `);
      }

      await answerCallbackQuery(callbackQuery.id, 'Opsi dipilih!');
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing Telegram update:', error.response ? error.response.data : error.message);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}


export async function GET() {
    try {
        const url = `${TELEGRAM_API_URL}/setWebhook?url=${process.env.NEXT_PUBLIC_BASE_URL}/telegram-webhook`;

        // Mengembalikan respons data dari axios
        return NextResponse.redirect(url);
    } catch (error) {
        // Menangani error dan mengembalikan status error jika permintaan gagal
        console.error('Error fetching webhook:', error);
        return NextResponse.json({ error: 'Failed to set webhook' }, { status: 500 });
    }
}