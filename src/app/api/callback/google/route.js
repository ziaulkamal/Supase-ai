// src/app/api/callback/google/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import supabase from '@/app/lib/supabase';

export async function GET(request) {
  const url = new URL(request.url);
  const geo = url.searchParams.get('geo') || 'US'; // Default to 'US' if not provided
  
  // Generate timestamp automatically (in seconds)
  const timestamp = Math.floor(Date.now() / 1000);

  try {
    // Build the target URL with query parameters
    const targetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/engine/googleTrends?geo=${geo}&timestamp=${timestamp}`;
    
    // Fetch data from the googleTrends API using axios
    const response = await axios.get(targetUrl);
    const data = response.data;

    // Check if articles exist in the data
    const trendingSearches = data?.default?.trendingSearchesDays?.[0]?.trendingSearches || [];

    if (trendingSearches.length > 0) {
      for (const search of trendingSearches) {
        const articles = search.articles || [];

        for (const article of articles) {
          const { title, url, source = search.image?.source || '', snippet = '' } = article;

          // Check if the title already exists in the database
          const { data: existingArticle, error: selectError } = await supabase
            .from('googletrends')
            .select('id')
            .eq('title', title)
            .single();

          if (selectError && selectError.code !== 'PGRST116') {  // Check for specific 'not found' error
            console.error('Error checking existing title:', selectError);
            return NextResponse.json({ error: 'Error checking existing title' }, { status: 500 });
          }

          if (!existingArticle) {
            // Insert the article if it doesn't already exist
            const { error: insertError } = await supabase
              .from('googletrends')
              .insert([{
                geo,
                title,
                url,
                source,
                snippet,
                timestamp: new Date()  // Using current timestamp
              }]);

            if (insertError) {
              console.error('Error inserting data into Supabase:', insertError);
              return NextResponse.json({ error: 'Error inserting data into database' }, { status: 500 });
            }
          }
        }
      }

      return NextResponse.json({ message: 'Data inserted successfully or already exists' });
    } else {
      return NextResponse.json({ error: 'No articles available to save' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching data from googleTrends API:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}