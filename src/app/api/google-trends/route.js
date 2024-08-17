// api/google-trends/route.js

import { NextResponse } from 'next/server';
import googleTrendsClient from '@/app/lib/googleTrendsClient';
import { saveGoogleTrendsData } from '@/app/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const geo = searchParams.get('geo') || 'US';
    const timestamp = searchParams.get('timestamp'); // Ambil timestamp dari query string jika ada

    console.log('Received geo and timestamp:', geo, timestamp);

    // Ambil data tren harian
    const trendsData = await googleTrendsClient.fetchDailyTrends(geo);

    if (!trendsData?.default?.trendingSearchesDays) {
      throw new Error('Data format is not as expected');
    }

    // Simpan data tren harian ke Supabase
    await saveGoogleTrendsData(trendsData.default.trendingSearchesDays, geo);

    return NextResponse.json({ status: 'success', message: 'Data fetched and saved successfully', timestamp });
  } catch (error) {
    console.error('Error fetching and saving Google Trends data:', error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
