import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

export async function POST(request) {
  try {
    // Data uji
    const testData = {
      keyword: 'Test Keyword',
      category: 'Test Category',
      total: 123,
      status: false,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Sisipkan data ke Supabase
    const { data, error } = await supabase.from('telegram_articles').insert([testData]);

    if (error) {
      console.error('Error inserting test data:', error);
      return NextResponse.json({ status: 'error', message: 'Error inserting test data.' });
    }

    return NextResponse.json({ status: 'ok', message: 'Test data inserted successfully.', data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}
