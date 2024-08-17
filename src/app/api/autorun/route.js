// api/autorun/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    // Menghasilkan timestamp mirip dengan time() di PHP
    const timestamp = Math.floor(Date.now() / 1000);

    // Kirimkan request GET ke endpoint /api/google-trends dengan geo dan timestamp sebagai parameter query string
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/google-trends`, {
      params: {
        geo: 'US',
        timestamp
      },
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Tambahkan header untuk mencegah cache
        'Pragma': 'no-cache', // Untuk kompatibilitas dengan HTTP/1.0
        'Expires': '0' // Mencegah caching pada server lama
      }
    });

    // Cek status hasil response
    if (data.status !== 'success') {
      console.error('Error:', data.message);
      return NextResponse.json({ status: 'error', message: data.message }, { status: 500 });
    }

    // Kembalikan response dengan header Cache-Control yang sama
    const response = NextResponse.json({ status: 'success', data: data.data });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error triggering Google Trends data fetch:', error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
