import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase'; // Import client Supabase dari lib

const ENDPOINT_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Handle incoming requests to save token data
export async function POST(req) {
  try {
    const { secretKey } = await req.json();

    // Validate input
    if (secretKey) {
      const { error } = await supabase.from('geminitoken').insert([
        { secretKey, url_endpoint: ENDPOINT_URL, status: true }
      ]);

      if (error) {
        return NextResponse.json({ status: 'error', message: 'Error saving token.' });
      } else {
        return NextResponse.json({ status: 'ok', message: 'Token berhasil ditambahkan.' });
      }
    } else {
      return NextResponse.json({ status: 'error', message: 'Token tidak ditemukan. Mohon masukkan token yang valid.' });
    }
  } catch (error) {
    console.error('Error saving token data:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}
