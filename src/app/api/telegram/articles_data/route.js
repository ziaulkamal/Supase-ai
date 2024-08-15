import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase'; // Import client Supabase dari lib

// Handle incoming requests to save article data
export async function POST(req) {
  try {
    const { keyword, category, total } = await req.json();

    // Validate input
    if (keyword && category && Number.isInteger(total)) {
      const { error } = await supabase.from('telegram_articles').insert([
        { keyword, category, total, status: false }
      ]);

      if (error) {
        return NextResponse.json({ status: 'error', message: 'Error saving article.' });
      } else {
        return NextResponse.json({ status: 'ok', message: 'Data Anda sudah diproses dan masuk ke jadwal.' });
      }
    } else {
      return NextResponse.json({ status: 'error', message: 'Format Anda tidak sesuai. Mohon masukkan data dengan format yang benar.' });
    }
  } catch (error) {
    console.error('Error saving article data:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}
