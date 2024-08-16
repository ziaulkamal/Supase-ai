import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

export async function POST(req) {
  try {
    const { keyword, category, total, lang } = await req.json();

    if (keyword && category && !isNaN(total)) {
      const { error } = await supabase.from('telegram_articles').insert([
        { keyword, category, total, lang, status: false, created_at: new Date(), updated_at: new Date() }
      ]);

      if (error) {
        console.error('Error saving article data:', error);
        return NextResponse.json({ status: 'error', message: 'Error saving article data.' });
      } else {
        return NextResponse.json({ status: 'ok', message: 'Data Anda sudah diproses dan masuk ke jadwal.' });
      }
    } else {
      return NextResponse.json({ status: 'error', message: 'Format data tidak sesuai. Pastikan data Anda memiliki format yang benar.' });
    }
  } catch (error) {
    console.error('Error saving article data:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}
