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

    // Jika tidak ada artikel, set articleCount ke 0
    const finalArticleCount = articleCount || 0;

    // Menghitung jumlah kategori unik
    const { data: categories, error: categoryError } = await supabase
      .from('articles_ai')
      .select('category');

    if (categoryError) {
      console.error('Error fetching categories:', categoryError);
      return NextResponse.json({ status: 'error', message: 'Error fetching categories.' });
    }

    // Jika tidak ada kategori, set categoryCount ke 0
    const uniqueCategories = new Set(categories.map(item => item.category));
    const finalCategoryCount = uniqueCategories.size || 0;

    // Mengembalikan hasil sebagai JSON
    return NextResponse.json({
      status: 'ok',
      articleCount: finalArticleCount,
      categoryCount: finalCategoryCount
    });
  } catch (error) {
    console.error('Error processing content count request:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error.' });
  }
}
