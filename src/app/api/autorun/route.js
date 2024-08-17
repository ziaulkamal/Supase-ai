import { NextResponse } from 'next/server';
import axios from 'axios';

export const fetchCache = 'default-no-store';

export async function GET(request) {
  try {
    // Menghasilkan timestamp mirip dengan time() di PHP
    const timestamp = Math.floor(Date.now() / 1000);

    // Buat URL tujuan untuk redirect
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/google-trends`);
    url.searchParams.append('geo', 'ID');
    url.searchParams.append('timestamp', timestamp);

    // Redirect ke endpoint /api/google-trends dengan query string yang sesuai
    const response = NextResponse.redirect(url);

    // Tambahkan header untuk mencegah cache
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error triggering Google Trends data fetch:', error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
