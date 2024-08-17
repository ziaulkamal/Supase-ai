import { NextResponse } from 'next/server';
import GoogleTrends from 'google-trends-api';

export async function GET() {
  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1); // 1 day ago

    // Fetch daily trends from Google Trends API
    const data = await GoogleTrends.dailyTrends({
      trendDate: startDate,
      geo: 'US'
    });

    // Parse JSON data
    const parsedData = JSON.parse(data);

    // Return the raw data as JSON response
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error fetching Google Trends data:', error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
