const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const supabase = require('./lib/supabase'); // Pastikan path-nya benar

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const ARTICLES_DATA_API = `${process.env.BASE_URL}/api/telegram/articles_data`;
const TOKEN_DATA_API = `${process.env.BASE_URL}/api/telegram/token_data`;

const bot = new Telegraf(TELEGRAM_TOKEN);

bot.start((ctx) => {
  ctx.reply('Selamat datang! Silakan pilih opsi dari menu di bawah:', {
    reply_markup: {
      keyboard: [
        [{ text: '📝 Buat Artikel Baru' }, { text: '🔑 Tambah Token' }],
        [{ text: '📊 Data Konten' }, { text: 'ℹ️ Bantuan' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

bot.hears('📝 Buat Artikel Baru', (ctx) => {
  ctx.reply('Cara penggunaan: /articles "keyword,category,total". Contoh: /articles "teknologi, gadget, 10"', {
    reply_markup: {
      force_reply: true
    }
  });
});

bot.hears('🔑 Tambah Token', (ctx) => {
  ctx.reply('Cara penggunaan: /token "masukkan token gemini". Contoh: /token "your-token-value"', {
    reply_markup: {
      force_reply: true
    }
  });
});

bot.hears('📊 Data Konten', async (ctx) => {
  const { data, error } = await supabase.from('articles_ai').select('id');
  if (error) {
    ctx.reply('Terjadi kesalahan saat menghitung postingan.');
  } else {
    const postCount = data.length;
    ctx.reply(`Jumlah total postingan: ${postCount}`);
  }
});

bot.hears('ℹ️ Bantuan', (ctx) => {
  ctx.reply('Perintah yang tersedia:\n/start - Tampilkan menu utama\n📝 Buat Artikel Baru - Buat postingan baru\n🔑 Tambah Token - Tambahkan token baru\n📊 Data Konten - Hitung total jumlah postingan\nℹ️ Bantuan - Tampilkan bantuan');
});

bot.command('articles', async (ctx) => {
  const text = ctx.message.text.replace('/articles ', '');
  const [keyword, category, total] = text.split(',').map(s => s.trim());
  const isValid = keyword && category && !isNaN(total);

  if (isValid) {
    const response = await fetch(ARTICLES_DATA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, category, total: parseInt(total) })
    });
    const result = await response.json();
    ctx.reply(result.message);
  } else {
    ctx.reply('Format Anda tidak sesuai. Mohon masukkan data dengan format: "keyword, category, total".');
  }
});

bot.command('token', async (ctx) => {
  const token = ctx.message.text.replace('/token ', '');
  if (token) {
    const response = await fetch(TOKEN_DATA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretKey: token })
    });
    const result = await response.json();
    ctx.reply(result.message);
  } else {
    ctx.reply('Token tidak valid. Mohon masukkan token yang benar.');
  }
});

bot.launch().then(() => {
  console.log('Bot is running...');
});
