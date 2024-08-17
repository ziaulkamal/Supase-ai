// api/autorun/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Menghasilkan timestamp mirip dengan time() di PHP
    const timestamp = Math.floor(Date.now() / 1000);

    // Kirimkan request POST ke endpoint /api/google-trends dengan timestamp sebagai parameter
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/google-trends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ geo: 'US', timestamp }) // Kirim parameter geo dan timestamp
    });

    const result = await response.json();

    if (result.status !== 'success') {
      console.error('Error:', result.message);
      return NextResponse.json({ status: 'error', message: result.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', data: result.data });
  } catch (error) {
    console.error('Error triggering Google Trends data fetch:', error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
