// api/google-trends/route.js

import { NextResponse } from 'next/server';
import googleTrendsClient from '@/app/lib/googleTrendsClient';
import { saveGoogleTrendsData } from '@/app/lib/supabase';

export async function POST(request) {
  try {
    const { geo, timestamp } = await request.json(); // Ambil geo dan timestamp dari body request

    // Ambil data tren harian
    const trendsData = await googleTrendsClient.fetchDailyTrends(geo || 'US');

    if (!trendsData?.default?.trendingSearchesDays) {
      throw new Error('Data format is not as expected');
    }

    // Simpan data tren harian ke Supabase
    await saveGoogleTrendsData(trendsData.default.trendingSearchesDays, geo || 'US');

    return NextResponse.json({ status: 'success', message: 'Data fetched and saved successfully' });
  } catch (error) {
    console.error('Error fetching and saving Google Trends data:', error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
