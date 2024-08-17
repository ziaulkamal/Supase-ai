// api/autorun/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    // Menghasilkan timestamp mirip dengan time() di PHP
    const timestamp = Math.floor(Date.now() / 1000);

    // Kirimkan request POST ke endpoint /api/google-trends dengan timestamp sebagai parameter
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/google-trends`,
      { geo: 'US', timestamp },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Cek status hasil response
    if (data.status !== 'success') {
      console.error('Error:', data.message);
      return NextResponse.json({ status: 'error', message: data.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', data: data.data });
  } catch (error) {
    console.error('Error triggering Google Trends data fetch:', error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
