import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

export async function POST(req) {
  try {
    const { secretKey } = await req.json();
    const url_endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    if (secretKey) {
      const { error } = await supabase.from('geminitoken').insert([
        { secretKey, url_endpoint, status: true }
      ]);

      if (error) {
        console.error('Error saving token data:', error);
        return NextResponse.json({ status: 'error', message: 'Error saving token data.' });
      } else {
        return NextResponse.json({ status: 'ok', message: 'Token berhasil ditambahkan.' });
      }
    } else {
      return NextResponse.json({ status: 'error', message: 'Token tidak valid. Mohon masukkan token yang benar.' });
    }
  } catch (error) {
    console.error('Error saving token data:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}
