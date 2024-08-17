import { NextResponse } from 'next/server';
import googleTrendsClient from '@/app/lib/googleTrendsClient';
import { saveGoogleTrendsData } from '@/app/lib/supabase';

export const fetchCache = 'default-no-store';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const geo = url.searchParams.get('geo') || process.env.LANGUAGE;
    const timestamp = parseInt(url.searchParams.get('timestamp') || '0', 10);

    // Ambil data tren harian
    const trendsData = await googleTrendsClient.fetchDailyTrends(geo);

    if (!trendsData?.default?.trendingSearchesDays) {
      throw new Error('Data format is not as expected');
    }

    // Simpan data tren harian ke Supabase
    await saveGoogleTrendsData(trendsData.default.trendingSearchesDays, geo);

    return NextResponse.json({ status: 'success', message: 'Data fetched and saved successfully', newTimestamp: timestamp });
  } catch (error) {
    console.error('Error fetching and saving Google Trends data:', error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
