import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

export async function GET() {
  try {
    // Menghitung jumlah artikel
    const { count: articleCount, error: countError } = await supabase
      .from('articles_ai')
      .select('*', { count: 'exact' });

    if (countError) {
      console.error('Error counting articles:', countError);
      return NextResponse.json({ status: 'error', message: 'Error counting articles.' });
    }

    // Menghitung jumlah kategori unik
    const { data: categories, error: categoryError } = await supabase
      .from('articles_ai')
      .select('category', { count: 'exact', head: true });

    if (categoryError) {
      console.error('Error counting categories:', categoryError);
      return NextResponse.json({ status: 'error', message: 'Error counting categories.' });
    }

    const uniqueCategories = new Set(categories.map(item => item.category));
    const categoryCount = uniqueCategories.size;

    // Mengembalikan hasil sebagai JSON
    return NextResponse.json({
      status: 'ok',
      articleCount,
      categoryCount
    });
  } catch (error) {
    console.error('Error processing content count request:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}
